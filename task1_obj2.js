bookPurchasing = (book, disc, tax) => {
  const bookAdditional = book;
  const diskon = disc / 100;
  const pajak = tax / 100;
  let amountDisc;
  let afterDisc;
  let amountTax;
  let afterTax;
  for (let i = 0; i < bookAdditional.length; i++) {
    afterDisc = bookAdditional[i].price;
    if (bookAdditional[i].isdiscount) {
      amountDisc = bookAdditional[i].price * diskon;
      afterDisc = bookAdditional[i].price - amountDisc;
    } else amountDisc = 0;
    amountTax = afterDisc * pajak;
    afterTax = afterDisc + amountTax;
    bookAdditional[i].additional = {
      amountDisc: amountDisc,
      afterDisc: afterDisc,
      amountTax: amountTax,
      afterTax: afterTax,
    };
  }
  return bookAdditional;
};

const book = [
  {
    title: 'Laskar Pelangi',
    price: 250000,
    isdiscount: false,
  },
  {
    title: 'Marmut Merah Jambu',
    price: 150000,
    isdiscount: true,
  },
  {
    title: 'Koala Kumal',
    price: 250000,
    isdiscount: true,
  },
  {
    title: 'Kuntilanak Beranak',
    price: 550000,
    isdiscount: false,
  },
];
let disc = 10;
let tax = 1;

console.log(bookPurchasing(book, disc, tax));
