const app = require('../app');
const Book = require('../models/BookSchema');

const createBook = async (req, res) => {
  try {
    // app.conn(); //call connection
    const booksData = req.body; //collect books data from body request
    // console.log(booksData);

    for (const bookData of booksData) {
      await Book.create(bookData); //create document to database one by one because the body is array of obj
    }

    // Create a new book using the Book model
    // create more then 1 books
    // const books = await Book.insertMany(booksData);
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

    res.status(201).json({ message: booksData.length + ' Book created successfully' }); // send a response to postman
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

const getAllBooks = async (req, res) => {
  try {
    // app.conn();
    const title = { title: req.query.title };
    const id = { author: req.query.id };
    const author = req.query.author;
    // console.log(title);
    // const booksWithAuthors = await Book.aggregate([
    //   {
    //     $lookup: {
    //       from: 'authors', // The name of the collection to join (case sensitive)
    //       localField: 'author', // The field from the Book collection
    //       foreignField: '_id', // The field from the Author collection
    //       as: 'authorInfo', // The alias for the joined information
    //     },
    //   },
    // ]);
    let books;
    // console.log(author);
    // books = await Book.find(id);
    // books = await Book.find().populate('author', 'name -_id');
    const pageSize = req.body.dataperpage; // Number of items per page
    const page = req.body.page; // Current page
    const pipeline = [
      {
        $facet: {
          totalData: [{ $count: 'totalItems' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ];

    const result = await Book.aggregate(pipeline);

    // Return the paginated data and metadata (totalItems)

    res.status(200).json(result);
    // res.status(200).json({
    //   totalItems: totalData.totalItems,
    //   totalPages: Math.ceil(totalData.totalItems / pageSize),
    //   currentPage: page,
    //   pageSize: pageSize,
    //   data: paginatedData,
    // });

    // books = await Book.find(id).populate('author', 'name -_id');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

const updateBook = async (req, res) => {
  try {
    // app.conn();
    // console.log(req.query.id);
    const updatedBook = await Book.findByIdAndUpdate(req.query.id, req.body, { new: true }); //{ new: true } just makesure the return is the new data
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

const deleteBook = async (req, res) => {
  try {
    // app.conn();
    // const deletedBook = await Book.findByIdAndDelete(req.query.id);
    const id = {
      author: req.query.id_author,
    };
    const deletedBook = await Book.deleteMany(id);
    console.log(req.query.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

module.exports = { createBook, getAllBooks, deleteBook, updateBook };
