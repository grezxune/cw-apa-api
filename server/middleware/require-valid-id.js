const {ObjectID} = require('mongodb');

const requireValidID = (req, res, next) => {
    const isValidID = ObjectID.isValid(req.params.id);

    if (isValidID) {
        next();
    } else {
        res.status(400).send('Valid id required in query parameters');
    }
};

module.exports = {
    requireValidID
};