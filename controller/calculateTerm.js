const calculateTerm = async (totalPrice, creditDuration, addPrice) => {
  let paid = 0;
  /////////////////////////////////////////////////////////////////////////////////////////////

  const setCreditAmount = new Set(); //Convert array object to array list of term amount

  /////////////////////////////////////////////////////////////////////////////////////////////

  const terms = Array.from({ length: creditDuration }, (_, index) => {
    const currentDate = new Date();
    let tanggal = currentDate.getDate() + 30 * index;
    let bulan = currentDate.getMonth() + 2;
    let tahun = currentDate.getFullYear();

    const dueDate = new Date(tahun, bulan - 1, tanggal);

    const formatDate = dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    /////////////////////////////////////////////////////////////////////////////////////////////

    // let amountTerm = totalPrice / creditDuration;
    let amountTerm = Math.ceil(totalPrice / creditDuration);
    // const termdistinct = new Set();

    if (index === creditDuration - 1) {
      amountTerm = totalPrice - paid + addPrice;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    // if (creditDuration < 2 || index == creditDuration - 2) {
    //   paid += amountTerm + addPrice;
    // } else {
    //   paid += amountTerm;
    // }

    // return {
    //   term: index + 1,
    //   additionalPrice: index == creditDuration - 2 ? addPrice : 0,
    //   beforeAdd: amountTerm,
    //   amountTerm: amountTerm + (index == creditDuration - 2 ? addPrice : 0),
    //   date: formatDate,
    //   totalPaid: paid,
    // };
    let result;
    let amountPadd;
    // if (creditDuration < 2 || index == creditDuration - 2) {

    // }

    if (creditDuration < 2 || (index == creditDuration - 2 && addPrice !== 0)) {
      amountPadd = amountTerm + addPrice;
      setCreditAmount.add(amountPadd);
      paid += amountTerm + addPrice;
      //jika index hanya 1
      result = {
        term: index + 1,
        additionalPrice: addPrice,
        beforeAdd: amountTerm,
        amountTerm: amountPadd,
        date: formatDate,
        totalPaid: paid,
      };
    } else {
      paid += amountTerm;
      result = {
        term: index + 1,
        amountTerm: amountTerm,
        date: formatDate,
        totalPaid: paid,
      };
    }
    setCreditAmount.add(amountTerm);

    return result;
  });

  /////////////////////////////////////////////////////////////////////////////////////////////

  const list = Array.from(setCreditAmount);
  // console.log(list);
  let a = Array.from(terms);
  const mapTerm = new Map(
    a.map((obj) => {
      return [obj.date, { ...obj }];
    })
  );

  /////////////////////////////////////////////////////////////////////////////////////////////
  // console.log(mapTerm);
  return { mapTerm, list };
};
module.exports = calculateTerm;
