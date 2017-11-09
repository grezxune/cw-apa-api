const _ = require('lodash');
const {requireValidID} = require('../middleware/require-valid-id');
const {authenticate} = require('../middleware/authenticate');
const {app} = require('../app');
const {Player} = require('../models/player');

app.get('/players', authenticate, (req, res) => {
    Player.find().then((players) => {
        res.send({ players });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/player', (req, res) => {
    console.log(req.body);
    var player = new Player({
        name: req.body.name,
        address: req.body.address,
        birthdate: req.body.birthdate,
        phones: req.body.phones,
        email: req.body.email,
        employment: req.body.employment,
        gender: req.body.gender,
        legalStatus: req.body.legalStatus,
        previousPlay: req.body.previousPlay,
        friendInterested: req.body.friendInterested
    });

    player.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/player/:id', authenticate, requireValidID, (req, res) => {
    Player.findById(req.params.id)
        .then((player) => {
            if (!player) {
                res.status(404).send();
            } else {
                res.send({ player });
            }
        })
        .catch((e) => res.status(400).send());
});

app.patch('/player/:id', authenticate, requireValidID, (req, res) => {
    var body = _.pick(req.body, ['name', 'address', 'birthdate', 'phones', 'email', 'employment', 'gender', 'legalStatus', 'previousPlay', 'friendInterested']);

    Player.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((player) => {
        if (!player) {
            res.status(404).send();
        } else {
            // player is the new MODIFIED item. This is because the option new: true is set
            res.send({ player });
        }
    }).catch((err) => { res.status(400).send(err) });
});

app.delete('/player/:id', authenticate, requireValidID, (req, res) => {
    Player.findByIdAndRemove(req.params.id).then((player) => {
        if (!player) {
            res.status(404).send();
        } else {
            res.send({ player });
        }
    }).catch((e) => res.status(400).send());
});