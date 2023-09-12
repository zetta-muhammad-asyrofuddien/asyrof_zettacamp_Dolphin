const purchaseController = require('../controller/purchaseController');
const process = require('../controller/process');
const fileSystem = require('../controller/fs');

// const purches = require('./book.js');

const route = (app, fs) => {
  app.post('/buy', purchaseController.buy);
  app.get('/first', process.firstEndpoint);
  app.get('/second', process.secondEndpoint);
  // app.get('/fs', fileSystem(fs));
  // app.get('/second', secondEndpoint);
};

module.exports = route;
