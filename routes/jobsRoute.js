const express = require('express');
const {
  createJobController,
  deleteJobController,
  getAllJobsController,
  jobStatsController,
  updateJobController,
} = require('../controllers/jobsController');
const userAuth = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
// CREATE JOB || POST
router.post('/create-job', userAuth, createJobController);

// GET JOBS || GET
router.get('/get-job', userAuth, getAllJobsController);

// UPDATE JOB || PATCH
router.patch('/update-job/:id', userAuth, updateJobController);

// DELETE JOB || DELETE
router.delete('/delete-job/:id', userAuth, deleteJobController);

// JOB STATS || GET
router.get('/job-stats', userAuth, jobStatsController);

module.exports = router;
