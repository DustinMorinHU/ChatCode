console.log('Main Application Render');
const url = require('url')
const remote = require('electron').remote;
const electron = require('electron');
const app = electron.app
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

const signalhub = require('signalhub');
const createSwarm = require('webrtc-swarm');
const hub = signalhub('ChatCode', [
  'http://localhost:80'
]);
/*const swarm = createSwarm(hub, {
  stream: stream
});*/

hub.subscribe('update').on('data', function (data) {
  console.log(data)
})

setInterval(function () {
  hub.broadcast('update', window.location.hash)
}, 1000)

var localVideoElem = null,
 remoteVideoElem = null,
 localVideoStream = null,
 callButton = null,
 closeButton = null;
//var peerConn = null,
const RTCPeerConnection = require('rtcpeerconnection');

const webrtc = new RTCPeerConnection({
  iceServers:[
    {
      urls: 'stun:stun.services.mozilla.com'},
    {urls: 'stun:stun.l.google.com:19302'}]
 });

var stream = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
const CallButton = document.getElementById('callButton');
CallButton.addEventListener('click', function(event){
  });

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
     hub.send(JSON.stringify({"closeConnection": true }));
   });
 } else {
   alert("Sorry, your browser does not support WebRTC!")
 }
};
function prepareCall() {
 // send any ice candidates to the other peer
 webrtc.onicecandidate = onIceCandidateHandler;
 // once remote stream arrives, show it in the remote video element
 webrtc.onaddstream = onAddStreamHandler;
};
// run start(true) to initiate a call
function initiateCall() {
 prepareCall();
 // get the local stream, show it in the local video element and send it
 navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
   localVideoStream = stream;
   localVideo.src = URL.createObjectURL(localVideoStream);
   webrtc.addStream(localVideoStream);
   createAndSendOffer();
 }, function(error) { console.log(error);});
};
function answerCall() {
 prepareCall();
 // get the local stream, show it in the local video element and send it
 navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
   localVideoStream = stream;
   localVideo.src = URL.createObjectURL(localVideoStream);
   webrtc.addStream(localVideoStream);
   createAndSendAnswer();
 }, function(error) { console.log(error);});
};
hub.onmessage = function (evt) {
 var signal = null;
 if (!webrtc) answerCall();
 signal = JSON.parse(evt.data);
 if (signal.sdp) {
   console.log("Received SDP from remote peer.");
   webrtc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
 }
 else if (signal.candidate) {
   console.log("Received ICECandidate from remote peer.");
   webrtc.addIceCandidate(new RTCIceCandidate(signal.candidate));
 } else if ( signal.closeConnection){
   console.log("Received 'close call' signal from remote peer.");
   endCall();
 }
};
function createAndSendOffer() {
 webrtc.createOffer(
   function (offer) {
     var off = new RTCSessionDescription(offer);
     webrtc.setLocalDescription(new RTCSessionDescription(off),
       function() {
         hub.send(JSON.stringify({"sdp": off }));
       },
       function(error) { console.log(error);}
     );
   },
   function (error) { console.log(error);}
 );
};
function createAndSendAnswer() {
 webrtc.createAnswer(
   function (answer) {
     var ans = new RTCSessionDescription(answer);
     webrtc.setLocalDescription(ans, function() {
         hub.send(JSON.stringify({"sdp": ans }));
       },
       function (error) { console.log(error);}
     );
   },
   function (error) {console.log(error);}
 );
};
function onIceCandidateHandler(evt) {
 if (!evt || !evt.candidate) return;
 hub.send(JSON.stringify({"candidate": evt.candidate }));
};
function onAddStreamHandler(evt) {
 callButton.setAttribute("disabled", true);
 closeButton.removeAttribute("disabled");
 // set remote video stream as source for remote video HTML5 element
 remoteVideo.src = URL.createObjectURL(evt.stream);
};
function endCall() {
 webrtc.close();
 webrtc = null;
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

function stacksize() {
  console.log(new Error().stack);
}

callButton.addEventListener('click', initiateCall);
//callButton.addEventListener('click', callAction);
closeButton.addEventListener('click', endCall);
      //Creates a video player
    /*  const Player = require('./player.js')
      const you = new Player({ x: 0, y : 0 ,color : 'black',left : 0,top : 0})
      you.addStream(mediaStream)

      const players = {}
      swarm.on('connect', function (peer, id) {
        if (!players[id]) {
          players[id] = new Player({
              x : 300,
              y : 0,
              left : 200,
              top : 0,
              color : 'red'
          })
          peer.on('data', function (data) {
            data = JSON.parse(data.toString())
            players[id].update(data)
          })
          players[id].addStream(peer.stream)
        }
      })
      //On webRTC Disconnets
      swarm.on('disconnect', function (peer, id) {
        if (players[id]) {
          players[id].element.parentNode.removeChild(players[id].element)
          delete players[id]
        }
      })


      setInterval(function () {
          console.log("Interval Call");
        you.update()

        const youString = JSON.stringify(you)
        swarm.peers.forEach(function (peer) {
          peer.send(youString)
        })
      }, 100)
    })
  });*/
