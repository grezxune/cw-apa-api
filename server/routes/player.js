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

app.post('/player', async (req, res) => {
    var player = new Player({
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
        personal: req.body.personal,
        previousPlay: req.body.previousPlay,
        friendInterested: req.body.friendInterested
    });

    try {
        const newDoc = await player.save();
        res.send(newDoc);
    } catch (err) {
        res.status(400).send({errors: err.message.split(',')});
    }
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

app.patch('/player/:id', authenticate, requireValidID, async (req, res) => {
    var body = _.pick(req.body, ['name', 'contact', 'address', 'personal', 'previousPlay', 'friendInterested']);

    try {
        // updatedDoc is the new MODIFIED item. This is because the option new: true is set
        const updatedDoc = await Player.findByIdAndUpdate(req.params.id, {$set: body}, {new: true});

        if (!updatedDoc) {
            res.status(404).send();
        } else {
            res.send({ player: updatedDoc });
        }
    } catch (err) {
        let errors = { errors: [] };

        if (err.code && err.code === 11000) {
            errors.errors.push(`A player with the email ${body.contact.email} already exists`);
        }

        res.status(400).send(errors);
    }
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