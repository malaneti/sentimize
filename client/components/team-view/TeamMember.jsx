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
  pointDotRadius: 1,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
};

export default class TeamMember extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expressions: {
        labels: [],
        datasets: [
          {
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
        labels: [],
        datasets: [
          {
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

  componentDidMount () {
    this._getAvgSnapshot(this.props.snapshots);
  };

  _getAvgSnapshot(snapshots) {
    var moodData = Object.assign({}, this.state.mood);
    var expressionsData = Object.assign({}, this.state.expressions);
    var moodBuckets = {
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0
    };

    var dimensions = {
      mood: {
        data: [],
        labels :[]
      },
      expressions: {
        sadness: 0,
        anger: 0,
        surprise: 0,
        fear: 0,
        happiness: 0,
        disgust: 0,
        neutral: 0
      }
    };

    var expressionsKeys = Object.keys(dimensions.expressions);
    var i = 0;
    var bucket = 8;
    var snapshotsPerBucket = Math.floor(snapshots.length/10);

    snapshots.forEach(function(snapshot) {
      //Get mood data and calc average per time bucket
      if (i < snapshotsPerBucket) {
        moodBuckets[bucket] += snapshot.mood;
        i++;
      } else if (bucket < 18) {
        moodBuckets[bucket] = Math.floor(moodBuckets[bucket]/snapshotsPerBucket) || 0;
        i = 0;
        bucket++;
      }

      //Get expressions data
      for (let key in snapshot) {
        if (expressionsKeys.indexOf(key) !== -1) {
          dimensions.expressions[key] += snapshot[key];
        }
      }
    });

    //Compose mood data
    for (let bucket in moodBuckets) {
      moodData.datasets[0].data.push(moodBuckets[bucket]);
      moodData.labels.push(bucket);
    }
    //Compose expressions data
    for (let key in dimensions.expressions) {
      expressionsData.labels.push(key[0].toUpperCase() + key.slice(1));
      expressionsData.datasets[0].data.push(Math.floor(dimensions.expressions[key]/snapshots.length)); //Calc avg
    }

    this.setState({ expressions: expressionsData, mood: moodData });
  };

  showUserSessions () {
    browserHistory.push('/session/' + this.props.userId);
  }

  render () {
    return (
      <div className="teams-entry-block pure-g" onClick={this.showUserSessions.bind(this)}>
        <div className="teams-entry-user pure-u-3-24">
          <h5>{this.props.username}</h5>
          <h5>username</h5>
        </div>
        <div className="teams-entry-radar-chart pure-u-3-24">
          <RadarChart data={this.state.expressions}
                      redraw options={options}
                      width="120" height="120"/>
        </div>
        <div className="teams-entry-mood-chart pure-u-16-24">
          <LineChart data={this.state.mood}
                     redraw options={options}
                     width="700" height="60"/>
        </div>
      </div>
    );
  }
}

