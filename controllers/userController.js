const userModel = require('../models/userModel'); // Adjust path as necessary

const updateUserController = async (req, res, next) => {
  const { name, email, lastName, location } = req.body;
  if (!name || !email || !lastName || !location) {
    return next("Please Provide All Fields");
  }
  const user = await userModel.findOne({ _id: req.user.userId });
  if (!user) {
    return next("User Not Found");
  }
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  const token = user.createJWT();
  res.status(200).json({
    user,
    token,
  });
};

module.exports = { updateUserController };
