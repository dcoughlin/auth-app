/*  EXPRESS SETUP  */

const express = require('express');
const app = express();
app.get('/', (req, res) => res.sendFile('auth.html', { root : __dirname}));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("You have successfully logged in"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  FACEBOOK AUTH  */

const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = '155416741722051';
const FACEBOOK_APP_SECRET = 'e2c99b99b705427c3750ba0c8058e0a7';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res) {
    console.log('We hit the redirect...');
    res.redirect('/success');
  });

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));
  