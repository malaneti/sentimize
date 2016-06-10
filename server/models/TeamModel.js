var db = require('../config/db');
var User = require('./UserModel.js');
var Promise = require('bluebird');

db.knex.schema.hasTable('teams').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('teams', function(team) {
     team.increments('id').primary();
     team.string('name', 255).unique();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

var Team = db.Model.extend({
  tableName: 'teams',
  users: function() {
    return this.hasMany(User);
  }
});

module.exports = Team;
