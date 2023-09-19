const mongoose = require('mongoose');
//bookschema
const bookshelfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
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
