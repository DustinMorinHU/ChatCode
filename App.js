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

const callButton = document.getElementById('callButton');
callButton.addEventListener('click', function(event){
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (mediaStream) {
      //This is used for Signaling the Peer
      const signalhub = require('signalhub')
      const createSwarm = require('webrtc-swarm')
      //Creates the Signal rub running in the mentioned port
      const hub = signalhub('ChatCode', [
        'http://localhost:8080'
      ])
      const swarm = createSwarm(hub, {
        stream: mediaStream
      })
      //Creates a video player
      const Player = require('./player.js')
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
  });
