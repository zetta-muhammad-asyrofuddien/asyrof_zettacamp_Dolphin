const mongoose = require('mongoose');
//bookschema
const bookshelfSchema = new mongoose.Schema(
  {
    genres: [
      {
        type: String,
        require: true,
      },
    ],
    books: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref: 'Book',
        },
        isAvailable: {
          type: Boolean,
        },
        stock: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bookshelf = mongoose.model('bookshelf', bookshelfSchema);

module.exports = Bookshelf;
