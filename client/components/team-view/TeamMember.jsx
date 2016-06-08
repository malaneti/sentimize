import React from 'react';
import { browserHistory } from 'react-router';

export default TeamMember = props => (
  <div className="team-member-row" onClick={props.showSessionReport}>
    <div className="team-member-userName">{this.props.user.userName}</div>
    {/*<div className="team-member-description">{this.props.entry.description}</div>
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
    </div>*/}
  </div>
);