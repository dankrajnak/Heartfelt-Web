'use strict';

var _BinarySend = require('./BinarySend');

var _BinarySend2 = _interopRequireDefault(_BinarySend);

var _Microphone = require('./Microphone');

var _Microphone2 = _interopRequireDefault(_Microphone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('HIII!!');
var bs = new _BinarySend2.default();
console.log('HEY.');

var microphone = new _Microphone2.default(bs);

var recording = false;
var button = document.getElementById('record');

button.addEventListener('click', function (e) {
  recording = !recording;
  if (recording) {
    microphone.askForMicrophone().then(function () {
      //   Microphone.countdown(5, (count)=>{
      //     button.innerHTML = count;
      //   }).then(()=>{
      button.innerHTML = 'Stop Recording';
      microphone.startRecording();
      //   })
    }).catch(function (error) {
      console.log('THERE WAS A FUCKING ERROR');
      console.log(error);
    });
  } else {
    microphone.stopRecording();
    button.innerHTML = 'Thank you for your message!';
  }
});