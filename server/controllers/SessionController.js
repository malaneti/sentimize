var Session = require('../models/SessionModel');
var moment = require('moment');

module.exports = {
  createSession: function(req, res) {
    var sessionObj = {
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      date: moment().format('MMMM Do YYYY, h:mm a'),
      duration: 'Temporary Duration'
    }

    return new Session(sessionObj).save()
      .then(function(newSession) {
        res.status(201).send(newSession);
      })
      .catch(function(err) {
       console.log(err);
      });
  },

  getSessions: function(req, res) {

    var queryObj = {
      userId: req.param('userId')
    }

    Session.where(queryObj).fetchAll()
      .then(function(sessions) {
        res.status(200).send(sessions);
      })
      .catch(function(err) {
        console.error(err);
      })
  },

  updateSession: function(req, res) {
    return Session.forge({id: req.body.sessionId})
      .fetch()
      .then(function(session) {
        session.save({
          duration: req.body.difference
        })
      })
      .then(function(updatedSession) {
        res.status(201).send(updatedSession)
      })
      .catch(function(err) {
        console.log('Error in updating session', err)
      })
  }
}
