import React from 'react';
import { browserHistory } from 'react-router';

export default class TeamMember extends React.Component {
  constructor(props) {
    super(props);
  }

  showSessionReport() {
    browserHistory.push('/reports/' + this.props.sessionId.toString());
  }

  render() {
    return (
      <div className="team-member-block" onClick={this.showSessionReport.bind(this)}>
        <div className="team-member-title">{this.props.entry.title}</div>
        <div className="team-member-description">{this.props.entry.description}</div>
        <div className="team-member-subject">
          <span className="label">Subject: </span>
          <span className="value">{this.props.entry.subject}</span>
        </div>
        <div className="team-member-date">
          <span className="label">Date: </span>
          <span className="value">{this.props.entry.date}</span>
        </div>
        <div className="team-member-duration">
          <span className="label">Duration: </span>
          <span className="value">{this.props.entry.duration} seconds</span>
        </div>
      </div>
    )
  }
};