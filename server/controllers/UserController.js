var User = require('./../models/UserModel');
var TeamController = require('./../controller/TeamController');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

exports.findOrCreateUser = function(profile, orgName) {
  var name = profile.displayName.split(' ');
  var userObj = {
    email: profile.emails[0],
    username: profile.username,
    firstName: name[0],
    lastName: name[1]
  };

  User.where('username', userObj.username).fetch().then(function(user) {
    if(!user) {
      var teamId = TeamController.findOrCreateTeam(orgName);
      userObj.teamid = teamId;
      new User(userObj).save()
        .then(function(newUser) {
          return newUser;
        });
    }
    return user;
  })
  .catch(function(err) {
    console.log(err);
  });
};

exports.getCurrentUser = function(userid) {
  User.where({ id: userid }).fetch()
    .then(function(currentUser) {
      return currentUser;
    })
    .catch(function(err) {
      console.error(err);
    });
};

exports.updateUser = function(req, res) {
  if (req.body.hasNewPassword === 'true') {
    setNewPassword(req, res);
  } else if (req.body.hasNewPassword === 'false') {
    updateUserProfile(req, res);
  }
};

var updateUserProfile = function(req, res) {
  var updatedUser = req.body;
  delete req.body.hasNewPassword;

  new User({ id: req.user.id }).save(updatedUser)
    .then(function(updatedUser) {
      res.status(200).send(updatedUser);
    })
    .catch(function(err) {
      console.error(err);
    })
};

var setNewPassword = function(req, res) {
  User.where({ id: req.user.id }).fetch()
    .then(function(currentUser) {
      currentUser.comparePassword(req.body.currentPassword, function(isMatch) {
        if (!isMatch) {
          res.status(401).send({ message: 'Incorrect password.' });
        } else {
          Promise.promisify(bcrypt.hash)(req.body.newPassword, null, null)
            .then(function(hashedPassword) {
              return new User({ id: req.user.id }).save({ password: hashedPassword });
            })
            .then(function(updatedUser) {
              updatedUser.hashPassword();
              res.status(200).send(updatedUser);
            })
            .catch(function(err) {
              console.error(err);
            })
        }
      });
    })
    .catch(function(err) {
      console.error(err);
    })
};

