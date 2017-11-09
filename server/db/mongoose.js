var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://localhost:27017/cw-apa', (err) => {
//     if (err) {
//         console.log('Failed to connect to MongoDB server -', err);
//     } else {
//         console.log('uri', process.env.MONGODB_URI);
//         console.log(mongoose.connection.readyState);
//         console.log('Connected to MongoDB');
//     }
// });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cw-apa').catch((err) => { console.log(err) });

module.exports = {
  mongoose
};