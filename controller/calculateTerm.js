const calculateTerm = async (totalPrice, creditDuration, addPrice) => {
  let paid = 0;
  const terms = Array.from({ length: creditDuration }, (_, index) => {
    const currentDate = new Date();
    let tanggal = currentDate.getDate() + 30 * index;
    let bulan = currentDate.getMonth() + 2;
    let tahun = currentDate.getFullYear();

    const dueDate = new Date(tahun, bulan - 1, tanggal);

    const formatDate = dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    let amountTerm = totalPrice / creditDuration;

    if (creditDuration < 2) {
      paid += amountTerm + addPrice;
      //jika index hanya 1
      return {
        term: index + 1,
        additionalPrice: addPrice,
        beforeAdd: amountTerm,
        amountTerm: amountTerm + addPrice,
        date: formatDate,
        totalPaid: paid,
      };
    }
    if (index == creditDuration - 2) {
      paid += amountTerm + addPrice;
      //index kedua terakhir
      return {
        term: index + 1,
        additionalPrice: addPrice,
        beforeAdd: amountTerm,
        amountTerm: amountTerm + addPrice,
        date: formatDate,
        totalPaid: paid,
      };
    } else {
      paid += amountTerm;
      return {
        term: index + 1,
        amountTerm: amountTerm,
        date: formatDate,
        totalPaid: paid,
      };
    }
  });
  return terms;
};
module.exports = calculateTerm;
