const mongoose = require('mongoose');
const moment = require('moment');

const eventItemSchema = new mongoose.Schema({
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
    location: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    facebookURL: {
        type: String,
        required: false,
        trim: true
    },
    tournament: {
        required: false,
        qualifier: {
            type: String,
            required: false,
            trim: true
        },
        format: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        },
        bracket: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        },
        payout: {
            type: String,
            required: false,
            trim: true
        }
    },
    imageURLs: [String]
});

const EventItem = mongoose.model('EventItem', eventItemSchema);

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
  EventItem
};
