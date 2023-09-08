const purchaseController = {};

purchaseController.buy = (req, res) => {
  const title = req.body.title;
  const discount = req.body.disc !== 0;
  const disc = req.body.disc;
  const price = req.body.price;
  const tax = req.body.tax;
  let stock = req.body.stock;
  let amountOfBuy = req.body.amountOfBuy;
  const creditDuration = req.body.creditDuration;
  let desc;
  if (stock == 0) {
    res.send('Buku Habis');
  } else {
    let amountDisc;
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
        //   console.log('Pembelian ke-' + (i + 1) + ' berhasil.');
        desc = 'Pembelian Berhasil';
      } else {
        //   console.log('Stok habis setelah pembelian ke-' + (i + 1) + '.');
        amountOfBuy = i;
        desc = 'Stok habis di pembelian ke-' + (i + 1) + '.';
        break;
      }
    }
    const amountTerm = totalPrice / creditDuration;
    const term = Array.from({ length: creditDuration }, (_, index) => {
      const currentDate = new Date();
      let tanggal = currentDate.getDate() + 30 * index;
      let bulan = currentDate.getMonth() + 2;
      let tahun = currentDate.getFullYear();

      // while (bulan > 12) {
      //   bulan -= 12;
      //   tahun++;
      // }

      const dueDate = new Date(tahun, bulan - 1, tanggal);

      const formatDate = dueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return {
        term: index + 1,
        amountTerm: amountTerm,
        date: formatDate,
      };
    });

    const purchase = {
      title: title,
      price: price,
      stock: req.body.stock,
      amountDisc: amountDisc,
      afterDisc: afterDisc,
      amountTax: amountTax,
      afterTax: afterTax,
      amountOfBuy: amountOfBuy,
      totalPrice: totalPrice,
      term: term,
      desc: desc,
      restofStock: stock,
    };
    res.json(purchase);
  }
};

module.exports = purchaseController;
