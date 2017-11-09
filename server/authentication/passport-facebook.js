const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID: '',
    clientSecret: '',
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
