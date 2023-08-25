const buku = [
  {
    judul: 'Kuala Kumal',
  },
];

//assign key into object

buku[0]['harga'] = 750000;

//push an object into existing array

buku.push({
  judul: 'Laskar Pelangi',
  harga: 500000,
});

console.log('----------------------------------------------------------------');

buku[0]['tipe'] = 'buku';
buku[1]['tipe'] = 'buku';
let logic = buku[0].tipe === buku[0].tipe && buku[0].harga < buku[1].harga;
let logic2 = buku[0].tipe === buku[0].tipe && buku[0].harga > buku[1].harga;

if (logic) {
  console.log(logic);
} else {
  console.log(logic);
}
if (logic2) {
  console.log(logic2);
} else {
  console.log(logic2);
}

// 2A
console.log('----------------------------------------------------------------');

if (buku[0].harga > buku[1].harga) {
  console.log(buku[0].judul + ' have highest price then ' + buku[1].judul);
} else {
  console.log(buku[1].judul + ' have highest price then ' + buku[0].judul);
}

// 2B
console.log('----------------------------------------------------------------');

let totalPrice = 0;

for (let i = 0; i < buku.length; i++) {
  totalPrice += buku[i].harga;
}

let averagePrice = totalPrice / buku.length;

console.log('Avarage Prive : ' + averagePrice);

console.log('----------------------------------------------------------------');
// 2C
let result;

result = averagePrice > 500000 ? 'Expensive' : 'Cheap';

console.log(result);

console.log('----------------------------------------------------------------');

// Tambahan

// Cari bilanagan genap ganjil dari 1-50
console.log('BILANGAN GANJIL GENAP');
let ganjil = [];
let genap = [];
for (let i = 1; i <= 36; i++) {
  if (i % 2 === 0) {
    genap.push(i);
  } else {
    ganjil.push(i);
  }
}

console.log('Angka Genap  : ' + genap);
console.log('Angka Ganjil : ' + ganjil);

console.log('----------------------------------------------------------------');

//insert new key to object
const biodata = {
  namaDepan: 'Muhammad',
};

Object.assign(biodata, { namaBelakang: 'Asyrofuddien' });

console.log(biodata);

console.log('----------------------------------------------------------------');

//edit object
biodata.namaDepan = 'Uddien';
//hapus key
delete biodata.namaBelakang;

console.log(biodata);

//hapus array
let buah = ['apel', 'strawbery', 'jeruk', 'semangka'];
buah.splice(0, 1); //index 1 (Mulai dari) , index 2 (sampai berapa)
console.log(buah);
buah.splice(0, 2, 'anggur'); //index 1 (Mulai dari) , index 2 (sampai berapa) , index tiga isi array yang akan dipakai
console.log(buah);
buah.pop();
console.log(buah);
buah.unshift('kiwil');
console.log(buah);

console.log('----------------------------------------------------------------');

let i = 0;
console.log(i++);
console.log(i);

// const c = {
//   nama: {
//     namaDepan: 'Muhammad',
//     namaBelakang: 'Asyrofuddien',
//   },
//   umur: 23,
//   menikah: false,
// };

// console.log(c.nama.umur2);
// console.log(c);

console.log(2 ** 4);
