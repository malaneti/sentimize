import React from 'react';
import TeamMemberEntryMock from './TeamMemberEntryMock.jsx';
import { browserHistory } from 'react-router';
import $ from 'jquery';

export default class TeamsViewMock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionEntries: []
    }
  }

  componentDidMount() {
    this._getSessions(function(data) {
      this.setState({ sessionEntries: data });
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

  render() {
    return (
      <div className="view teams-view">
        <div>
          {this.state.sessionEntries.map(
            entry => (
              <div>
                <TeamMemberEntryMock entry={entry} sessionId={entry.id} />
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

