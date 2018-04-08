'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Requires that recorder.min.js is downloaded also.  I can find a way to bundle them later.

var Microphone = function () {
  function Microphone(sender) {
    _classCallCheck(this, Microphone);

    this.recording = false;
    this.stream = null;
    this.recorder = null;
    this.intervalKey = null;
    this.sender = sender;
  }

  /**
   * Asks user to use microphone and initializes audio stream
   * @return {[Promise]} Promise which resolves if user is cool with you recording and if the browser supports recording.
   */


  _createClass(Microphone, [{
    key: 'askForMicrophone',
    value: function askForMicrophone() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var constraints = {
          audio: true,
          video: false

          // Prefer to use navigator.mediaDevices.getUserMedia, but that isn't supported by older browsers.
        };if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }

        // Some browsers partiallly implement navigator.mediaDevices.
        if (navigator.mediaDevices.getUserMedia === undefined) {
          // If it's undefined, we'll wrap navigator.getUserMedia with a promise
          navigator.mediaDevices.getUserMedia = function (constraints) {
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            // Nothing we can do.
            if (!getUserMedia) {
              return reject(new Error('getUserMedia is not implemented in this browser'));
            }

            return new Promise(function (res, rej) {
              getUserMedia.call(navigator, constraints, res, rej);
            });
          };
        }

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          _this._initializeRecorder(stream);
          resolve('GOT STREAM');
        }).catch(function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: '_initializeRecorder',
    value: function _initializeRecorder(stream) {
      var _this2 = this;

      var AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.audioInput = this.audioContext.createMediaStreamSource(stream);
      var bufferSize = 2048;
      this.recorder = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

      this.recorder.onaudioprocess = function (audio) {
        var left = audio.inputBuffer.getChannelData(0);
        _this2.sender.send(Microphone.convertFloat32ToInt16(left));
      };
    }
  }, {
    key: 'startRecording',
    value: function startRecording() {
      this.recording = true;
      this.audioInput.connect(this.recorder);
      this.recorder.connect(this.audioContext.destination);
    }
  }, {
    key: 'stopRecording',
    value: function stopRecording() {
      this.recording = false;
      this.audioInput.disconnect();
      this.recorder.disconnect();
      this.sender.close();
    }
  }], [{
    key: 'convertFloat32ToInt16',
    value: function convertFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l);
      while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
      }
      return buf.buffer;
    }
  }, {
    key: 'countdown',
    value: function countdown(count, callback) {
      var promises = [];

      var _loop = function _loop(i) {
        promises.push(new Promise(function (resolve, reject) {
          setTimeout(function () {
            callback(i);
            resolve(i);
          }, (count - i) * 1000);
        }));
      };

      for (var i = count; i > 0; i--) {
        _loop(i);
      }
      // Wait for one more second without calling callback
      // (so that we stay at 1 for one second)
      promises.push(new Promise(function (resolve, reject) {
        setTimeout(function () {
          return resolve(1);
        }, count * 1000);
      }));
      return Promise.all(promises);
    }
  }]);

  return Microphone;
}();