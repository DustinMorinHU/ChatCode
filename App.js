console.log('renderer process 2');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app

console.log("REACT!")

var Button = document.getElementById('VidCall');
Button.addEventListener('click', function(event) {
  let vid = new BrowserWindow({ width: 720, height: 420, alwaysOnTop: true });
  vid.loadURL(url.format({
      pathname: path.join(__dirname, 'VidCall.html'),
      protocol: 'file:',
      slashes: true
    }));
  });

  var Button = document.getElementById('AudioCall');
  Button.addEventListener('click', function(event) {
    let audio = new BrowserWindow({ width: 720, height: 420 });
    vid.loadURL(url.format({
        pathname: path.join(__dirname, 'AudioCall.html'),
        protocol: 'file:',
        slashes: true
      }));
    });





  // Or load a local HTML file
