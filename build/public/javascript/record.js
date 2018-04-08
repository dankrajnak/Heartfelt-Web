'use strict';

var bs = new BinarySend();

var microphone = new Microphone(bs);

var recording = false;
var button = document.getElementById('record');

button.addEventListener('click', function (e) {
  recording = !recording;
  if (recording) {
    microphone.askForMicrophone().then(function () {
      Microphone.countdown(5, function (count) {
        button.innerHTML = count;
      }).then(function () {
        button.innerHTML = 'Stop Recording';
        microphone.startRecording();
      });
    }).catch(function (error) {
      console.log(error);
    });
  } else {
    microphone.stopRecording();
    button.innerHTML = 'Thank you for your message!';
  }
});