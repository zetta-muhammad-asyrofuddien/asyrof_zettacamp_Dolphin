const purchaseController = require('../controller/purchaseController');

// const purches = require('./book.js');

const route = (app) => {
  app.post('/buy', purchaseController.buy);
};

module.exports = route;
