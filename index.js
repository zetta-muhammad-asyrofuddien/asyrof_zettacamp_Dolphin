const express = require('express');
const conn = require('./connection/app');
const route = require('./routes/route');
const app = express();
const port = 3000;

conn;
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
