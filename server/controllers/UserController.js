var User = require('./../models/UserModel');
var Team = require('./TeamController');
var Promise = require('bluebird');

exports.findOrCreateUser = function(profile, orgName, callback) {
  var name = profile.displayName.split(' ');
  var userObj = {
    email: profile.emails[0].value,
    username: profile.username,
    firstName: name[0],
    lastName: name[1]
  };

  User.where('username', userObj.username).fetch()
    .then(function(user) {
      if(!user) {
        Team.findOrCreateTeam(orgName, function(teamId) {
          userObj.teamid = teamId;
          console.log('userObj', userObj);
          new User(userObj).save()
            .then(function(newUser) {
              return callback(newUser);
            })
            .catch(function(err) {
              console.log('Error saving to User table ', err);
            });
        });
      } else {
        return callback(user);
      }
    })
    .catch(function(err) {
      console.log('User Controller ', err);
    });
};

exports.getCurrentUser = function(userid, callback) {
  User.where({ id: userid }).fetch()
    .then(function(currentUser) {
      return callback(currentUser);
    })
    .catch(function(err) {
      console.error(err);
    });
};
