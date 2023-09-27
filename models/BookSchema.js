const mongoose = require('mongoose');
//bookschema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, //Embeded relation ref author
      ref: 'Author',
      required: true,
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
    isAvalaible: {
      type: Boolean,
      default: true,
    },
    // ... Add other fields specific to a book
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
