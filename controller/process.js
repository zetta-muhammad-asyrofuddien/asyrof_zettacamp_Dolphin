const angka = ['Satu', 'Dua', 'Tiga', 'Empat', 'Lima'];
const fs = require('fs').promises;
async function process() {
  return new Promise((resolve) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log(`Iteration ${i + 1}: ${angka[i]}`);
        if (i === 4) {
          resolve('Process completed.');
        }
      }, i * 2000); // Pause for 2 seconds between each iteration
    }
  });
}
const firstEndpoint = async (req, res) => {
  try {
    //write file
    fs.writeFile(
      'firstEndpointFS.txt',
      JSON.stringify({
        message: 'tidak pakai await',
        result: 'Akan menunggu fungsi process() selesai baru melanjutkan code berikutnya',
      })
    );

    const result = await process(); //call with await
    console.log('Endpoint 1: Asynchronous function completed');
    res.status(200).json({ message: 'Endpoint 1 response', result });
    fs.readFile('firstEndpointFS.txt');
  } catch (error) {
    console.error('Endpoint 1: Error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const secondEndpoint = async (req, res) => {
  try {
    //Write File
    fs.writeFile(
      'secondEndpointFS.txt',
      JSON.stringify({
        message: 'tidak pakai await',
        result: 'Akan melanjutkan sintaks dan fungsi process() berjalan di background',
      })
    );
    const result = process(); //call without await
    console.log('Endpoint 2: Asynchronous function Start');
    res.status(200).json({ message: 'Endpoint 2 response', result });
  } catch (error) {
    console.error('Endpoint 2: Error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { firstEndpoint, secondEndpoint };
