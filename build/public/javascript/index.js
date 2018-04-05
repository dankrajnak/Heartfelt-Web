'use strict';

var bs = new BinarySend();

var microphone = new Microphone(bs);

var recording = false;
document.getElementById('record').addEventListener('click', function (e) {
  recording = !recording;
  if (recording) {
    microphone.askForMicrophone().then(function () {
      return microphone.startRecording();
    }).catch(function (error) {
      console.log(error);
    });
  } else {
    microphone.stopRecording();
  }
});