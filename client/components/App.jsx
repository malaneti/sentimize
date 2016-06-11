import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import MainLayout from './main-layout/MainLayout.jsx';
import HomeView from './home-view/HomeView.jsx';
import RecordView from './record-view/RecordView.jsx';
import TeamView from './team-view/TeamView.jsx';
import SessionsView from './sessions-view/SessionsView.jsx';
import TeamsViewMock from './team-view/TeamsViewMock.jsx';
import ReportView from './report-view/ReportView.jsx';
import SettingsView from './settings-view/SettingsView.jsx';
import VideoConfView from './team-view/VideoConfView.jsx';

export default class App extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={MainLayout}>
          <IndexRoute component={HomeView} />
          <Route path="record" component={RecordView} />
          <Route path="team" component={TeamView} />
          <Route path="session/:userId" component={SessionsView} />
          <Route path="teams" component={TeamsViewMock} />
          <Route path="video/:userId" component={VideoConfView} />
          <Route path="reports/:sessionId" component={ReportView} />
          <Route path="settings" component={SettingsView} />
        </Route>
      </Router>
    );
  }
}
