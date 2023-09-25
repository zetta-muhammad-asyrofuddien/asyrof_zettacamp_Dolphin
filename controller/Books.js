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
    const author = req.body.author;
    const pageSize = req.body.dataperpage; // Number of items per page
    const page = req.body.page; // Current page
    const pipeline = [
      {
        $lookup: {
          from: 'authors',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo',
        },
      },
      {
        $match: { 'authorInfo.name': author },
      },
      {
        $addFields: {
          author: author,
        },
      },
      {
        $project: {
          authorInfo: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
      {
        $facet: {
          totalData: [{ $count: 'totalItems' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ];

    const book = await Book.aggregate(pipeline);
    const totalItem = book[0].totalData[0].totalItems;
    const pageTotal = Math.ceil(totalItem / pageSize);
    // console.log(book[0].totalData[0].totalItems);

    const result = {
      Author: author,
      BookTotal: totalItem,
      DataperPage: pageSize,
      page: page + ' / ' + pageTotal,
      books: book[0].data,
    };

    if (page <= pageTotal) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ msg: 'Page is empty' });
    }
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
