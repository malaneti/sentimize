var session = require('express-session');
//var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var User = require('../models/UserModel');
var UserController = require('../controllers/UserController');
var github = require('../../env/github_oauth');
var request = require('request');

module.exports = function(app, express, passport) {
  app.use(session({
    name: 'sentimize',
    secret: 'chkakaja',
  }))

  app.use(passport.initialize());
  app.use(passport.session());
  // passport.use(new LocalStrategy(
  //   {
  //     usernameField: 'email',
  //     passwordField: 'password'
  //   },
  //   function(email, password, done) {
  //     User.where('email', email).fetch().then(function(user){
  //       if(!user) {
  //         return done(null, false, {message: 'Incorrect email.'});
  //       } else {
  //         user.comparePassword(password, function(passwordCorrect) {
  //           if (!passwordCorrect) {
  //             return done(null, false, {message: 'Incorrect password.'});
  //           } else {
  //             console.log('successfully logged in', email);
  //             return done(null, user);
  //           }
  //         });
  //       }
  //     })
  //     .catch(function(err) {
  //       console.error(err);
  //     });
  //   })
  // );
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
            UserController.createUser(profile, orgName);
            User.where('username', profile.username).fetch()
              .then(function(user) {
                console.log('User: ', user);
                if (!user) {
                  var name = profile.displayName.split(' ');
                  var userObj = {
                    email: profile.emails[0],
                    username: profile.username,
                    firstName: name[0],
                    lastName: name[1]
                  };
                  new User(userObj).save()
                    .then(function(newUser) {
                      user = newUser;
                      console.log('New User: ', user);
                    });
                }
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
    // User.where('id', id).fetch().then(function(user) {
    //   done(null, user);
    // })
    // .catch(function(err) {
    //   console.error(err);
    // })
    done(null, id);
  });
}
