console.log('Main Application Render');
const url = require('url')
const remote = require('electron').remote;
const electron = require('electron');
const app = electron.app
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

'use strict';

const wrtc = require('electron-webrtc')();

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const closeButton = document.getElementById('closeButton');

const video1 = document.querySelector('video#video1');
const video2 = document.querySelector('video#video2');

callButton.disabled = true;
closeButton.disabled = true;

// Add click event handlers for buttons.
startButton.onclick = startAction;
callButton.onclick = callAction;
closeButton.onclick = hangupAction;

const signalhub = require('signalhub');

const hub = signalhub('ChatCode', [
  'http://localhost:80'
]);

hub.subscribe('update').on('data', function (data) {
  console.log(data)
});

let pc1Local;
let pc1Remote;
let pc2Local;
let pc2Remote;

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function gotStream(stream) {
  console.log('Received local stream');
  video1.srcObject = stream;
  window.localStream = stream;
  callButton.disabled = false;
}

function startAction() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
      .then(gotStream)
      .catch(e => console.log('getUserMedia() error: ', e));
}

function callAction() {
  callButton.disabled = true;
  closeButton.disabled = false;
  console.log('Starting calls');
  const audioTracks = window.localStream.getAudioTracks();
  const videoTracks = window.localStream.getVideoTracks();
  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }
  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  // Create an RTCPeerConnection via the polyfill.
  const servers = null;
  pc1Local = new wrtc.RTCPeerConnection(servers);
  pc1Remote = new wrtc.RTCPeerConnection(servers);
  pc1Remote.ontrack = gotRemoteStream1;
  pc1Local.onicecandidate = iceCallback1Local;
  pc1Remote.onicecandidate = iceCallback1Remote;
  console.log('pc1: created local and remote peer connection objects');

  pc2Local = new wrtc.RTCPeerConnection(servers);
  pc2Remote = new wrtc.RTCPeerConnection(servers);
  pc2Remote.ontrack = gotRemoteStream2;
  pc2Local.onicecandidate = iceCallback2Local;
  pc2Remote.onicecandidate = iceCallback2Remote;
  console.log('pc2: created local and remote peer connection objects');

  localStream.getTracks().forEach(track => pc1Local.addTrack(track, localStream));
  console.log('Adding local stream to pc1Local');
  pc1Local
      .createOffer(offerOptions)
      .then(gotDescription1Local, onCreateSessionDescriptionError);

  window.localStream.getTracks().forEach(track => pc2Local.addTrack(track, window.localStream));
  console.log('Adding local stream to pc2Local');
  pc2Local.createOffer(offerOptions)
      .then(gotDescription2Local, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

function gotDescription1Local(desc) {
  pc1Local.setLocalDescription(desc);
  console.log(`Offer from pc1Local\n${desc.sdp}`);
  pc1Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError);
}

function gotDescription1Remote(desc) {
  pc1Remote.setLocalDescription(desc);
  console.log(`Answer from pc1Remote\n${desc.sdp}`);
  pc1Local.setRemoteDescription(desc);
}

function gotDescription2Local(desc) {
  pc2Local.setLocalDescription(desc);
  console.log(`Offer from pc2Local\n${desc.sdp}`);
  pc2Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc2Remote.createAnswer().then(gotDescription2Remote, onCreateSessionDescriptionError);
}

function gotDescription2Remote(desc) {
  pc2Remote.setLocalDescription(desc);
  console.log(`Answer from pc2Remote\n${desc.sdp}`);
  pc2Local.setRemoteDescription(desc);
}

function hangupAction() {
  console.log('Ending calls');
  pc1Local.close();
  pc1Remote.close();
  pc2Local.close();
  pc2Remote.close();
  pc1Local = pc1Remote = null;
  pc2Local = pc2Remote = null;
  closeButton.disabled = true;
  callButton.disabled = false;
}

function gotRemoteStream1(e) {
  if (video2.srcObject !== e.streams[0]) {
    video2.srcObject = e.streams[0];
    console.log('pc1: received remote stream');
  }
}

function gotRemoteStream2(e) {
  if (video1.srcObject !== e.streams[0]) {
    video1.srcObject = e.streams[0];
    console.log('pc2: received remote stream');
  }
}

function iceCallback1Local(event) {
  handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
}

function iceCallback1Remote(event) {
  handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote');
}

function iceCallback2Local(event) {
  handleCandidate(event.candidate, pc2Remote, 'pc2: ', 'local');
}

function iceCallback2Remote(event) {
  handleCandidate(event.candidate, pc2Local, 'pc2: ', 'remote');
}

function handleCandidate(candidate, dest, prefix, type) {
  dest.addIceCandidate(candidate)
      .then(onAddIceCandidateSuccess, onAddIceCandidateError);
  console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log(`Failed to add ICE candidate: ${error.toString()}`);
}
