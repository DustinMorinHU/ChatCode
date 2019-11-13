console.log('Main Application Render');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app

'use strict';

const videoConstraints = {
  audio: false,
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    framerate: { max: 30 },
    aspectRatio: 2.1
  }
};

const Button3 = document.getElementById("VidCall");

Button3.addEventListener('click', function(event) {

// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.
function handleSuccess(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
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

//Initializes media stream.
navigator.mediaDevices.getUserMedia(videoConstraints)
  .then(handleSuccess).catch(errorMsg);
})

const audioConstraints = window.constraints = {
  audio: true };

  const Button1 = document.getElementById('AudioCall');
  Button1.addEventListener('click', function (e) {

    const localAudio = document.querySelector('audio');
    let localSound;
    function handleAudioSuccess(mediaStream) {
      localSound = mediaStream;
      localAudio.srcObject = mediaStream;
    }
    console.log('Got stream with constraints:', audioConstraints);
    navigator.mediaDevices.getUserMedia(audioConstraints)
    .then(handleAudioSuccess);
  });
