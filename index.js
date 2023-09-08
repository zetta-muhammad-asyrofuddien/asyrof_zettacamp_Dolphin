const route = require('./routes/route');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const basicAuthMiddleware = require('./routes/auth');
// const purches = require('./book.js');

app.use(bodyParser.json());

// function login(req, res, next) {}

//endpoint
app.use(basicAuthMiddleware('asyrof', 'uddien'));

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
