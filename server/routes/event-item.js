const _ = require('lodash');
const {requireValidID} = require('../middleware/require-valid-id');
const {app} = require('../app');
const {EventItem} = require('../models/event-item');
const {authenticate} = require('../middleware/authenticate');

app.get('/event-items', (req, res) => {
    EventItem.find().then((eventItems) => {
        res.send({ eventItems });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/event-item', authenticate, (req, res) => {
    var eventItem = new EventItem({
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        facebookURL: req.body.facebookURL,
        tournament: req.body.tournament,
        imageURLs: req.body.imageURLs
    });

    eventItem.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/event-item/:id', requireValidID, (req, res) => {
    EventItem.findById(req.params.id)
        .then((eventItem) => {
            if (!eventItem) {
                res.status(404).send();
            } else {
                res.send({ eventItem });
            }
        })
        .catch((e) => res.status(400).send());
});

app.patch('/event-item/:id', authenticate, requireValidID, (req, res) => {
    var body = _.pick(req.body, ['title', 'date', 'location', 'facebookURL', 'tournament', 'imageURLs']);

    EventItem.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((eventItem) => {
        if (!eventItem) {
            res.status(404).send();
        } else {
            // eventItem is the new MODIFIED item. This is because the option new: true is set
            res.send({ eventItem });
        }
    }).catch((err) => { res.status(400).send(err) });
});

app.delete('/event-item/:id', authenticate, requireValidID, (req, res) => {
    EventItem.findByIdAndRemove(req.params.id).then((eventItem) => {
        if (!eventItem) {
            res.status(404).send();
        } else {
            res.send({ eventItem });
        }
    }).catch((e) => res.status(400).send());
});