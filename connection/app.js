const mongoose = require('mongoose');
const User = require('../model/userModel');

// const userModel = require('../model/userModel');

const url = 'mongodb://localhost:27017/User';

const conn = mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // userModel.create();

    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    // Change "Error" to "error" here
    console.error('Error connecting to MongoDB:', error); // Change "Error" to "error" here
  });

module.exports = conn;
