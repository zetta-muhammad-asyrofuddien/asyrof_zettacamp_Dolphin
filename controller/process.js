var events = require('events');
var eventEmitter = new events.EventEmitter();

const angka = ['One', 'Two', 'Three', 'Four', 'Five'];
const fs = require('fs').promises;
async function process() {
  return new Promise((resolve) => {
    //promise function
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log(`Iteration ${angka[i]}`);
        if (i === 4) {
          resolve('Process completed.');
        }
      }, i * 2000); // Pause for 2 seconds between each iteration
    }
  });
}

//filesystem and event
var myEventHandler = function () {
  fs.writeFile(
    './controller/firstEndpointFS.txt',
    JSON.stringify({
      message: 'using await',
      result: 'Will wait for the process() function to finish then continue the next code',
    })
  );
};
var myEventHandler2 = function () {
  fs.writeFile(
    './controller/secondEndpointFS.txt',
    JSON.stringify({
      message: 'without await',
      result: 'Will continue the syntax and process() function running in the background',
    })
  );
};
eventEmitter.on('scream', myEventHandler);
eventEmitter.on('scream2', myEventHandler2);

const firstEndpoint = async (req, res) => {
  try {
    //write file
    eventEmitter.emit('scream');
    // read file
    // fs.readFile('./controller/firstEndpointFS.txt', 'utf-8', (err, data) => {
    //   if (err) {
    //     console.error('Error reading file:', err);
    //     throw err;
    //   }
    //   console.log('File contents:', data.toString());
    // });

    // console.log(content);
    const result = await process(); //call with await

    console.log('Endpoint 1: Asynchronous function completed');
    res.status(200).json({ message: 'Endpoint 1 response', result });
  } catch (error) {
    console.error('Endpoint 1: Error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const secondEndpoint = async (req, res) => {
  try {
    //Write File
    eventEmitter.emit('scream2');

    const result = process(); //call without await

    console.log('Endpoint 2: Asynchronous function completed');
    res.status(200).json({ message: 'Endpoint 2 response', result });
  } catch (error) {
    console.error('Endpoint 2: Error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { firstEndpoint, secondEndpoint };
