require('./config/config');

/// *** External Packages *** ///
const { ObjectID } = require('mongodb');
const fs = require('fs');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const ics = require('ics');
const ical = require('ical-generator');
const cal = ical({
    domain: 'cw-apa-api'
})
    .url('http://cw-apa-api.herokuapp.com/calendar.ics')
    .ttl(60);

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
    const log = `${now}: ${req.method} - ${
        req.url
    }\n******** Auth Cookie ********\n${authCookie}`;

    // console.log(log);
    fs.appendFile('server.log', `${log}\n`, err => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// Parse form data into body
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// Parse body and put it into req.body
app.use(bodyParser.json({ limit: '200mb' }));

// app.use((req, res, next) => {
//     console.log(res.getHeaders());
//     next();
// });

// Home route
app.get('/', (req, res) => {
    res.send(
        '<h1 style="text-align: center;">Hello, welcome to Central Wisconsin APA Admin! <a href="/calendar.ics">CALENDAR!</a></h1>'
    );
});

app.get('/calendarEvent.ics', (req, res) => {
    const filename = `${__dirname}/calendarFiles/event.ics`;
    res.sendFile(filename);
});

app.get('/calendar.ics', (req, res) => {
    console.log('HIT CALENDAR ENDPOINT!');
    const event = cal.createEvent({
        summary: 'My Event - SUCCESS WHOOP!',
        start: moment(),
        uid: 12345,
        sequence: 1
    });
    const filename = `${__dirname}/calendarFiles/event.ics`;
    cal.save(filename, (err, val) => res.sendFile(filename));
    // const event = await ics.createEvent(
    //     {
    //         title: 'Dinner - EDITED!!!',
    //         description: 'Nightly thing I do',
    //         start: [2018, 1, 15, 6, 30],
    //         duration: { minutes: 50 },
    //         'X-PUBLISHED-TTL': 'PT1M'
    //     },
    //     (error, event) => {
    //         console.log('Done creating event with ics');
    //         console.log(event);
    //         if (error) {
    //             console.log(error);
    //         }

    //         if (event) {
    //             console.log('EVENT!: \n', event);
    //             const filename = `${__dirname}/calendarFiles/event.ics`;
    //             fs.writeFileSync(filename, event);
    //             res.sendFile(filename);
    //         } else {
    //             res.send('<h1>ERROR WITH CALENDAR</h1>');
    //         }
    //     }
    // );
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
