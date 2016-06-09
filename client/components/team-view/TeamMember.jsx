import React from 'react';
import { browserHistory } from 'react-router';

export default class TeamMember extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
    



  }

  _collateData(sessions) {
    //This function needs:
    // - Aggregate expressions data across all sessions for a user & calc an average
    // - Aggregate expressions data across all sessions for a user & calc an average OR show latest mood data?
    // - return an object with the two datasets to be passed to the chart objects to be rendered for the team member below

  }

  render() {
    return 
      (
        <div className="team-member-row" onClick={this.props.showUserSessions(this.props.user.userId)}>
          <div className="team-member-userName">{this.props.user.userName}</div>
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
      )
  }
};