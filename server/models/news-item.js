const mongoose = require('mongoose');
const moment = require('moment');

const newsItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    date: {
        type: Number,
        default: new moment().valueOf()
    },
    excerpt: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    imageURLs: [String]
});

const NewsItem = mongoose.model('NewsItem', newsItemSchema);

// var newTodo = new Todo({
//     text: ' CREATE COOL STUFF!!      ',
//     completed: true,
//     completedAt: 5959595959
// });
//
// newTodo.save().then((doc) => {
//     console.log('Saved todo!', doc);
// }, (err) => {
//     console.log('Unable to save todo', err);
// });

module.exports = {
  NewsItem
};
