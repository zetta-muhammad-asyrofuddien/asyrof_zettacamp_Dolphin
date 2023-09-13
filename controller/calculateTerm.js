const calculateTerm = async (totalPrice, creditDuration, addPrice) => {
  let paid = 0;
  /////////////////////////////////////////////////////////////////////////////////////////////

  const setCreditAmount = new Set(); //Declare new set
  const mapTerm = new Map(); //Declare new map

  /////////////////////////////////////////////////////////////////////////////////////////////

  Array.from({ length: creditDuration }, (_, index) => {
    const currentDate = new Date();
    let tanggal = currentDate.getDate() + 30 * index;
    let bulan = currentDate.getMonth() + 2;
    let tahun = currentDate.getFullYear();

    const dueDate = new Date(tahun, bulan - 1, tanggal);

    const formatDate = dueDate.toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
    /////////////////////////////////////////////////////////////////////////////////////////////

    // let amountTerm = totalPrice / creditDuration;
    let amountTerm = Math.ceil(totalPrice / creditDuration);
    // const termdistinct = new Set();

    if (index === creditDuration - 1) {
      amountTerm = totalPrice % amountTerm;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    let amountPadd;
    //term has an additional price the amount term add add price
    if (creditDuration < 2 || (index == creditDuration - 2 && addPrice !== 0)) {
      amountPadd = amountTerm + addPrice;
      setCreditAmount.add(amountPadd); //add amount term to set
      paid += amountTerm + addPrice;
      //jika index hanya 1

      //add map with date as keys and detail term as values
      mapTerm.set(formatDate, {
        term: index + 1,
        additionalPrice: addPrice,
        beforeAdd: amountTerm,
        amountTerm: amountPadd,
        date: formatDate,
        totalPaid: paid,
      });
    } else {
      paid += amountTerm;
      mapTerm.set(formatDate, {
        term: index + 1,
        amountTerm: amountTerm,
        date: formatDate,
        totalPaid: paid,
      });
    }
    setCreditAmount.add(amountTerm); //add amount term to set

    return mapTerm;
  });

  /////////////////////////////////////////////////////////////////////////////////////////////

  const list = Array.from(setCreditAmount);
  // console.log(list);
  //Convert array object to map
  // let a = Array.from(terms);
  // const mapTerm = new Map(
  //   a.map((obj) => {
  //     return [obj.date, { ...obj }];
  //   })
  // );

  /////////////////////////////////////////////////////////////////////////////////////////////
  // console.log(mapTerm);
  return { mapTerm, list };
};
module.exports = calculateTerm;
