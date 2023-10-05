const purchaseController = require('../controller/purchaseController');
// const process = require('../controller/process');
const book = require('../controller/Books');
const author = require('../controller/author');
const bookshelf = require('../controller/BookShelf');

// const fileSystem = require('../controller/fs');

// const purches = require('./book.js');

const route = (app) => {
  app.post('/buy', purchaseController.buy);
  app.post('/createAuthor', author.createAuthor);
  app.post('/createBook', book.createBook);
  app.post('/readBook', book.getAllBooks);
  app.post('/updateBook', book.updateBook);
  app.post('/deleteBook', book.deleteBook);

  //route bookshelf
  app.get('/bookshelf', bookshelf.createbookshelf);
  app.get('/readshelf', bookshelf.getBookshelf);
  app.post('/readshelf', bookshelf.getBookshelfElemMatch);
  app.post('/arrayfilter', bookshelf.arrayFilter);
  app.put('/updateshelf/:id', bookshelf.updateBookshelf);
  app.put('/updateshelf2/:id', bookshelf.updateBookshelf2);
  // app.del('/deleteshelf/:id', bookshelf.deleteBookshelf);

  //Mongo Day 5
  app.post('/aggregate', bookshelf.getBookAggregate);
  app.post('/unwind', bookshelf.getBookshelfUnwind);
};

module.exports = route;
