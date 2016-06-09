import React from 'react';
import { browserHistory } from 'react-router';

const TeamMember = props => (
  
  <div className="team-member-row" onClick={props.showUserSessions}>
    <div className="team-member-userName">{props.user.userName}</div>
    {/*<div className="team-member-description">{props.entry.description}</div>
    <div className="team-member-subject">
      <span className="label">Subject: </span>
      <span className="value">{props.entry.subject}</span>
    </div>
    <div className="team-member-date">
      <span className="label">Date: </span>
      <span className="value">{props.entry.date}</span>
    </div>
    <div className="team-member-duration">7ujn 
      <span className="label">Duration: </span>
      <span className="value">{props.entry.duration} seconds</span>
    </div>*/}
  </div>
);

export default TeamMember;