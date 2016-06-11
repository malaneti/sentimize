import React from 'react';
import $ from 'jquery';

export default class VideoConfView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conversationsClient: null,
      activeConversation: null,
      previewMedia: null,
      identity: null
    };
  }

  componentWillMount() {
    // Check for WebRTC
    if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      alert('WebRTC is not available in your browser.');
    }

    $.getJSON('/token', function(data) {
      this.setState({
        identity: data.identity
      });
      var accessManager = new Twilio.AccessManager(data.token);

      // Check the browser console to see your generated identity. 
      // Send an invite to yourself if you want! 
      console.log(this.state.identity);

      // Create a Conversations Client and connect to Twilio
      this.setState({
        conversationsClient: new Twilio.Conversations.Client(accessManager)
      });

      this.state.conversationsClient.listen().then(this.clientConnected.bind(this), function (error) {
        this.log('Could not connect to Twilio: ' + error.message);
      }.bind(this));
    }.bind(this));
  }

  // Successfully connected!
  clientConnected() {
    document.getElementById('invite-controls').style.display = 'block';
    this.log("Connected to Twilio. Listening for incoming Invites as '" + this.state.conversationsClient.identity + "'");

    this.state.conversationsClient.on('invite', function (invite) {
      this.log('Incoming invite from: ' + invite.from);
      invite.accept().then(this.conversationStarted.bind(this));
    }.bind(this));

    // Bind button to create conversation
  }

  invite() {
    var inviteTo = document.getElementById('invite-to').value;
    if (this.state.activeConversation) {
      // Add a participant
      this.state.activeConversation.invite(inviteTo);
      } else {
      // Create a conversation
      var options = {};
      if (this.state.previewMedia) {
        options.localMedia = this.state.previewMedia;
      }
      this.state.conversationsClient.inviteToConversation(inviteTo, options).then(this.conversationStarted.bind(this), function (error) {
        this.log('Unable to create conversation');
        console.error('Unable to create conversation', error);
      }.bind(this));
    }
  };

  // Conversation is live
  conversationStarted(conversation) {
    this.log('In an active Conversation');
    this.setState({
      activeConversation: conversation
    });
    // Draw local video, if not already previewing
    if (!this.state.previewMedia) {
      conversation.localMedia.attach('#local-media');
    }

    // When a participant joins, draw their video on screen
    conversation.on('participantConnected', function (participant) {
      this.log("Participant '" + participant.identity + "' connected");
      participant.media.attach('#remote-media');
    }.bind(this));

    // When a participant disconnects, note in log
    conversation.on('participantDisconnected', function (participant) {
      this.log("Participant '" + participant.identity + "' disconnected");
    }.bind(this));

    // When the conversation ends, stop capturing local video
    conversation.on('disconnected', function (conversation) {
      this.log("Connected to Twilio. Listening for incoming Invites as '" + this.state.conversationsClient.identity + "'");
      conversation.localMedia.stop();
      conversation.disconnect();
      this.state.activeConversation = null;
    }.bind(this));
  }

  // Local video preview
  openPreview() {
    if (!this.state.previewMedia) {
      this.setState({
        previewMedia: new Twilio.Conversations.LocalMedia()
      });

      Twilio.Conversations.getUserMedia().then(
      function (mediaStream) {
        this.state.previewMedia.addStream(mediaStream);
        this.state.previewMedia.attach('#local-media');
      }.bind(this),
      function (error) {
        console.error('Unable to access local media', error);
        this.log('Unable to access Camera and Microphone');
      }.bind(this));
    };
  }

  // Activity log
  log(message) {
    document.getElementById('log-content').innerHTML = message;
  }

  render() {
    return (
      <div>
        <div id="remote-media"></div>
        <div id="controls">
          <div id="preview">
            <p className="instructions">Hello Beautiful</p>
            <div id="local-media"></div>
            <button id="button-preview" onClick={this.openPreview.bind(this)}>Preview My Camera</button>
          </div>
          <div id="invite-controls">
            <p className="instructions">Invite another Video Client</p>
            <input id="invite-to" type="text" placeholder="Identity to send an invite to" />
            <button id="button-invite" onClick={this.invite.bind(this)}>Send Invite</button>
          </div>
          <div id="log">
            <p>&gt;&nbsp;<span id="log-content">Preparing to listen</span>...</p>
          </div>
        </div>
      </div>
    );
  }
};