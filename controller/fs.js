const fileSystem = async (fs) => {
  async (req, res) => {
    fs.writeFile('input.txt', 'Geeks For Geeks', function (err) {
      if (err) {
        return console.error(err);
      }

      console.log('Data written successfully!');
      console.log("Let's read newly written data");

      fs.readFile('input.txt', function (err, data) {
        if (err) {
          return console.error(err);
        }
        console.log('Asynchronous read: ' + data.toString());
      });
    });
    res.status(200).send({ msg: 'Success' });
  };
};
module.exports = fileSystem;
