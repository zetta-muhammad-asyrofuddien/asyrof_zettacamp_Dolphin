const Book = require('../models/BookSchema');
const Bookshelf = require('../models/BookShelfSchema');

const createbookshelf = async (req, res) => {
  //create bookshelf
  try {
    const books = await Book.find();

    const totalBooks = books.length;

    // Calculate the approximate(perkiraan) number of books for each bookshelf
    //just shuffle Fisher-Yates algorithm
    const numBooksPerShelf = Math.ceil(totalBooks / 2);
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        // console.log(array)
      }
    }
    // const shuffledData = [1,2,3,5,4,6,8,7,4,6,5];

    shuffleArray(books); //call shuffle function

    // Divide the books into two groups for the bookshelves
    const booksGroup1 = books.slice(0, numBooksPerShelf); //slice from index 0 to numBooksPerShelf
    const booksGroup2 = books.slice(numBooksPerShelf); //slice from numBooksPerShelf

    // Extract book IDs for each group
    const bookIdsGroup1 = booksGroup1.map((book) => book._id); //take the id of book
    const bookIdsGroup2 = booksGroup2.map((book) => book._id);

    // Create the two bookshelves
    const bookshelf1 = await Bookshelf.create({ name: 'bookshelf 3', books: bookIdsGroup1 }); //create bookshelf
    const bookshelf2 = await Bookshelf.create({ name: 'bookshelf 4', books: bookIdsGroup2 }); //create bookshelf

    // console.log(arrBook);
    if (books.length === 0) {
      res.status(200).json({ msg: 'Book not found' });
    } else {
      res.status(200).json({ bookshelf1, bookshelf2 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
  // app.disconnect();
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
      bookshelf = await Bookshelf.find().select('-__v');
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
    //////////////
    //Delete Array//
    /////////////
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
module.exports = { createbookshelf, getbookshelf, updateBookshelf, updateBookshelf2, deleteBookshelf };
