// // let book1 = 'Koala Kumal';
// // const book2 = 'Laskar Pelangi';

// // book1 = 'Marmut Merah Jambu';
// // book2 = 'Marmut Merah Jambu';

// let cc = book1 + ' And ' + book2;

// console.log(cc);

let kondisi1 = true;
let kondisi2 = false;

let hasil1 = kondisi1 && kondisi2;
let hasil2 = kondisi1 || kondisi2;

console.log('Kondisi AND : ' + hasil1);
console.log('Kondisi OR  : ' + hasil2);

let angka = 100;
let string = '200';

angka = 'Saya';
string = 'Muhammad Asyrofuddien';
let age = 23;

// let hasil3 = angka + +string;
let hasil3 = angka + string + ' ' + age;

console.log(hasil3);

// var angka2 = 12;
// function mm() {
//   console.log(angka2);
// }
// mm();

let year = 2022;
var result;
if (year % 4 === 0) {
  if (year % 100 === 0) {
    if (year % 400 === 0) {
      result = 'Leap year.';
    } else {
      result = 'Not leap year.';
    }
  } else result = 'Leap year.';
} else {
  result = 'Not leap year.';
}
console.log(result);

let names = ['Asyrof', 'Guntur', 'Reza', 'Johan', 'Aldi'];

var result2 = names[Math.floor(Math.random() * names.length)] + ' is going to buy lunch today!';
console.log(result2);

const nick = {
  nama: 'Asyrofuddien',
  umur: 12,
};

console.log('Nama : ' + nick.nama);
console.log('Umur : ' + nick.umur);
