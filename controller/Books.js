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

    const grup = req.body.grup;
    const pageSize = req.body.dataperpage; // Number of items per page
    const page = req.body.page; // Current page
    if (page < 0) {
      return res.status(500).json({ msg: 'Page ' + page + ' not found' });
    }
    let facet;
    let sort;
    let pipeline;
    if (grup === 'author') {
      sort = {
        $sort: { title: 1 },
      };
      facet = {
        $facet: {
          groupByAuthor: [
            {
              $group: {
                _id: '$author',
                Books: { $push: { title: '$title', price: '$price', stock: '$stock' } },
              },
            },
            {
              $sort: { 'Books.title': 1 },
            },
          ],
        },
      };
    } else if (grup === 'price') {
      facet = {
        $facet: {
          groupByLowestPrice: [
            {
              $group: {
                _id: '$price',
                Books: { $push: { title: '$title', price: '$price', stock: '$stock', author: '$author' } },
              },
            },
            {
              $sort: { 'Books.price': 1 },
            },
          ],
          groupByHighestPrice: [
            {
              $group: {
                _id: '$price',
                Books: { $push: { title: '$title', price: '$price', stock: '$stock', author: '$author' } },
              },
            },
            {
              $sort: { 'Books.price': -1 },
            },
          ],
        },
      };
    } else if (grup === 'stock') {
      facet = {
        $facet: {
          groupByLowestStock: [
            {
              $group: {
                _id: '$stock',
                Books: { $push: { title: '$title', price: '$price', stock: '$stock', author: '$author' } },
              },
            },
            {
              $sort: { 'Books.stock': 1 },
            },
          ],
          groupByHighestStock: [
            {
              $group: {
                _id: '$stock',
                Books: { $push: { title: '$title', price: '$price', stock: '$stock', author: '$author' } },
              },
            },
            {
              $sort: { 'Books.stock': -1 },
            },
          ],
        },
      };
    } else if (!grup) {
      sort = {
        $sort: { title: 1 },
      };
      facet = {
        $facet: {
          books: [
            {
              $sort: { title: 1 },
            },
          ],
        },
      };
    } else {
      return res.status(500).json({ msg: grup + ' Group not found' });
    }
    if (grup) {
      if (grup === 'stock') {
        sort = { $sort: { stock: 1 } };
      } else if (grup === 'price') {
        sort = { $sort: { price: 1 } };
      }
      pipeline = [
        sort,
        { $skip: page * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: 'authors',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo',
          },
        },
        {
          $addFields: {
            author: '$authorInfo.name',
          },
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            authorInfo: 0,
          },
        },
        facet,
      ];
    } else {
      pipeline = [
        {
          $sort: { title: 1 },
        },
        { $skip: page * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: 'authors',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo',
          },
        },
        {
          $addFields: {
            author: '$authorInfo.name',
          },
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            authorInfo: 0,
          },
        },
        facet,
      ];
    }

    const get = await Book.find();
    const book = await Book.aggregate(pipeline);

    const totalItem = get.length;
    const pageTotal = Math.floor(totalItem / pageSize);

    const result = {
      BookTotal: totalItem,
      DataperPage: pageSize,
      page: page + ' / ' + pageTotal,
    };

    if (page <= pageTotal) {
      res.status(200).json({ pageInfo: result, book });
    } else {
      res.status(500).json({ msg: 'Page is empty' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
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
