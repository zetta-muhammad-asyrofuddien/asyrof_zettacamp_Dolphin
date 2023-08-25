let book1 = 'Koala Kumal';
const book2 = 'Laskar Pelangi';
book1 = 'Marmut Merah Jambu';

/*

Compare variable

*/
console.log('----------------------------------------------------------------');
let price1 = 99000;
let price2 = 150000;

console.log('Price of ' + book1 + ': ' + price1);
console.log('Price of ' + book2 + ' : ' + price2);
console.log('----------------------------------------------------------------');
console.log(price1 > price2 ? 'Price of ' + book1 + ' is higher than ' + book2 : 'Price of ' + book2 + ' is higher than ' + book1);

/*

Avarage price

*/
console.log('----------------------------------------------------------------');

let totalPrice = price1 + price2;
let averagePrice = totalPrice / 2;

console.log('Average price of ' + book1 + book2 + ' : ' + averagePrice);

console.log('----------------------------------------------------------------');

/*

Create new variable to use tenary operator

*/

let result;
// averagePrice = 500000;
result = averagePrice > 500000 ? 'Expensive' : 'Cheap';
result = averagePrice > 500000 ? 'Expensive' : averagePrice <= 500000 ? 'Cheap' : 'Expensive';

console.log(result);

console.log('----------------------------------------------------------------');
