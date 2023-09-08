const route = require('./routes/route'); //import modul route
const express = require('express'); //import modul express
const app = express();
const port = 3005; //defind port
const bodyParser = require('body-parser'); //import bodyparser custom
const basicAuthMiddleware = require('./middleware/auth'); //import middlewere custom

//make a JSON to Object
app.use(bodyParser.json());

// function login(req, res, next) {}

//middlewere function
app.use(basicAuthMiddleware('asyrof', 'uddien'));

route(app);
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running in ${port}`);
});
