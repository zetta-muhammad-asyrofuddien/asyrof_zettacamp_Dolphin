const conn = require('../app');
const Book = require('../models/BookSchema');

const createBook = async (req, res) => {
  try {
    conn();
    const booksData = req.body;

    // Create a new book using the Book model
    // create more then 1 books
    const books = await Book.insertMany(booksData);
    // Save the book to the database
    // Create a new book using the Book model

    //create one book

    // const book = new Book({
    //   title,
    //   author,
    //   price,
    //   stock,
    // });

    // // Save the book to the database
    // await book.save();

    res.status(201).json({ message: 'Book created successfully', books });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    conn();
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    conn();
    // console.log(req.query.id);
    const updatedBook = await Book.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    conn();
    const deletedBook = await Book.findByIdAndDelete(req.query.id);
    console.log(req.query.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

module.exports = { createBook, getAllBooks, deleteBook, updateBook };
