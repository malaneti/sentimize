import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';

const moodAxisMinutes = 8;
const moodStart = moodAxisMinutes * 60000;

const options = {
  scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                  beginAtZero: true,
                  max: 8,
                  stepSize: 1
                }
            }]
          },
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
};

const styles = {
  graphContainer: {
    border: '1px solid black',
    padding: '15px'
  }
};

export default class TeamMember extends React.Component {
  constructor(props) {
    super(props);
        this.state = {
      expressions: {
        labels: ['Sadness', 'Disgust', 'Anger', 'Surprise', 'Fear', 'Happiness'],
        datasets: [
          {
            label: 'Expressions',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: []
          }
        ]
      },
      mood: {
        datasets: [
          {
            label: 'Mood TimeLine',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: []
          }
        ]
      }
    };
  }

  componentDidMount() {

    var sadness = 0;
    var disgust =0;
    var anger = 0;
    var surprise = 0;
    var fear = 0;
    var happiness = 0;
    var dataLength = this.props.snapshots.length;
    var moodData = Object.assign({}, this.state.mood);
    var expressionsData = Object.assign({}, this.state.expressions);

    this.props.snapshots.forEach(ss => {

      if ( ss.created_at >= (Date.now() - moodStart) ) {
        var adjustedTime = ( (ss.created_at - moodStart) / (Date.now() - moodStart) ) * moodAxisMinutes;
        moodData.datasets[0].data.push({x: adjustedTime, y: ss.mood});
      }

      sadness += ss.sadness;
      disgust += ss.disgust;
      anger += ss.anger;
      surprise += ss.surprise;
      fear += ss.fear;
      happiness += ss.happiness;
    });

    expressionsData.datasets[0].data = [Math.floor(sadness/dataLength), Math.floor(disgust/dataLength), Math.floor(anger/dataLength),
      Math.floor(surprise/dataLength), Math.floor(fear/dataLength), Math.floor(happiness/dataLength)];
    this.setState({expressions: expressionsData, mood: moodData});
  }

  showUserSessions() {
    browserHistory.push('/session/' + this.props.userId.toString());
  }

  render () {
    return (
      <div className="teams-entry-block pure-g" onClick={this.showUserSessions.bind(this)}>
        <div className="pure-u-4-24">
          <h5>username</h5>
        </div>
        <div className="pure-u-5-24">
          <RadarChart data={this.state.expressions}
                      redraw options={options}
                      width="50" height="60"/>
        </div>
        <div className="pure-u-12-24">
          <LineChart data={this.state.mood}
                     redraw options={options}
                     width="700" height="60"/>
        </div>
      </div>
    );
  }

  // _getAvgSnapshot(snapshots) {
  //   //This function needs:
  //   // - Aggregate expressions data across all sessions for a user & calc an average
  //   // - Aggregate expressions data across all sessions for a user & calc an average OR show latest mood data?
  //   // - return an object with the two datasets to be passed to the chart objects to be rendered for the team member below
    
  //   const dimensions = {
  //     mood: {
  //       mood: [],
  //       labels :[]
  //     },
  //     expressions: {
  //       age: 0,
  //       sadness: 0,
  //       anger: 0,
  //       surprise: 0,
  //       fear: 0,
  //       happiness: 0,
  //       disgust: 0,
  //       neutral: 0
  //     }
  //   };

  //   snapshots.forEach(function(snapshot) {
  //     //Get mood data
  //     dimensions.mood.mood.push(snapshot.mood);
  //     dimensions.mood.labels.push(snapshot.created_at);

  //     //Get expressions data
  //     for (let key in snapshot) {
  //       if (dimensions.expressions[key]) {
  //         dimensions.expressions[key] += snapshot[key]/snapshots.length;
  //       }
  //     }
  //   });
  //   // TODO: Need to return a JSX component
  //   return dimensions;
  // }

/*
  render() {
    return (
      <div className="team-member-row" id={this.props.userId} onClick={this.showUserSessions.bind(this)}>
        <div className="team-member-userName">{this.props.userId}</div>
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
        </div>}
      </div>
    )
  }
*/
}
