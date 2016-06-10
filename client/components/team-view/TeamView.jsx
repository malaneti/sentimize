import React from 'react';
import TeamMember from './TeamMember.jsx';
import { browserHistory } from 'react-router';
import $ from 'jquery';

// import dummyData from './../../../data/session-data.json';

export default class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userSnapshots: []
    }
  }

  componentDidMount() {
    this._getTeamUsers(function(data) {
      this.setState({ users: data.users });
      console.log(this.state.users);
      this._getSnapshots(function(data) {
        this.setState({ userSnapshots: this._snapshotsByUser(data) });
      }
    )}.bind(this));
  }

  _getTeamUsers(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/users/team',
      dataType: 'json',
      data: { teamid: this.state.teamId },
      success: function(data) {
        callback(data);
      },
      error: function(error) {
        console.error('_getSnapshots Error:', error);
      }
    });
  }

  _getSnapshots(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/snapshot',
      dataType: 'json',
      data: { teamId: this.state.teamId },
      success: function(data) {
        callback(data);
      },
      error: function(error) {
        console.error('_getSnapshots Error:', error);
      }
    });
  }

  _snapshotsByUser(snapshots) {
    //Build an object with user snapshots in an array by user
    let users = snapshots.reduce(function(usersSoFar, snapshot) {
      if (!usersSoFar[snapshot.userId]) {
        usersSoFar[snapshot.userId] = [];
      }
      usersSoFar[snapshot.userId].push(snapshot);
      return usersSoFar
     },{});

    //Convert users object to array of user objects & their related sessions
    let userSnapshots = [];
    for (let userId in users) {
      userSnapshots.push({
        userId: userId,
        snapshots: users[userId]
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
              <div className='pure-g'>
                <div className="pure-u-9-24">
                  <TeamMember userId={user.userId} snapshots={user.snapshots} />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}