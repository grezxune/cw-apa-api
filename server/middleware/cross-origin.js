const allowCrossOrigin = (req, res, next) => {
    res.set('access-control-allow-origin', process.env.ALLOWED_ORIGIN);
    res.set('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'cookie, Content-Type');
    res.set('Access-Control-Max-Age', 86400);
    next();
};

module.exports = {
    allowCrossOrigin
};