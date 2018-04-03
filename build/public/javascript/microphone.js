"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Requires that recorder.min.js is downloaded also.  I can find a way to bundle them later.

var Microphone = function () {
  function Microphone() {
    _classCallCheck(this, Microphone);

    if (!navigator.getUserMedia) navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.audioInput = null;
    this.recorder = null;
  }

  _createClass(Microphone, [{
    key: "startRecording",
    value: function startRecording() {
      var _this = this;

      navigator.getUserMedia({
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        }
      }, function (stream) {
        _this._gotStream(stream);
      }, function (e) {
        alert('Error getting audio');
        console.log(e);
      });
    }
  }, {
    key: "_gotStream",
    value: function _gotStream(stream) {
      console.log("Hey", this.audioContext);
      var inputPoint = this.audioContext.createGain();

      // Create an AudioNode from the stream.
      var realAudioInput = this.audioContext.createMediaStreamSource(stream);
      this.audioInput = realAudioInput;
      this.audioInput.connect(inputPoint);

      //    audioInput = convertToMono( input );

      var analyserNode = this.audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      inputPoint.connect(analyserNode);

      this.recorder = new Recorder(inputPoint);

      var zeroGain = this.audioContext.createGain();
      zeroGain.gain.value = 0.0;
      inputPoint.connect(zeroGain);
      zeroGain.connect(this.audioContext.destination);
      // updateAnalysers();
    }
  }]);

  return Microphone;
}();