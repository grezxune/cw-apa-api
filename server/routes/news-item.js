const _ = require('lodash');
const {requireValidID} = require('../middleware/require-valid-id');
const {authenticate} = require('../middleware/authenticate');
const {app} = require('../app');
const {NewsItem} = require('../models/news-item');

app.get('/news-items', (req, res) => {
    NewsItem.find().then((newsItems) => {
        res.send({ newsItems });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/news-item', authenticate, (req, res) => {
    var newsItem = new NewsItem({
        date: req.body.newsItem.date,
        title: req.body.newsItem.title,
        excerpt: req.body.newsItem.excerpt,
        content: req.body.newsItem.content,
        images: req.body.newsItem.images
    });

    newsItem.images = newsItem.images.map((image) => {
        return {
            imageBase64: image.imageBase64,
            lastModified: image.lastModified,
            name: image.name,
            size: image.size,
            type: image.type
        };
    });

    newsItem.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send({errors: [err]});
    });
});

app.get('/news-item/:id', requireValidID, (req, res) => {
    NewsItem.findById(req.params.id)
        .then((newsItem) => {
            if (!newsItem) {
                res.status(404).send();
            } else {
                res.send({ newsItem });
            }
        })
        .catch((e) => res.status(400).send());
});

app.patch('/news-item/:id', authenticate, requireValidID, (req, res) => {
    var body = _.pick(req.body.newsItem, ['date', 'title', 'excerpt', 'content', 'images']);

    NewsItem.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((newsItem) => {
        if (!newsItem) {
            res.status(404).send();
        } else {
            // newsItem is the new MODIFIED item. This is because the option new: true is set
            res.send({ newsItem });
        }
    }).catch((err) => { res.status(400).send(err) });
});

app.delete('/news-item/:id', authenticate, requireValidID, (req, res) => {
    NewsItem.findByIdAndRemove(req.params.id).then((newsItem) => {
        if (!newsItem) {
            res.status(404).send();
        } else {
            res.send({ newsItem });
        }
    }).catch((e) => res.status(400).send());
});