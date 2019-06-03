module.exports = `
const mongoose = require('mongoose');
const { db } = require('../configs/config');
const { mongoURL, mongoOptions } = db;
mongoose.set('useCreateIndex', true);
// Use native promises
mongoose.Promise = Promise;

// Initialize our database
mongoose.connect(mongoURL, mongoOptions)
  .catch((e) => {
    console.error('mongoose error ', e.message);
  });

const database = mongoose.connection;
database.on('error', () => (
  setTimeout(() => {
    console.error('MONGO CONNECTION FAILED => trying again ', mongoURL);
    try {
      mongoose.connect(mongoURL, mongoOptions)
        .catch((e) => {
          console.error('mongoose error ', e.message);
        });
    } catch (e) {
      console.error('MONGO CONNECTION e  ', e.message);
    }
  }, 5000)
));
database.once('open', () => {
  console.info('Mongo      OKAY');
  mongoose.connection.on('connected', () => {
    console.info('MongoDB event connected');
  });

  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB event disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB event reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB event error: ' + err);
  });
});

module.exports = database;
`
