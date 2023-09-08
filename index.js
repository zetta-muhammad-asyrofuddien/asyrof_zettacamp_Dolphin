const route = require('./routes/route'); //import modul route
const express = require('express'); //import modul express
const app = express();
const port = 3000; //defind port
const bodyParser = require('body-parser'); //import bodyparser custom
const basicAuthMiddleware = require('./routes/auth'); //import middlewere custom

//make a JSON to Object
app.use(bodyParser.json());

// function login(req, res, next) {}

//middlewere function
app.use(basicAuthMiddleware('asyrofu', 'uddien'));

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
