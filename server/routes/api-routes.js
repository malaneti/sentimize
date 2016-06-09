var SessionController = require('./../controllers/SessionController');
var SnapshotController = require('./../controllers/SnapshotController');
var UserController = require('./../controllers/UserController');

module.exports = function(app) {
  // See auth-routes for POST to /api/users
  app.get('/api/users', UserController.getUser);

  app.get('/api/session',  SessionController.getSessions);
  app.post('/api/session', SessionController.createSession);
  app.post('/api/session/update', SessionController.updateSession);

  app.get('/api/snapshot', SnapshotController.getSnapshots);
  app.post('/api/snapshot', SnapshotController.createSnapshot);
};