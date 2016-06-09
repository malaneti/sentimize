import React from 'react';
import TeamMember from './TeamMember.jsx';
import { browserHistory } from 'react-router';
import $ from 'jquery';

// import dummyData from './../../../data/session-data.json';

export default class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSnapshots: []
    }
  }

  componentDidMount() {
    this._getSnapshots(function(data) {
      this.setState({ userSnapshots: _snapshotsByUser(data) });
    }.bind(this));
  }

  _getSnapshots(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/snapshot',
      dataType: 'json',
      data: { userId: [1, 2] },
      success: function(data) {
        callback(data);
      },
      error: function(error) {
        console.error('_getSnapshots Error:', error);
      }
    });
  }

  showUserSessions(userId) {
    browserHistory.push('/session/' + userId.toString());
  }

  _snapshotsByUser(snapshots) {
    //Build an object with user snapshots in an array by user
    let users = snapshots.reduce(function(usersSoFar, snapshot) {
      usersSoFar[snapshot.userId] = usersSoFar[snapshot.userId].push(snapshot) || [snapshot];
      return usersSoFar
     },{});

    //Convert users object to array of user objects & their related sessions
    let userSnapshots = [];
    for (let user of users) {
      userSnapshots.push({
        user: user,
        snapshots: users[user]
      })
    }
    return userSnapshots;
  }

  render() {
    return (
      <div className="view team-view">
        <h4 className="team-view-title">Team Dashboard</h4>
        <div className="pure-g">
          {this.state.userSnapshots.map(
            user => (
              <div className="pure-u-1-3">
                <TeamMember userId={user.userId} 
                            snapshots={user.snapshots} 
                            onClick={this.showUserSessions.bind(this)}/>
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}