import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import TeamMember from './TeamMember.jsx';

export default class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      teamId: null,
      users: [],
      userIds: [],
      userSnapshots: []
    }
  }

  componentDidMount() {
    this._getCurrentUser(function(currentUser) {
      this.setState({
        userId: currentUser.id,
        teamId: parseInt(currentUser.teamid)
      });
      this._getTeamUsers(function(users) {
        this.setState({ userIds: users.userIds, users: users.users });
        console.log(this.state);
        this._getSnapshots(function(snapshots) {
          this.setState({ userSnapshots: this._snapshotsByUser(snapshots) });
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  _getCurrentUser(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/users',
      dataType: 'json',
      success: function(data) {
        callback(data);
      },
      error: function(err) {
        console.error('_getCurrentUser error', err);
      }
    });
  }

  _getTeamUsers(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/users/team',
      dataType: 'json',
      data: { teamid: this.state.teamId },
      success: function(data) {
        var users = {
          userIds: [],
          users: []
        }
  
        data.forEach(function(user) {
          users.userIds.push(user.userId)
          users.users.push(user);
        })
        callback(users);
      },
      error: function(error) {
        console.error('_getTeamUsers Error:', error);
      }
    });
  }

  _getSnapshots(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/snapshot',
      dataType: 'json',
      data: { userIds: this.state.userIds },
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
    this.state.users.forEach(function(user) {
      for (let userId in users) {
        if (Number(user.userId) === Number(userId)) {
          userSnapshots.push({
            userId: userId,
            username: user.username,
            snapshots: users[userId]
          })
        }
      }
    });
    return userSnapshots;
  }

  render() {
    return (
      <div className="view teams-view">
        <div>
          {this.state.userSnapshots.map(
            user => (
              <div>
                <TeamMember username={user.username} userId={user.userId} snapshots={user.snapshots} />
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}
