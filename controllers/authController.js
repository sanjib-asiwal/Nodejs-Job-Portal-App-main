const userModel = require('../models/userModel');

// ====== REGISTER CONTROLLER ======
const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;
  // validate
  if (!name) {
    return next("name is required");
  }
  if (!email) {
    return next("email is required");
  }
  if (!password) {
    return next("password is required and greater than 6 characters");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next("Email Already Registered. Please Login");
  }
  const user = await userModel.create({ name, email, password });
  // token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

// ====== LOGIN CONTROLLER ======
const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  // validation
  if (!email || !password) {
    return next("Please Provide All Fields");
  }
  // find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next("Invalid Username or password");
  }
  // compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next("Invalid Username or password");
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};

module.exports = { registerController, loginController };
