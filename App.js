console.log('Main Application Render');
const url = require('url')
const remote = require('electron').remote;
const electron = require('electron');
const app = electron.app
const RTCPeerConnection = require('rtcpeerconnection');
var configData
var ipcRenderer = require('electron').ipcRenderer;
var uID = null;
var chat = null;
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = "26gf#8273%%gahdsf7%sd$tf"
function encryptText(text){
    const cipher = crypto.createCipher(algorithm,password);
    let encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
function decryptText(text){
    const decipher = crypto.createDecipher(algorithm,password);
    let decrypted = decipher.update(text,'hex','utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
var chatHistory = document.getElementById('chattxt');
var sql = require("mysql");
// Database Configuration
var con = sql.createConnection({
    host:"Morin.tk",
    user: 'ChatCode',
    password: 'ChatCode123',
    server: 'Morin.tk',
    database: 'ChatCode',
});
function chatrefresh(){
  console.log("contacted server")
  chatHistory.innerHTML = ""
    con.query('select * from GeneralChat', (err, results, field)=>{
      for (var i = 0; i < results.length; i++){
        let message = [results[i].Message][0]
        con.query(('SELECT Username from Login WHERE UserID = ?'),[results[i].UserID],(err,result)=>{
        chatHistory.innerHTML += result[0].Username+" : "+decryptText(message) +"<br>";
        })
      };
    });
  };
ipcRenderer.on('UserID', function (event,UserID) {
    console.log(UserID);
    uID = UserID
    //chat()
    setInterval(chatrefresh, 10000);
    });
chatrefresh()
const SendChat = document.getElementById('sendchat');
SendChat.addEventListener('click', function(event){
  chat = document.getElementById('textchat');
  chat = encryptText(chat.value)
  const stmnt = "INSERT INTO GeneralChat(UserID, Message) VALUES ?";
  info = [[uID,chat]]
  con.query(stmnt, [info] , (err, results)=> {
    console.log(err);
    console.log("Message Sent");
    chat = document.getElementById('textchat');
    chat.value = null
    chatrefresh()
    })
  });

/*var pcConfig = {
  'iceServers': [{
    'urls': 'stun:stun.1.google.com:19302'
  }]
};

const videoConstraints = {
  audio: true,
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    framerate: { max: 30 },
    aspectRatio: 2.1
  }
};

const offerOptions = {
  offerToReceiveVideo: true,
  offerToReceiveAudio: true,
};

let startTime = null;

// Define peer connections, streams and video elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');*/


/** browser dependent definition are aligned to one and the same standard name **/

var config = {
 wssHost: 'wss://localhost:631'
 // wssHost: 'wss://example.com/myWebSocket'
};
var localVideoElem = null,
 remoteVideoElem = null,
 localVideoStream = null,
 callButton = null,
 closeButton = null;
var peerConn = null,
 wsc = new WebSocket(config.wssHost),
 peerConnCfg = {'iceServers':
   [{'url': 'stun:stun.services.mozilla.com'},
    {'url': 'stun:stun.l.google.com:19302'}]
 };

function pageReady() {
 // check browser WebRTC availability
 if(navigator.getUserMedia) {
   callButton = document.getElementById("callButton");
   closeButton = document.getElementById("closeButton");
   localVideo = document.getElementById('localVideo');
   remoteVideo = document.getElementById('remoteVideo');
   callButton.removeAttribute("disabled");
   callButton.addEventListener("click", initiateCall);
   closeButton.addEventListener("click", function (evt) {
     wsc.send(JSON.stringify({"closeConnection": true }));
   });
 } else {
   alert("Sorry, your browser does not support WebRTC!")
 }
};

function prepareCall() {
 peerConn = new RTCPeerConnection(peerConnCfg);
 // send any ice candidates to the other peer
 peerConn.onicecandidate = onIceCandidateHandler;
 // once remote stream arrives, show it in the remote video element
 peerConn.onaddstream = onAddStreamHandler;
};

// run start(true) to initiate a call
function initiateCall() {
 prepareCall();
 // get the local stream, show it in the local video element and send it
 navigator.getUserMedia({ "audio": true, "video": true }, function (mediaStream) {
   localVideoStream = mediaStream;
   localVideo.src = URL.createObjectURL(localVideoStream);
   peerConn.addStream(localVideoStream);
   createAndSendOffer();
 }, function(error) { console.log(error);});
};

function answerCall() {
 prepareCall();
 // get the local stream, show it in the local video element and send it
 navigator.getUserMedia({ "audio": true, "video": true }, function (mediaStream) {
   localVideoStream = mediaStream;
   localVideo.src = URL.createObjectURL(localVideoStream);
   peerConn.addStream(localVideoStream);
   createAndSendAnswer();
 }, function(error) { console.log(error);});
};

wsc.onmessage = function (evt) {
 var signal = null;
 if (!peerConn) answerCall();
 signal = JSON.parse(evt.data);
 if (signal.sdp) {
   console.log("Received SDP from remote peer.");
   peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp));
 }
 else if (signal.candidate) {
   console.log("Received ICECandidate from remote peer.");
   peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate));
 } else if ( signal.closeConnection){
   console.log("Received 'close call' signal from remote peer.");
   endCall();
 }
};
function createAndSendOffer() {
 peerConn.createOffer(
   function (offer) {
     var off = new RTCSessionDescription(offer);
     peerConn.setLocalDescription(new RTCSessionDescription(off),
       function() {
         wsc.send(JSON.stringify({"sdp": off }));
       },
       function(error) { console.log(error);}
     );
   },
   function (error) { console.log(error);}
 );
};
function createAndSendAnswer() {
 peerConn.createAnswer(
   function (answer) {
     var ans = new RTCSessionDescription(answer);
     peerConn.setLocalDescription(ans, function() {
         wsc.send(JSON.stringify({"sdp": ans }));
       },
       function (error) { console.log(error);}
     );
   },
   function (error) {console.log(error);}
 );
};
function onIceCandidateHandler(evt) {
 if (!evt || !evt.candidate) return;
 wsc.send(JSON.stringify({"candidate": evt.candidate }));
};

