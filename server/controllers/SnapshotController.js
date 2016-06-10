var Snapshot = require('../models/SnapshotModel');

module.exports = {
  createSnapshot: function(req, res) {
    var data = req.body.snapshotData;

    if (data.gender === undefined) {
      res.send(400).send('Snapshot failed to produce usable data.');
    }
    
    var snapshotObj = {
      mood: null,
      'gender-c': data.gender.confidence,
      'gender-v': data.gender.value,
      age: data.age.value,
      'ethnicity-c': data.ethnicity.confidence,
      'ethnicity-v': data.ethnicity.value,
      sadness: data.expressions.sadness.value,
      anger: data.expressions.anger.value,
      surprise: data.expressions.surprise.value,
      fear: data.expressions.fear.value,
      happiness: data.expressions.happiness.value,
      disgust: data.expressions.disgust.value,
      neutral: data.expressions.neutral.value,
      yaw: data.head.yaw.value,
      roll: data.head.roll.value,
      pitch: data.head.pitch.value,
      'eyeRight-y': data.landmarks.eyeRight.y,
      'eyeRight-x': data.landmarks.eyeRight.x,
      'eyeLeft-y': data.landmarks.eyeLeft.y,
      'eyeLeft-x': data.landmarks.eyeLeft.x,
      'face-y': data.face.y,
      'face-x': data.face.x,
      'face-w': data.face.w,
      'face-h': data.face.h,
      userId: req.user.id, 
      sessionId: req.body.sessionId 
    }
    
    if (data.mood.value === 'Positive') {
      snapshotObj.mood = data.mood.confidence
    } else {
      snapshotObj.mood = -(data.mood.confidence) 
    }

    return new Snapshot(snapshotObj).save()
      .then(function(newSnapshot) {
        res.status(201).send(newSnapshot);
      })
      .catch(function(err) {
       console.error(err);
      });
  },

  getSnapshots: function(req, res) {
    var queryField;
    var queryValues;

    if (req.param('userId')) {
      queryField = 'userId'; //all snapshots for specific user (TeamView component)
    } else if (req.param('sessionId')) {
      queryField = 'sessionId';  //all snapshots for specific session (ReportView component)
    }

    //Check if multiple queryValues (array) or a single value
    if (Array.isArray(req.param(queryField))) {
      queryValues = req.param(queryField).map(function(value){
        return parseInt(value) || value;
      });
    } else {
      queryValues = req.param(queryField);
    }

    //Use Knex QueryBuilder.whereIn() function inside Bookshelf.query() to check multiple values in the WHERE clause
    Snapshot.query(function(qb) {
        qb.whereIn(queryField, queryValues);
      }).fetchAll()
      .then(function(snapshots) {
        res.status(200).send(snapshots);
      })
      .catch(function(err) {
        console.error(err);
      });
  }
}
