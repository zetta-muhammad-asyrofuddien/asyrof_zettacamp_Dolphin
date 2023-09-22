const Book = require('../models/BookSchema');
const Bookshelf = require('../models/BookShelfSchema');

const createbookshelf = async (req, res) => {
  //distinct
  try {
    const books = await Book.find().select('_id');

    //get distinct data from book's genre
    const distinctBook = await Book.distinct('genre');

    // Extract book IDs for each group
    const bookId = books.map((book) => book._id);

    // Create the two bookshelves
    const bookshelf = await Bookshelf.create({ genres: distinctBook, books: bookId }); //create bookshelf

    // console.log(arrBook);
    if (books.length === 0) {
      res.status(200).json({ msg: 'Book not found' });
    } else {
      res.status(200).json({ bookshelf });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

const getbookshelfElemMatch = async (req, res) => {
  try {
    const isAvailable = req.body.isAvailable; //collect from body request
    const stock = req.body.stock; //collect from body request

    // const bookshelf = await Bookshelf.find()
    //   .populate({
    //     path: 'books',
    //     books: { $elemMatch: { genre: 'Romance', price: 150000 } }, // Your filtering criteria
    //   })
    //   .select('genres books');

    // const bookshelf = await Bookshelf.updateOne(
    //   { _id: '650a644329e8062d1c240a94' },
    //   { $set: { 'books.$[elem]': ObjectId('650a643429e8062d1c240a90') } },
    //   { arrayFilters: [{ elem: { $in: [ObjectId('650a424796b09d765017e695'), ObjectId('650a424796b09d765017e697')] } }] }
    // );

    //search document in Bookshelf collection use array of obj from books as a filter with elemMatch
    const bookshelf = await Bookshelf.find({ books: { $elemMatch: { stock: stock, isAvailable: isAvailable } } }).select('genres books');
    // const bookshelf = await Bookshelf.find({ books: { $elemMatch: { stock: { $lte: stock }, isAvailable: isAvailable } } }).select(
    //   'genres books'
    // );
    if (bookshelf.length === 0) {
      res.status(404).json({ msg: 'Data not found' });
    } else {
      res.status(200).json(bookshelf);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getbookshelf = async (req, res) => {
  //get bookshelf data
  try {
    const filter = req.query.id;
    const size = req.query.size;

    if (filter && size) {
      return res.status(400).json({ error: 'Internal Server Error', msg: 'Pilih satu aja bang' });
    }

    let bookshelf;
    if (filter) {
      // console.log(filter.length);
      if (filter.length === 2) {
        bookshelf = await Bookshelf.find({ $and: [{ books: filter[0] }, { books: filter[1] }] });
      } else {
        bookshelf = await Bookshelf.find({ books: filter }).select('-__v');
      }
    } else if (size) {
      bookshelf = await Bookshelf.find({ books: { $size: size } });
    } else {
      bookshelf = await Bookshelf.find().select('genres books');
    }
    if (!bookshelf) {
      return res.status(401).json({ error: 'Internal Server Error', msg: 'Book is empty' });
    }
    // console.log(bookshelf);
    if (bookshelf.length === 0) {
      if (filter.length > 1) {
        return res.status(400).json({ error: 'Internal Server Error', msg: 'Book not found' });
      }
    } else {
      res.status(200).json(bookshelf);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
};

const updateBookshelf = async (req, res) => {
  // update ( delete array value )
  try {
    const filter = req.params.id;
    const bookRmv = req.body.book;

    let book;
    ////////////////
    //Delete Array//
    ///////////////
    const valbook = await Bookshelf.find({ books: { $in: bookRmv } }); //check the book with id from body request is exist in the array
    if (valbook.length !== 0) {
      //if book data exist
      if (filter) {
        //if the filter is exist
        book = await Bookshelf.updateOne({ books: { $in: filter } }, { $pull: { books: bookRmv } }); //$pull -> remove field in the array with book if as a filter

        res.status(200).json({ msg: 'BookId Delete Successfully' });
      } else {
        res.status(400).json({ error: 'Bad Request', msg: 'insert filter' });
      }
    } else {
      res.status(400).json({ msg: 'BookId not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const updateBookshelf2 = async (req, res) => {
  // update ( add array value )
  try {
    const filter = req.params.id;
    const bookRmv = req.body.book;

    let book;

    /////////////
    //Add Array//
    /////////////

    book = await Bookshelf.updateOne({ books: { $in: filter } }, { $addToSet: { books: bookRmv } }); //$addToset like a set() method (should)
    if (book.nModified === 1) {
      res.status(200).json({ msg: 'Add BookId Successfully', book });
    } else {
      res.status(404).json({ error: 'Book not found in bookshelf.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const deleteBookshelf = async (req, res) => {
  // delete document of bookshelf collection
  try {
    const filter = req.body.book;
    const delbook = await Bookshelf.deleteOne({ books: filter }); //delete the bookshelf document with bookid as a filter
    // console.log(valbook);
    if (delbook.deletedCount !== 0) {
      res.status(200).json({ msg: 'Bookshelf Deleted', Deleted: delbook.deletedCount });
    } else {
      res.status(400).json({ msg: 'Bookshelf fail to Delete' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const arrayFilter = async (req, res) => {
  try {
    //collect data from request body
    const id = req.body._id;
    const isAvailable = req.body.isAvailable;
    const stock = req.body.stock;

    const update = await Bookshelf.updateOne(
      { _id: id }, //filter the bookshelf with id
      {
        $set: {
          //the modify

          'books.$[elem].isAvailable': isAvailable, // Replace with the new book ID you want to set
        },
      },
      { arrayFilters: [{ 'elem.stock': stock }] } //array filter
    );
    if (update.nModified > 0) {
      res.status(200).json({ msg: true, update });
    } else {
      res.status(400).json({ msg: false, update });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const getBookAggregate = async (req, res) => {
  try {
    const author = req.body.author;
    const projectionAddFields = await Book.aggregate([
      // The specified fields can be existing fields from the input documents or newly

      {
        //Performs a left outer join to a collection in the same database to filter in documents from the "joined" collection for processing.
        $lookup: {
          from: 'authors', //destination collection name
          localField: 'author', //field in the curent document
          foreignField: '_id', // The field name in the destination collection that will be used as the matching key.
          as: 'author', //name for new field to save new data from destination collection
        },
      },
      // Filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.
      { $match: { 'author.name': author, stock: { $gte: 30 } } }, //the document should match with the request body
      {
        $project: {
          title: {
            $concat: ['$title', ' ( ', '$genre', ' )'], //merge values title and genre and adding literal
          },
          price: 1,
          stock: 1,
          'author.name': 1,
        },
      },
      //Sorts all input documents and returns them to the pipeline in sorted order.
      { $sort: { title: -1 } }, //1 to ascending , -1 to descending
      {
        $addFields: {
          status: {
            $cond: {
              if: { $lt: ['$stock', 50] }, //if stock less then 50
              then: 'STOCK HAMPIR HABIS !!!', //value true
              else: 'Masih banyak aman', //value false
            },
          },
        },
      },
    ]);

    if (!projectionAddFields) {
      res.status(500).json({ msg: 'Book Not Found' });
    } else {
      res.status(200).json({ data: projectionAddFields });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const getBookshelfUnwind = async (req, res) => {
  try {
    const bookshelfUnwind = await Bookshelf.aggregate([
      { $match: { genres: { $in: ['Drama'] } } }, //i just wanna collect the document have a Drama genre

      { $project: { genres: 1, books: 1 } }, // $project is a stage in the aggregate used for reshape document
      //to spread / Deconstructs the array data. Each output document is the input document with the value of the array field replaced by the element.
      //   { $unwind: '$books' }, // array book will be separated one by one
      {
        $lookup: {
          from: 'books', //destination collection name
          //   localField: 'books', //field in the curent document
          //   foreignField: '_id', // The field name in the destination collection that will be used as the matching key.
          //   pipeline to execute on the joined collection
          pipeline: [{ $sort: { stock: 1 } }, { $lookup: { from: 'authors', localField: 'author', foreignField: '_id', as: 'author' } }],
          as: 'books', //name for new field to save new data from destination collection
        },
      },

      {
        $project: {
          'books.__v': 0,
          'books.createdAt': 0,
          'books.updatedAt': 0,
          'books.author.__v': 0,
          'books.createdAt': 0,
          'books.updatedAt': 0,
          'books.author.createdAt': 0,
          'books.author.updatedAt': 0,
          'books.author._id': 0,
        },
      },
    ]);

    if (!bookshelfUnwind) {
      res.status(500).json({ msg: 'Book Not Found' });
    } else {
      res.status(200).json(bookshelfUnwind);
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  arrayFilter,
  createbookshelf,
  getbookshelf,
  updateBookshelf,
  updateBookshelf2,
  deleteBookshelf,
  getbookshelfElemMatch,
  getBookAggregate,
  getBookshelfUnwind,
};
