import React from 'react';
import SessionEntry from './SessionEntry.jsx';
import { browserHistory } from 'react-router';
import $ from 'jquery';

// import dummyData from './../../../data/session-data.json';

const SessionsView = props => (
  <div className="view sessions-view">
    <h4 className="sessions-view-title">My Sessions</h4>
    <div className="pure-g">
      {props.sessions.map(
        session => (
          <div className="pure-u-1-3">
            <SessionEntry session={session} 
                          sessionId={session.id}
                          onClick={props.showSessionReport} />
          </div>
        )
      )}
    </div>
  </div>
);

export default SessionsView;