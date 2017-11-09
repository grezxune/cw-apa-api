var { User } = require('./../models/user');

const notAuthenticated = (req, res, next) => {
    const token = req.cookies['auth'];

    if (token) {
        res.status(400).send();
    } else {
        next();
    }
};

module.exports = {
    notAuthenticated
};