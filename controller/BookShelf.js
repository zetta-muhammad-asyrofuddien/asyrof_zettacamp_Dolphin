const Book = require('../models/BookSchema');
const Bookshelf = require('../models/BookShelfSchema');

const createbookshelf = async (req, res) => {
  try {
    const books = await Book.find();
    let arrBook = [];
    for (const bookidArr of books) {
      arrBook.push(bookidArr._id);
    }
    const datashelf = { books: arrBook };
    const bookshelf = await Bookshelf.create(datashelf);
    // console.log(arrBook);
    if (books.length === 0) {
      res.status(200).json({ msg: 'Book not found' });
    } else {
      res.status(200).json(bookshelf);
    }
    // books = await Book.find(id).populate('author', 'name -_id');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

const getbookshelf = async (req, res) => {
  try {
    const bookshelf = await Bookshelf.find({ books: { $in: ['65085bf45b81985818b81cb1'] } });
    console.log(bookshelf);
    if (bookshelf.length === 0) {
      res.status(200).json({ msg: 'Book not found' });
    } else {
      res.status(200).json(bookshelf);
    }
    // books = await Book.find(id).populate('author', 'name -_id');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};
module.exports = { createbookshelf, getbookshelf };
