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

export default class TeamMemberEntryMock extends React.Component {
  constructor (props) {
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

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/api/snapshot',
      data: { sessionId: this.props.sessionId },
      error: function(request, status, error) {
        console.error('error while fetching report data', error);
      },
      success: function(sessionData) {
        console.log(sessionData);

        var sadness = 0;
        var disgust =0;
        var anger = 0;
        var surprise = 0;
        var fear = 0;
        var happiness = 0;
console.log( 'about to do something with sessionData.length' );
        var dataLength = sessionData.length;
console.log( 'just did something with sessionData.length' );
        var moodData = Object.assign({}, this.state.mood);
        var expressionsData = Object.assign({}, this.state.expressions);

        sessionData.forEach(ss => {

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
        })
        expressionsData.datasets[0].data = [Math.floor(sadness/dataLength), Math.floor(disgust/dataLength), Math.floor(anger/dataLength),
          Math.floor(surprise/dataLength), Math.floor(fear/dataLength), Math.floor(happiness/dataLength)];
        this.setState({expressions: expressionsData, mood: moodData});

        console.log(this.state);
      }.bind(this)
    });
  }

  showSessionReport () {
    browserHistory.push('/reports/' + this.props.sessionId.toString());
  }

  render () {
    return (
      <div className="teams-entry-block pure-g" onClick={this.showSessionReport.bind(this)}>
        <div className="pure-u-4-24">
          <h5>username</h5>
        </div>
        <div className="pure-u-5-24">
          <h5>Expressions Chart</h5>
          <RadarChart data={this.state.expressions}
                      redraw options={options}
                      width="50" height="60"/>
        </div>
        <div className="pure-u-12-24">
          <h5>Mood Chart</h5>
          <LineChart data={this.state.mood}
                     redraw options={options}
                     width="700" height="60"/>
        </div>
      </div>
    );
  }
};

