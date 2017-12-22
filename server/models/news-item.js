const mongoose = require('mongoose');
const moment = require('moment');

const newsItemSchema = new mongoose.Schema({
    date: {
        type: Number,
        default: moment().valueOf()
    },
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
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
    images: [{
        imageBase64: {
            type: String,
            required: true,
            trim: true
        },
        lastModified: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        },
        size: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            minLength: 1
        }
    }]
});

const NewsItem = mongoose.model('NewsItem', newsItemSchema);

module.exports = {
  NewsItem
};
