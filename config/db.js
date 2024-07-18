// import mongoose from "mongoose";
// import colors from "colors";
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    // console.log(
    //   `Connected To Mongodb Database ${mongoose.connection.host}`.bgMagenta
    //     .white
    // );
  } catch (error) {
   // console.log(`MongoDB Erorr ${error}`.bgRed.white);
  }
};

module.exports = connectDB;

