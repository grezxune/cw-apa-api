var { User } = require('./../models/user');

const notAuthenticated = (req, res, next) => {
    const token = req.cookies['auth'];

    if (token) {
        console.log('You\'re already authenticated!');
        res.status(400).send('You\'re already authenticated');
    } else {
        console.log('nexting...');
        next();
    }
};

module.exports = {
    notAuthenticated
};