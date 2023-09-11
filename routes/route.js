const purchaseController = require('../controller/purchaseController');

// const purches = require('./book.js');

const route = (app) => {
  app.post('/buy', purchaseController.buy);
  app.get('/', (req, res) => {
    res.send('Hello World');
  });
};

module.exports = route;
