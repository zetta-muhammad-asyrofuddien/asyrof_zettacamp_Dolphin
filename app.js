const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost:27017/BookPurchase';

const conn = () => {
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Connected to MongoDB on', dbUrl);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
};

module.exports = conn;
