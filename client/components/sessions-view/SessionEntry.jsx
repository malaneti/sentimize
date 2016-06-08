import React from 'react';
import { browserHistory } from 'react-router';

export default SessionEntry (
  <div className="session-entry-row" onClick={props.showSessionReport}>
    <div className="session-entry-title">{props.entry.title}</div>
    <div className="session-entry-description">{props.entry.description}</div>
    <div className="session-entry-subject">
      <span className="label">Subject: </span>
      <span className="value">{props.entry.subject}</span>
    </div>
    <div className="session-entry-date">
      <span className="label">Date: </span>
      <span className="value">{props.entry.date}</span>
    </div>
    <div className="session-entry-duration">
      <span className="label">Duration: </span>
      <span className="value">{props.entry.duration} seconds</span>
    </div>
  </div>
);