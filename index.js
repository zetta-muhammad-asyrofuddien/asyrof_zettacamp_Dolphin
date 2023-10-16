const route = require('./routes/route'); //import modul route
const express = require('express'); //import modul express
const app = express();
const port = 3005; //defind port
const conn = require('./conn');
const connGraph = require('./connGraphQL');
const { job } = require('./controller/cronJobSong');
// const jwtAuthMiddleware = require('./middleware/jwtVeriv');

app.use(express.json());
// app.use(jwtAuthMiddleware);
route(app);
connGraph.conn(app);
conn();
job.start(); //Cron job must run with GraphQL server simultaneously
try {
  app.listen(port, () => {
    console.log(`Server running in ${port}`);
  });
} catch (error) {
  return 'ERORR msg : ' + error;
}
