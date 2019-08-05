const mongoose = require('mongoose');

// mongoose.set('debug', true);
mongoose.Promise = Promise;
// mongoose.set('debug', true);

//  local
//  const url = 'mongodb://127.0.0.1:27017/myTest';

async function connect() {
  try {
    const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?${process.env.MONGODB_OTHER}`;
    const options = {
      config: {
        autoIndex: true
      },
      useNewUrlParser: true
    };
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.connection.on('error', error => {
      throw error;
      console.log('error thrown', error);
    });
    await mongoose.connect(url, options);
  } catch (error) {
    throw error;
  }
}
module.exports.connect = connect;

module.exports.mongoose = mongoose;
