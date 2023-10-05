const mongoose = require('mongoose');
//bookschema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    genre: {
      type: String,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId, //Embeded relation ref author
      ref: 'Author',
    },
    price: {
      type: Number,
      min: 0, //value must be greater than 0
    },
    stock: {
      type: Number,

      min: 0, //value must be greater than 0
    },
    is_avalaible: {
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
