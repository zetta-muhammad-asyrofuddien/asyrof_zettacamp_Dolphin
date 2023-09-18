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
const disconnect = () => {
  mongoose
    .disconnect()
    .then(() => console.log('Disconnected from MongoDB'))
    .catch((error) => console.error('Error disconnecting from MongoDB:', error));
};

module.exports = { conn, disconnect };