function onAddStreamHandler(evt) {
 callButton.setAttribute("disabled", true);
 closeButton.removeAttribute("disabled");
 // set remote video stream as source for remote video HTML5 element
 remoteVideo.src = URL.createObjectURL(evt.stream);
};

function endCall() {
 peerConn.close();
 peerConn = null;
 callButton.removeAttribute("disabled");
 closeButton.setAttribute("disabled", true);
 if (localVideoStream) {
   localVideoStream.getTracks().forEach(function (track) {
     track.stop();
   });
   localVideo.src = "";
 }
 if (remoteVideo) remoteVideo.src = "";
};

// Local stream that will be reproduced on the video.
/*let localStream;
let remoteStream;
let localPeerConnection;

// Handles success by adding the MediaStream to the video element.
function gotLocalMedia(mediaStream) {
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  trace('Received local stream.');
  callButton.disabled = false;
}

// Handles error by logging a message to the console with the error message.
function handleError(error) {
  if (error.name === "ConstraintNotSatisfiedError") {
    let v = videoConstraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === "PermissionDeniedError") {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.')
  }
  errorMsg('getUserMedia error: ${error.name}', error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector("#errorMsg");
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
};

function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
  trace('Remote peer connection received remote stream.');
}

// Logs a message with the id and size of a video element.
function logVideoLoaded(event) {
  const video = event.target;
  trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
        `videoHeight: ${video.videoHeight}px.`);
}

// Logs a message with the id and size of a video element.
// This event is fired when video begins streaming.
function logResizedVideo(event) {
  logVideoLoaded(event);

  if (startTime) {
    const elapsedTime = window.performance.now() - startTime;
    startTime = null;
    trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
  }
}

localVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('onresize', logResizedVideo);

// Connects with new peer candidate.
function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection);
      }).catch((error) => {
        handleConnectionFailure(peerConnection, error);
      });

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`);
  }
}

// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
  trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

// Logs changes to the connection state.
function handleConnectionChange(event) {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
  trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`);
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
  trace(`Failed to create session description: ${error.toString()}.`);
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
  const peerName = getPeerName(peerConnection);
  trace(`${peerName} ${functionName} complete.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description) {
  trace(`Offer from localPeerConnection:\n${description.sdp}`);

  trace('localPeerConnection setLocalDescription start.');
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection setRemoteDescription start.');
  remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection createAnswer start.');
  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch(setSessionDescriptionError);
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
  trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('localPeerConnection setRemoteDescription start.');
  localPeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);
}


// Define and add behavior to buttons.

// Define action buttons.
const startVid = document.getElementById('startVid');
const callButton = document.getElementById('callButton');
const closeButton = document.getElementById('closeButton');

// Set up initial action buttons status: disable call and hangup.
callButton.disabled = true;
closeButton.disabled = false;


// Handles start button action: creates local MediaStream.
function startAction() {
  startVid.disabled = true;
  closeButton.disabled = false;
  navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(gotLocalMedia).catch(errorMsg);
  trace('Requesting local stream.');

  trace('Starting call.');
  startTime = window.performance.now();

  // Get local media stream tracks.
  /*const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    trace(`Using video device: ${videoTracks[0].label}.`);
  }
  if (audioTracks.length > 0) {
    trace(`Using audio device: ${audioTracks[0].label}.`);
  }*/

  /*const config = {
    iceServers: [{ url: 'stun:stun.1.google.com:19302' }]
  }
  const servers = null;  // Allows for RTC server configuration.
  console.log("I am here!!!");
  // Create peer connections and add behavior.
  localPeerConnection = new RTCPeerConnection(config);
  trace('Created local peer connection object localPeerConnection.');

  localPeerConnection.addEventListener('icecandidate', handleConnection);
  localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);

  remotePeerConnection = new RTCPeerConnection(config);
  trace('Created remote peer connection object remotePeerConnection.');

  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
  remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  // Add local stream to connection and create offer to connect.
  localPeerConnection.addStream(localStream);
  trace('Added local stream to localPeerConnection.');

  trace('localPeerConnection createOffer start.');
  localPeerConnection.createOffer(offerOptions)
    .then(createdOffer).catch(setSessionDescriptionError);
};*/

