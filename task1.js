function bookPurchasing(name, price, disc, tax) {
  let title = 'Gramedia Store';
  const discount = disc != 0 ? true : false;
  let amountDisc;
  let afterDisc = price;
  // console.log(discount);
  if (discount) {
    amountDisc = price * (disc / 100);
    afterDisc = price - amountDisc;
  } else amountDisc = 0;

  let amountTax = afterDisc * (tax / 100);
  let afterTax = afterDisc + amountTax;

  console.log('--------------------------------------------------');
  console.log(title);
  console.log('--------------------------------------------------');
  console.log('Nama Buku                    : ' + name);
  console.log('Harga Buku                   : ' + price);
  console.log('--------------------------------------------------');
  console.log('Diskon                       : ' + amountDisc);
  console.log('Harga Setalah Diskon         : ' + afterDisc);
  console.log('--------------------------------------------------');
  console.log('Pajak                        : ' + amountTax);
  console.log('Harga Setelah Pajak Pajak    : ' + afterTax);
}

bookPurchasing('Lanskar Pelangi', 1000000, 15, 2);
bookPurchasing('Lanskar Pelangi', 1000000, 0, 2);
