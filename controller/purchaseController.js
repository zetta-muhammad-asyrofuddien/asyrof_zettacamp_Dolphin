const app = require('../app');
const Book = require('../models/BookSchema');
const Transtaction = require('../models/TransactionsSchema');
const calculateTerm = require('./calculateTerm');
const purchaseController = {};

// purchaseController.buy = (req, res) => {
purchaseController.buy = async (req, res) => {
  try {
    const requiredFields = ['disc', 'tax', 'amountOfBuy', 'creditDuration', 'AddAmountofCredit'];
    const missingFields = requiredFields.filter((field) => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields,
      });
    }
    const numericFields = ['disc', 'tax', 'amountOfBuy', 'creditDuration', 'AddAmountofCredit'];

    for (const field of numericFields) {
      if (typeof req.body[field] !== 'number') {
        return res.status(400).json({
          error: `${field} must be a number`,
        });
      }
      if (req.body[field] < 0) {
        return res.status(400).json({
          error: `${field} must be a not minus`,
        });
      }
    }
    app.conn();
    // console.log(req.body.bookId);

    const books = await Book.findById(req.body.bookId);
    const bookId = books._id;
    // console.log(bookId);
    // const title = books.title;
    const discount = req.body.disc !== 0;
    const disc = req.body.disc;
    let price = books.price;
    const tax = req.body.tax;
    let stock = books.stock;
    let amountOfBuy = req.body.amountOfBuy;
    const creditDuration = req.body.creditDuration;
    const addPrice = req.body.AddAmountofCredit;
    // let specificDate = req.body.specificDate;

    if (stock == 0) {
      res.status(410).json({
        msg: 'Buku Habis',
      }); // if stock is 0 then it will send a 410 response with msg
    } else {
      let amountDisc;
      price *= amountOfBuy;
      let afterDisc = price;
      if (discount) {
        amountDisc = price * (disc / 100);
        afterDisc = price - amountDisc;
      } else {
        amountDisc = 0;
      }
      let amountTax;
      amountTax = afterDisc * (tax / 100);
      let afterTax = afterDisc + amountTax;
      afterTax = afterDisc + amountTax;
      let totalPrice = 0;

      for (let i = 0; i < amountOfBuy; i++) {
        if (stock > 0) {
          stock--;
          totalPrice += afterTax;
          // console.log('Pembelian ke-' + (i + 1) + ' berhasil.');
          desc = 'Pembelian Berhasil';
        } else {
          // console.log('Stok habis setelah pembelian ke-' + (i + 1) + '.');
          amountOfBuy = i;
          desc = 'Stok habis di pembelian ke-' + (i + 1) + '.';
          break;
        }
      }

      // const term = calculateTerm(totalPrice, creditDuration, addPrice);
      let term;
      try {
        term = await calculateTerm(totalPrice, creditDuration, addPrice);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      // const specificdate = term.mapTerm.get(specificDate); //certain data using map
      // console.log(specificdate);
      // const termDataArray = Array.from(term.termMap, ([date, data]) => ({ date, ...data }));
      // console.log(termDataArray);
      // await Transtaction.Term.insertMany(...term.mapTerm);

      const purchase = {
        bookData: bookId,
        buyData: {
          amountOfBuy: amountOfBuy,
          amountofDisc: amountDisc,
          afterDisc: afterDisc,
          amountofTax: amountTax,
          afterTax: afterTax,
          additionalPrice: addPrice,
          totalPrice: totalPrice + addPrice,
        },
        allTerms: Object.fromEntries(term.mapTerm),
      };
      // console.log(term.mapTerm);

      // const Transactions = await Transtaction.Transtaction.insertMany(purchase);
      // await Transtaction.Term.insertMany(term.TermArr);
      // const Term = await Transtaction.Term.insertMany(Array.from(term.mapTerm));

      //Purchasing Book
      const books = await Book.findOne(bookId);
      const newStock = {
        stock: books.stock - amountOfBuy,
      };
      const titleBookBuy = {
        title: books.title,
      };
      await Book.updateOne(titleBookBuy, newStock, { new: true });
      const Buybooks = await Book.findOne(bookId);
      return res.status(201).json({ message: 'Transaction created successfully', PurchasedBook: Buybooks });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = purchaseController;
