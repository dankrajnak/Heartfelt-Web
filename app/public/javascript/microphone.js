// Requires that recorder.min.js is downloaded also.  I can find a way to bundle them later.

export default class Microphone {

  constructor(sender) {
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
  askForMicrophone() {
    return new Promise((resolve, reject) => {
      const constraints = {
        audio: true,
        video: false
      }

      // Prefer to use navigator.mediaDevices.getUserMedia, but that isn't supported by older browsers.
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // Some browsers partiallly implement navigator.mediaDevices.
      if (navigator.mediaDevices.getUserMedia === undefined) {
        // If it's undefined, we'll wrap navigator.getUserMedia with a promise
        navigator.mediaDevices.getUserMedia = function(constraints) {
          let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

          // Nothing we can do.
          if (!getUserMedia) {
            return reject(new Error('getUserMedia is not implemented in this browser'));
          }

          return new Promise(function(res, rej) {
            getUserMedia.call(navigator, constraints, res, rej);
          });
        }
      }


      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this._initializeRecorder(stream);
        resolve('GOT STREAM');
      }).catch(error => {
        reject(error);
      });
    });
  }

  _initializeRecorder(stream) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.audioInput = this.audioContext.createMediaStreamSource(stream);
    let bufferSize = 2048;
    this.recorder = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.recorder.onaudioprocess = (audio) => {
      let left = audio.inputBuffer.getChannelData(0);
      this.sender.send(Microphone.convertFloat32ToInt16(left));
    }
  }

  startRecording() {
    this.recording = true;
    this.audioInput.connect(this.recorder)
    this.recorder.connect(this.audioContext.destination);
  }

  stopRecording() {
    this.recording = false;
    // this.audioInput.disconnect();
    // this.recorder.disconnect();
    this.sender.close();
  }

  static convertFloat32ToInt16(buffer) {
    let l = buffer.length;
    let buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
  }

  static countdown(count, callback) {
    let promises = [];
    for (let i = count; i > 0; i--) {
      promises.push(new Promise((resolve, reject) => {
        setTimeout(() => {
          callback(i);
          resolve(i);
        }, (count - i) * 1000);
      }));
    }
    // Wait for one more second without calling callback
    // (so that we stay at 1 for one second)
    promises.push(new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), count * 1000)
    }))
    return Promise.all(promises);
  }

}
