var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;
var User = require('../controllers/UserController');
var github = require('../../env/github_oauth');
var request = require('request');

module.exports = function(app, express, passport) {
  app.use(session({
    name: 'sentimize',
    secret: 'chkakaja',
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  var callbackURL = process.env.PROTOCOL + process.env.HOST + ':' + process.env.PORT + github.GITHUB_CALLBACK_URL;

  passport.use(new GitHubStrategy({
    clientID: github.GITHUB_CLIENT_ID,
    clientSecret: github.GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    var options = {
      url: profile._json.organizations_url,
      headers: {
        'User-Agent': profile.username
      }
    };
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);

        info.forEach(function(org) {
          var orgName = org.login;
          if (orgName === 'hackreactor') {
            User.findOrCreateUser(profile, orgName, function(user) {
              return done(null, user);
            });
          }
        });
      }
    }

    request(options, callback);

  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getCurrentUser(id, function(user) {
      done(null, user);
    });
  });

};
