const mongoose = require('mongoose');
//bookschema
const bookshelfSchema = new mongoose.Schema(
  {
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bookshelf = mongoose.model('bookshelf', bookshelfSchema);

module.exports = Bookshelf;
