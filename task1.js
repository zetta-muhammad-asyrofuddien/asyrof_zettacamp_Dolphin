function bookPurchasing(name, price, disc, tax, stock, amountOfBuy) {
  let title = 'Gramedia Store';
  const discount = disc !== 0;
  const initialStock = stock;
  let amountDisc;
  let afterDisc = price;

  if (discount) {
    amountDisc = price * (disc / 100);
    afterDisc = price - amountDisc;
  } else {
    amountDisc = 0;
  }

  let amountTax = afterDisc * (tax / 100);
  let afterTax = afterDisc + amountTax;

  console.log('--------------------------------------------------');
  console.log(title);
  console.log('--------------------------------------------------');
  console.log('Nama Buku                    : ' + name);
  console.log('Harga Buku                   : ' + price);
  console.log('--------------------------------------------------');
  console.log('Diskon                       : ' + amountDisc);
  console.log('Harga Setelah Diskon         : ' + afterDisc);
  console.log('--------------------------------------------------');
  console.log('Pajak                        : ' + amountTax);
  console.log('Harga Setelah Pajak          : ' + afterTax);
  console.log('--------------------------------------------------');

  let totalPrice = 0;

  for (let i = 0; i < amountOfBuy; i++) {
    if (stock > 0) {
      stock--;
      totalPrice += afterTax;
      console.log('Pembelian ke-' + (i + 1) + ' berhasil.');
    } else {
      console.log('Stok habis setelah pembelian ke-' + i + '.');
      break;
    }
  }
  console.log('--------------------------------------------------');
  console.log('Total Harga Pembelian         : ' + totalPrice.toFixed(2));
}

bookPurchasing('Lanskar Pelangi', 1000000, 15, 2, 5, 3); // Example purchase
bookPurchasing('Lanskar Pelangi', 1000000, 15, 2, 2, 3);
