const calculateTerm = require('./calculateTerm');
const purchaseController = {};

// purchaseController.buy = (req, res) => {
purchaseController.buy = async (req, res) => {
  try {
    const requiredFields = ['title', 'disc', 'price', 'tax', 'stock', 'amountOfBuy', 'creditDuration', 'AddAmountofCredit'];
    const missingFields = requiredFields.filter((field) => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields,
      });
    }
    const numericFields = ['price', 'disc', 'tax', 'stock', 'amountOfBuy', 'creditDuration', 'AddAmountofCredit'];

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

    const title = req.body.title;
    const discount = req.body.disc !== 0;
    const disc = req.body.disc;
    let price = req.body.price;
    const tax = req.body.tax;
    let stock = req.body.stock;
    let amountOfBuy = req.body.amountOfBuy;
    const creditDuration = req.body.creditDuration;
    const addPrice = req.body.AddAmountofCredit;
    let specificDate = req.body.specificDate;
    let desc;

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
      const specificdate = term.mapTerm.get(specificDate);
      // let specificdate;

      // for (let i = 0; i < term.mapTerm.length; i++) {
      //   if (term.mapTerm[i] == specificDate) {
      //     specificdate = term.mapTerm[i];
      //   }
      // }

      // console.log(specificdate);
      // console.log(specificdate);
      const purchase = {
        bookData: {
          title: title,
          price: price / amountOfBuy,
          stock: req.body.stock,
        },
        buyData: {
          amountOfBuy: amountOfBuy,
          amountofDisc: amountDisc,
          afterDisc: afterDisc,
          amountofTax: amountTax,
          afterTax: afterTax,
          additionalPrice: addPrice,
          totalPrice: totalPrice + addPrice,
        },
        listTerm: term.list,
        allTerms: Object.fromEntries(term.mapTerm),
        mustPay: specificdate,
        // mustPay: specificdate,
        desc: desc,
        restofStock: stock,
      };

      res.status(200).json(purchase); // convert to JSON
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = purchaseController;
