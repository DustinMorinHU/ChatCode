console.log('renderer process 2');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app

const constraints = window.constraints = {
  audio: false,
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    framerate: { max: 30 },
    aspectRatio: 2.1
  }
};


console.log("REACT!");
const Button3 = document.getElementById("VidCall");
//const mediaStream = navigator.mediaDevices.getUserMedia(constraints);
Button3.addEventListener("click",
function handleSuccess(mediaStream) {
  //const videoTracks = mediaStream.getVideoTracks();
  const video = document.querySelector("video");
  console.log('Got stream with constraints:', constraints);
  //console.log(`Using video device: ${video.label}`);
 // make variable available to browser console
 navigator.mediaDevices.getUserMedia(constraints)
 .then(function(mediaStream) {
   const video = document.querySelector('video');
   video.srcObject = mediaStream;
   video.onloadedmetadata = function(e) {
     video.play();
   }
 });
});

function handleError(error) {
  if (error.name === "ConstraintNotSatisfiedError") {
    let v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === "PermissionDeniedError") {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.')
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector("#errorMsg");
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
};



  /*var Button1 = document.getElementById('AudioCall');
  Button1.addEventListener('click', function(event) {
    let audio = new BrowserWindow({ width: 720, height: 420 });
    audio.loadURL(url.format({
        pathname: path.join(__dirname, 'AudioCall.html'),
        protocol: 'file:',
        slashes: true
      }));
    });
*/




  // Or load a local HTML file
