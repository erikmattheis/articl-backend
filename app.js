const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const paginate = require('express-paginate');
const routes = require('./routes');

const app = express();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(generalLimiter);

app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
  enablePreflight: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(paginate.middleware(10, 50));

app.use('/api/v1', routes);

app.listen(3000);
console.log('listening to port 3000');

module.exports = app;
