const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//routes utama method GET (endpointt)
app.get('/', (req, res) => {
  //row function
  console.log({ urlParam: req.query.name });
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  //row function
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (username == null) {
      res.status(400).send('Username tidak digunakan');
    } else if (username == 'asyrof' && password == '12345s') {
      res.status(200).send('ok');
    } else {
      res.status(200).send('okes');
    }
  } catch {
    res.status(500).send('Error');
  }
});

app.put('/username', (req, res) => {
  console.log({ updateData: req.body });
  res.send('Berhasil Update');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
