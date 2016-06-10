var Team = require('./../models/TeamModel');
var Promise = require('bluebird');

exports.findOrCreateTeam = function(teamName, callback) {
  //pass in team name 
  var teamObj = {
    name: teamName
  };

  Team.where('name', teamObj.name).fetch()
    .then(function(team) {
      console.log('team: ', team);
      if(!team) {
        new Team(teamObj).save()
          .then(function(newTeam) {
            console.log('newTeam: ', newTeam.id);
            return callback(newTeam.id);
          })
          .catch(function(err) {
            console.log('Error saving to Team table ', err);
          });
      } else {
        console.log('team id: ', team.id);
        return callback(team.id);
      }
    })
    .catch(function(err) {
      console.log('Team Controller', err);
    });
};

exports.getCurrentTeam = function(teamName) {
    
  var teamObj = {
    name: teamName,
  };

  Team.where('name', teamObj.name).fetch()
    .then(function(currentTeam) {
      return currentTeam.id
    })
    .catch(function(err) {
      console.error(err);
    })
};
