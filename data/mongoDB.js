const mongoose = require('mongoose');
const config = require('../config.js');

// mongoose.set('debug', true);
mongoose.Promise = Promise;
// mongoose.set('debug', true);

//  local
//  const url = 'mongodb://127.0.0.1:27017/myTest';

async function connect() {
  try {
    const {
      db: { host, name, account, password, other }
    } = config;
    const url = `mongodb+srv://${account}:${password}@${host}/${name}?${other}`;
    const options = {
      config: {
        autoIndex: true
      },
      useNewUrlParser: true
    };
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.connection.on('error', error => {
      console.log('error thrown');
    });
    await mongoose.connect(url, options);
  } catch (error) {
    throw error;
  }
}

connect();

module.exports.mongoose = mongoose;
