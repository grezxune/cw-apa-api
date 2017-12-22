require('./config/config');


/// *** External Packages *** ///
const { ObjectID } = require('mongodb');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');


/// *** Custom Variables *** ///
const port = process.env.PORT;
const { mongoose } = require('./db/mongoose');
var { app } = require('./app');
const { allowCrossOrigin } = require('./middleware/cross-origin');


/// *** Middlewares *** ///
app.use(allowCrossOrigin);

app.use(cookieParser());

app.use((req, res, next) => {
    const now = new moment().format('MMM Do YYYY hh:mm');
    const authCookie = req.cookies['auth'];
    const log = `${now}: ${req.method} - ${req.url}\n******** Auth Cookie ********\n${authCookie}`;

    // console.log(log);
    fs.appendFile('server.log', `${log}\n`, (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// Parse form data into body
app.use(bodyParser.urlencoded({
    extended: true
}));

// Parse body and put it into req.body
app.use(bodyParser.json({limit: '200mb'}));

// app.use((req, res, next) => {
//     console.log(res.getHeaders());
//     next();
// });

// Home route
app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;">Hello, welcome to Central Wisconsin APA Admin!</h1>');
});


/// *** CUSTOM ROUTES *** ///
require('./routes/news-item');
require('./routes/event-item');
require('./routes/user');
require('./routes/player');
require('./routes/team');


// Start Express server
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};