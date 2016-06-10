import React from 'react';
import { browserHistory } from 'react-router';

export default class SessionEntry extends React.Component {
  constructor(props) {
    super(props);
    console.log()
  }

  showSessionReport() {
    browserHistory.push('/reports/' + this.props.sessionId);
  }

  render() {
    return (
      <div className="session-entry-row" onClick={this.showSessionReport.bind(this)}>
        <div className="session-entry-title">{this.props.session.title}</div>
        <div className="session-entry-description">{this.props.session.description}</div>
        <div className="session-entry-subject">
          <span className="label">Subject: </span>
          <span className="value">{this.props.session.subject}</span>
        </div>
        <div className="session-entry-date">
          <span className="label">Date: </span>
          <span className="value">{this.props.session.date}</span>
        </div>
        <div className="session-entry-duration">
          <span className="label">Duration: </span>
          <span className="value">{this.props.session.duration} seconds</span>
        </div>
      </div>
    );
  }
}