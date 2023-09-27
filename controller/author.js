const app = require('../connMongoDB');
const Author = require('../models/AuthorSchema');

const createAuthor = async (req, res) => {
  try {
    app.conn();
    const authorData = req.body;
    const author = await Author.insertMany(authorData);

    res.status(201).json({ message: 'Author created successfully', author });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const getAllAuthor = async (req, res) => {
  try {
    app.conn();
    const author = await Author.find();
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    app.conn();
    // console.log(req.query.id);
    const author = await Author.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!author) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated successfully', author: author });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    app.conn();

    const author = await Author.findByIdAndDelete(req.query.id);
    console.log(req.query.id);
    if (!author) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Author deleted successfully', author: author });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

module.exports = { createAuthor, getAllAuthor, deleteAuthor, updateAuthor };