// Handles call button action: creates peer connection.
/*function callAction() {
  callButton.disabled = false;
  closeButton.disabled = true;

  trace('Starting call.');
  startTime = window.performance.now();

  // Get local media stream tracks.
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  if (videoTracks.length > 0) {
    trace(`Using video device: ${videoTracks[0].label}.`);
  }
  if (audioTracks.length > 0) {
    trace(`Using audio device: ${audioTracks[0].label}.`);
  }

  const config = {
    iceServers: [{ url: 'stun:stun2.1.google.com:19302' }]
  }
  const servers = null;  // Allows for RTC server configuration.
  console.log("I am here!!!");
  // Create peer connections and add behavior.
  localPeerConnection = new RTCPeerConnection(config);
  trace('Created local peer connection object localPeerConnection.');

  localPeerConnection.addEventListener('icecandidate', handleConnection);
  localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);

  remotePeerConnection = new RTCPeerConnection(config);
  trace('Created remote peer connection object remotePeerConnection.');

  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
  remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  // Add local stream to connection and create offer to connect.
  localPeerConnection.addStream(localStream);
  trace('Added local stream to localPeerConnection.');

  trace('localPeerConnection createOffer start.');
  localPeerConnection.createOffer(offerOptions)
    .then(createdOffer).catch(setSessionDescriptionError);
}*/

// Handles hangup action: ends up call, closes connections and resets peers.
/*function hangupAction() {
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  closeButton.disabled = true;
  //callButton.disabled = false;
  trace('Ending call.');
}

// Add click event handlers for buttons.
startVid.addEventListener('click', startAction);
//callButton.addEventListener('click', callAction);
closeButton.addEventListener('click', hangupAction);

// Logs an action (text) and the time when it happened on the console.
function trace(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}
*/
