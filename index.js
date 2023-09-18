const route = require('./routes/route'); //import modul route
const express = require('express'); //import modul express
const app = express();
const port = 3005; //defind port
const bodyParser = require('body-parser'); //import bodyparser custom
const con = require('./app');
const Generate = require('./middleware/jwtAuth');
const jwtAuthMiddleware = require('./middleware/jwtVeriv');

//make a JSON to Object
app.use(bodyParser.json());

// function login(req, res, next) {}

//middlewere function
app.post('/', Generate); //not effect of middleware
// app.use(jwtAuthMiddleware);
con.conn();
route(app);

try {
  app.listen(port, () => {
    console.log(`Server running in ${port}`);
  });
} catch (error) {
  return 'ERORR msg : ' + error;
}
