import React from 'react';
import ReactDom from 'react-dom';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

export default class MainLayout extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="main-layout">
        <div className="pure-u-2-3 record-box hidden">
          <video id='recordcam' className="pure-u-1-1 record-webcam" autoplay></video>
          <img id='current-snapshot' src=''/>
        </div>
        <NavBar />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
