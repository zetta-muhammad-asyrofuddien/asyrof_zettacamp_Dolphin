const purchaseController = require('../controller/purchaseController');
// const process = require('../controller/process');
const book = require('../controller/Books');
const author = require('../controller/author');
const Transtaction = require('../models/TransactionsSchema');

// const fileSystem = require('../controller/fs');

// const purches = require('./book.js');

const route = (app) => {
  app.post('/buy', purchaseController.buy);
  app.post('/createAuthor', author.createAuthor);
  app.post('/createBook', book.createBook);
  app.get('/readBook', book.getAllBooks);
  app.post('/updateBook', book.updateBook);
  app.post('/deleteBook', book.deleteBook);
  // app.get('/first', process.firstEndpoint);
  // app.get('/second', process.secondEndpoint);
  // app.get('/fs', fileSystem(fs));
  // app.get('/second', secondEndpoint);
};

module.exports = route;
