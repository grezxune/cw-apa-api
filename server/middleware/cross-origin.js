const allowCrossOrigin = (req, res, next) => {
    const origin = req.headers.origin;

    console.log('origin: ', origin);
    if (origin.includes('cwapa.org')) {
        res.set('access-control-allow-origin', origin);
    } else {
        res.set('access-control-allow-origin', process.env.ALLOWED_ORIGIN);
    }

    res.set('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, *');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Max-Age', 86400);
    next();
};

module.exports = {
    allowCrossOrigin
};