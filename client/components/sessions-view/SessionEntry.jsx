import React from 'react';
import { browserHistory } from 'react-router';

export default class SessionEntry extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  showSessionReport() {
    browserHistory.push('/reports/' + this.props.sessionId);
  }

  render () {
    return (
      <div className="session-entry-row" onClick={this.showSessionReport.bind(this)}>
        <div className="session-entry-subject">
          <span className="label">Session: </span>
          <span className="value">{this.props.sessionId}</span>
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
};

