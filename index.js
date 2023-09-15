const route = require('./routes/route'); //import modul route
const express = require('express'); //import modul express
const app = express();
const port = 3005; //defind port
const bodyParser = require('body-parser'); //import bodyparser custom

const fs = require('fs');
const jwtAuthMiddleware = require('./middleware/jwtVeriv');
const Generate = require('./middleware/jwtAuth');

//make a JSON to Object
app.use(bodyParser.json());
app.post('/', Generate); //not effect of middleware
app.use(jwtAuthMiddleware);
// function login(req, res, next) {}

//middlewere function

route(app, fs);

try {
  app.listen(port, () => {
    console.log(`Server running in ${port}`);
  });
} catch (error) {
  return 'ERORR msg : ' + error;
}
