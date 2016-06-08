import React from 'react';
import TeamMember from './TeamMember.jsx';
import { browserHistory } from 'react-router';
import $ from 'jquery';

// import dummyData from './../../../data/session-data.json';

export default class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSessions: {}
    }
  }

  componentDidMount() {
    this._getSessions(function(data) {
      this.setState({ userSessions: _sessionsByUser(data) });
    }.bind(this));
  }

  _getSessions(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/session',
      success: function(data) {
        callback(data);
      },
      error: function(error) {
        console.error('_getSessions Error:', error);
      },
      dataType: 'json'
    });
  }

  _sessionsByUser(sessions) {
    let users = sessions.reduce(function(usersSoFar, session) {
      usersSoFar[session.userId] = usersSoFar[session.userId].push(session) || [session];
      return usersSoFar
     },{});

    return users;
  }

  render() {
    return (
      <div className="view team-view">
        <h4 className="team-view-title">Team Dashboard</h4>
        <div className="pure-g">
          {this.state.sessionBuckets.map(
            entry => (
              <div className="pure-u-1-3">
                <TeamMember entry={entry} sessionId={entry.id} />
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}