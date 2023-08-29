function bookPurchasing(name, price, disc, tax, stock, amountOfBuy, creditDuration) {
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
      console.log('Stok habis setelah pembelian ke-' + (i + 1) + '.');
      break;
    }
  }

  const term = Array.from({ length: creditDuration }, (_, index) => {
    const currentDate = new Date();
    let tanggal = currentDate.getDate() + 30 * index;
    let bulan = currentDate.getMonth() + 2;
    let tahun = currentDate.getFullYear();
    let amountTerm = totalPrice / creditDuration;

    while (bulan > 12) {
      bulan -= 12;
      tahun++;
    }

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

  console.log('--------------------------------------------------');
  console.log('Total Harga Pembelian         : ' + totalPrice);
  console.log('--------------------------------------------------');
  console.log('Jadwal Pembayaran Cicilan:');
  console.log(term);
}

bookPurchasing('Lanskar Pelangi', 1200000, 15, 2, 5, 3, 3);
