const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    nation: {
      type: String,
      required: true,
    },
    // ... Add other fields specific to a book
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
