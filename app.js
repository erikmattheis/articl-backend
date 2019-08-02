const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const paginate = require('express-paginate');
const mongoDB = require('./data/mongoDB');
const routes = require('./routes');

const app = express();

const generalLimiter = rateLimit({
  max: 100, // 15 minutes
  windowMs: 15 * 60 * 1000
});
app.use(generalLimiter);

app.use(helmet());

const corsOptions = {
  credentials: true,
  enablePreflight: true,
  origin: ['http://localhost:8080', 'https://api.articl.net']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(paginate.middleware(10, 50));

app.use('/api/v1', routes);

(async () => {
  try {
    await mongoDB.connect();
    app.listen(3000);
    console.log('listening to port 3000');
  } catch (error) {
    console.log('error occurred:', error);
  }
})();

module.exports = app;
