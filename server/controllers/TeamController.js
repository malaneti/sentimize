var Team = require('./../models/TeamModel.js');
var Promise = require('bluebird');

exports.findOrCreateTeam = function(teamName) {
  //pass in team name 
  var teamObj = {
    name: teamName,
  };

  Team.where('name', teamObj.name).fetch()
    .then(function(team) {
      if(!team) {
        new Team(teamObj).save()
          .then(function(newTeam) {
            return newTeam.id;
          })
      }
      return team.id;
    })
    .catch(function(err) {
      console.log(err);
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
