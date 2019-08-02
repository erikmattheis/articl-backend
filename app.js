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

app.use('/', express.static('html/public'));

(async () => {
  try {
    await mongoDB.connect();
    const port = process.env.NODE_ENV !== 'development' ? 443 : 8080;
    app.listen(port);
  } catch (error) {
    console.log('error occurred:', error);
  }
})();

module.exports = app;
