var Team = require('./../models/TeamModel');
var Promise = require('bluebird');

exports.findOrCreateTeam = function(teamName, callback) {
  var teamObj = {
    name: teamName
  };

  Team.where('name', teamObj.name).fetch()
    .then(function(team) {
      if(!team) {
        new Team(teamObj).save()
          .then(function(newTeam) {
            return callback(newTeam.id);
          })
          .catch(function(err) {
            console.log('Error saving to teams table: ', err);
          });
      } else {
        return callback(team.id);
      }
    })
    .catch(function(err) {
      console.log('Team Controller error: ', err);
    });
};

exports.getCurrentTeam = function(teamName, callback) {
  var teamObj = {
    name: teamName
  };

  Team.where('name', teamObj.name).fetch()
    .then(function(currentTeam) {
      return callback(currentTeam.id);
    })
    .catch(function(err) {
      console.error('Error fetching team :', err);
    });
};
