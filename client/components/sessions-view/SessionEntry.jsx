import React from 'react';
import { browserHistory } from 'react-router';

const SessionEntry = props => (
  <div className="session-entry-row" onClick={props.showSessionReport(props.session.sessionId)}>
    <div className="session-entry-title">{props.session.title}</div>
    <div className="session-entry-description">{props.session.description}</div>
    <div className="session-entry-subject">
      <span className="label">Subject: </span>
      <span className="value">{props.session.subject}</span>
    </div>
    <div className="session-entry-date">
      <span className="label">Date: </span>
      <span className="value">{props.session.date}</span>
    </div>
    <div className="session-entry-duration">
      <span className="label">Duration: </span>
      <span className="value">{props.session.duration} seconds</span>
    </div>
  </div>
);

export default SessionEntry;