const route = require('./routes/route'); //import modul route
const express = require('express'); //import modul express
const app = express();
const port = 3005; //defind port
const bodyParser = require('body-parser'); //import bodyparser custom
const conn = require('./conn');
const connGraph = require('./connGraphQL');

// app.use(bodyParser.json());

route(app);
connGraph.conn(app);
conn();
try {
  app.listen(port, () => {
    console.log(`Server running in ${port}`);
  });
} catch (error) {
  return 'ERORR msg : ' + error;
}
