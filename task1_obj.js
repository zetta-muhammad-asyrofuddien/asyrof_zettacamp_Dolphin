bookPurchasing = (book, disc, tax) => {
  const diskon = disc / 100;
  const pajak = tax / 100;
  let amountDisc;
  let afterDisc;
  let amountTax;
  let afterTax;
  console.log('--------------------------------------------------');
  console.log('Gramedia Store');
  console.log('--------------------------------------------------');
  for (let i = 0; i < book.length; i++) {
    afterDisc = book[i].price;
    if (book[i].isdiscount) {
      amountDisc = book[i].price * diskon;
      afterDisc = book[i].price - amountDisc;
    } else amountDisc = 0;
    amountTax = afterDisc * pajak;
    afterTax = afterDisc + amountTax;
    console.log('Nama Buku                    : ' + book[i].title);
    console.log('Harga Buku                   : ' + book[i].price);
    console.log('Diskon                       : ' + amountDisc);
    console.log('Harga Setalah Diskon         : ' + afterDisc);
    console.log('Pajak                        : ' + amountTax);
    console.log('Harga Setelah Pajak Pajak    : ' + afterTax);
    console.log('--------------------------------------------------');
  }
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

bookPurchasing(book, disc, tax);

//////////////////////////////////////
