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
          
          new User(userObj).save()
            .then(function(newUser) {
              return callback(newUser);
            })
            .catch(function(err) {
              console.log('Error saving to users table: ', err);
            });
        });
      } else {
        return callback(user);
      }
    })
    .catch(function(err) {
      console.log('User Controller error: ', err);
    });
};

exports.getCurrentUser = function(userid, callback) {
  User.where({ id: userid }).fetch()
    .then(function(currentUser) {
      return callback(currentUser);
    })
    .catch(function(err) {
      console.error('Error fetching user: ', err);
    });
};

exports.getUser = function(req, res) {
  User.where({ id: req.user.id }).fetch()
    .then(function(currentUser) {
      res.send(currentUser);
    })
    .catch(function(err) {
      console.error('Error fetching user: ', err);
    });
};

exports.getUsersTeam = function(req, res) {
  User.where({ teamid: parseInt(req.user.attributes.teamid) }).fetchAll()
    .then(function(teamUsers) {
      var team = teamUsers.models.map(function(user) {
        return user.id;
      })

      res.send(team);
    })
    .catch(function(err) {
      console.error('Error fetching team: ', err);
    });
};
