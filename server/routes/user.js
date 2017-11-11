const _ = require('lodash');

const {app} = require('../app');
const {authenticate} = require('../middleware/authenticate');
const {notAuthenticated} = require('../middleware/not-authenticated');
const {User} = require('../models/user');

// REMOVE AUTHENTICATE TO ADD INITIAL USER(S)
app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const newUser = new User(body);

    const savedUser = await newUser.save();

    if (!savedUser) {
        res.status(400).send(`Failed to save new user ${email}`);
    } else {
        try {
            const token = await savedUser.generateAuthToken();
            res.cookie('auth', token, { httpOnly: true }).send({ savedUser });
        } catch (err) {
            console.log('Error creating token and setting header', err);
        }
    }
});

app.get('/users', authenticate, (req, res) => {
    User.find().then((users) => {
        res.send({ users });
    }).catch((err) => res.status(400).send());
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.get('/login', notAuthenticated, (req, res) => {
    res.send('<form action="/login" method="POST"><input type="text" name="email"/><input type="text" name="password"/><input type="submit" value="submit"/></form>');
});

app.get('/logout', authenticate, (req, res) => {
    res.send('<form action="/logout" method="POST"><input type="submit" value="submit"/></form>');
});

app.post('/login', notAuthenticated, async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    const loggedInUser = await User.loginUser(body.email, body.password);

    if (loggedInUser) {
        res.cookie('auth', loggedInUser.token).send({ user: loggedInUser.user });
    } else {
        res.status(403).send('Invalid email or password');
    }
});

app.post('/logout', authenticate, async (req, res) => {
    req.user.removeToken(req.token);
    res.clearCookie('auth').send('Logged out!');
});