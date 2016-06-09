import React from 'react';
import ReactDom from 'react-dom';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

export default class MainLayout extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      sessionId: null,
      intervalId: null,
      showQuestions: false,
      startTime: undefined
    };
  }

  setRecordState (stateProp, stateVal) {
    if ( stateProp === 'sessionId' ) {
      this.setState({sessionId: stateVal});
    } else if ( stateProp === 'intervalId' ) {
      this.setState({intervalId: stateVal});
    } else if ( stateProp === 'showQuestions' ) {
      this.setState({showQuestions: stateVal});
    } else if ( stateProp === 'startTime' ) {
      this.setState({startTime: stateVal});
    }
  }

  render () {
    return (
      <div className="main-layout">
        <div className="pure-u-2-3 record-box hidden">
          <video id='recordcam' className="pure-u-1-1 record-webcam" autoplay></video>
          <img id='current-snapshot' src=''/>
        </div>
        <NavBar />
        {React.cloneElement(this.props.children, {
          sessionId: this.state.sessionId,
          intervalId: this.state.intervalId,
          showQuestions: this.state.showQuestions,
          startTime: this.state.startTime,
          setRecordState: this.setRecordState.bind(this)
        })}
        <Footer />
      </div>
    );
  }
}
