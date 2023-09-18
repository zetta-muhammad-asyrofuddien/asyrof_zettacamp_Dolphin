const mongoose = require('mongoose');
//bookschema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId, //Embeded relation ref author
      ref: 'Author',
    },
    price: {
      type: Number,
      required: true,
      min: 0, //value must be greater than 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0, //value must be greater than 0
    },
    // ... Add other fields specific to a book
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
