const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

// Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // Fixed typo
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Fixed typo
      unique: true,
      validate: [validator.isEmail, "Invalid email format"], // Added a custom message
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Fixed typo
      minlength: [6, "Password length should be greater than 6 characters"], // Fixed typo
      select: false, // It’s generally safer to hide the password by default
    },
    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

// Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Fixed the check for password field
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Pass control to the next middleware
});

// Compare password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// JSON Web Token
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = mongoose.model('User', userSchema);
