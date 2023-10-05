const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    nation: {
      type: String,
    },
    // ... Add other fields specific to a book
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
