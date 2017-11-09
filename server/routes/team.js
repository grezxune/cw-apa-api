const _ = require('lodash');
const {requireValidID} = require('../middleware/require-valid-id');
const {authenticate} = require('../middleware/authenticate');
const {app} = require('../app');
const {Team} = require('../models/team');

app.get('/teams', authenticate, (req, res) => {
    Team.find().then((teams) => {
        res.send({ teams });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.post('/team', (req, res) => {
    var team = new Team({
        divisionName: req.body.divisionName,
        teamName: req.body.teamName,
        homeLocation: req.body.homeLocation,
        dayOfPlay: req.body.dayOfPlay,
        existingTeam: req.body.existingTeam,
        useCurrentRoster: req.body.useCurrentRoster,
        players: req.body.players
    });

    team.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/team/:id', authenticate, requireValidID, (req, res) => {
    Team.findById(req.params.id)
        .then((team) => {
            if (!team) {
                res.status(404).send();
            } else {
                res.send({ team });
            }
        })
        .catch((e) => res.status(400).send());
});

app.patch('/team/:id', authenticate, requireValidID, (req, res) => {
    var body = _.pick(req.body, ['divisionName', 'teamName', 'homeLocation', 'dayOfPlay', 'existingTeam', 'useCurrentRoster', 'players']);

    Team.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((team) => {
        if (!team) {
            res.status(404).send();
        } else {
            // team is the new MODIFIED item. This is because the option new: true is set
            res.send({ team });
        }
    }).catch((err) => { res.status(400).send(err) });
});

app.delete('/team/:id', authenticate, requireValidID, (req, res) => {
    Team.findByIdAndRemove(req.params.id).then((team) => {
        if (!team) {
            res.status(404).send();
        } else {
            res.send({ team });
        }
    }).catch((e) => res.status(400).send());
});