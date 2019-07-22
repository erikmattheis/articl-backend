const mongoose = require('mongoose');
const config = require('../config.js');

mongoose.set('debug', true);
mongoose.Promise = Promise;
// mongoose.set('debug', true);

//  loca
//  const url = 'mongodb://127.0.0.1:27017/myTest';

const {
  db: { host, name, account, password, other }
} = config;
const url = `mongodb+srv://${account}:${password}@${host}/${name}?${other}`;

mongoose.connect(url, {
  config: {
    autoIndex: true
  },
  useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
