function printTotal(total, term) {
  console.log('--------------------------------------------------');
  console.log('Total Harga Pembelian         : ' + total);
  console.log('--------------------------------------------------');
  console.log('Jadwal Pembayaran Cicilan:');
  console.log(term);
}
module.exports = {
  printTotal,
};
