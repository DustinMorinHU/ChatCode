console.log('renderer process 2');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app

console.log("REACT!")

var Button3 = document.getElementById('VidCall');
Button3.addEventListener('click', function(event) {
  let vid = new BrowserWindow({ width: 1280, height: 720 });
  vid.loadURL(url.format({
      pathname: path.join(__dirname, 'VidCall.html'),
      protocol: 'file:',
      slashes: true
    }));
  });

  var Button1 = document.getElementById('AudioCall');
  Button1.addEventListener('click', function(event) {
    let audio = new BrowserWindow({ width: 720, height: 420 });
    audio.loadURL(url.format({
        pathname: path.join(__dirname, 'AudioCall.html'),
        protocol: 'file:',
        slashes: true
      }));
    });





  // Or load a local HTML file
