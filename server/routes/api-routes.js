var SessionController = require('./../controllers/SessionController');
var SnapshotController = require('./../controllers/SnapshotController');
var UserController = require('./../controllers/UserController');
var VideoController = require('./../controllers/VideoController');

module.exports = function(app) {
  // See auth-routes for POST to /api/users
  app.get('/api/users', UserController.getUser);
  app.get('/api/users/team', UserController.getUsersTeam);
  app.get('/api/users/teamuser', UserController.getTeamUser);

  app.get('/api/session',  SessionController.getSessions);
  app.post('/api/session', SessionController.createSession);
  app.post('/api/session/update', SessionController.updateSession);

  app.get('/api/snapshot', SnapshotController.getSnapshots);
  app.post('/api/snapshot', SnapshotController.createSnapshot);
  
  app.get('/token', VideoController.generateToken);
};
