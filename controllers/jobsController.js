const jobsModel = require('../models/jobsModel'); // Adjust path if necessary
const mongoose = require('mongoose');
const moment = require('moment');

// ====== CREATE JOB ======
const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    return next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({ job });
};

// ======= GET JOBS ===========
const getAllJobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  // conditions for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  // logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  // sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  // jobs count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

// ======= UPDATE JOBS ===========
const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  // validation
  if (!company || !position) {
    return next("Please Provide All Fields");
  }
  // find job
  const job = await jobsModel.findOne({ _id: id });
  // validation
  if (!job) {
    return next(`No jobs found with this id ${id}`);
  }
  if (req.user.userId.toString() !== job.createdBy.toString()) {
    return next("You are not authorized to update this job");
  }
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  // response
  res.status(200).json({ updateJob });
};

// ======= DELETE JOBS ===========
const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  // find job
  const job = await jobsModel.findOne({ _id: id });
  // validation
  if (!job) {
    return next(`No Job Found With This ID ${id}`);
  }
  if (req.user.userId.toString() !== job.createdBy.toString()) {
    return next("You are not authorized to delete this job");
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
};

// ======= JOBS STATS & FILTERS ===========
const jobStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    // search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // default stats
  const defaultStats = {
    pending: stats.find(stat => stat._id === 'pending')?.count || 0,
    reject: stats.find(stat => stat._id === 'reject')?.count || 0,
    interview: stats.find(stat => stat._id === 'interview')?.count || 0,
  };

  // monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication });
};

module.exports = {
  createJobController,
  getAllJobsController,
  updateJobController,
  deleteJobController,
  jobStatsController,
};
