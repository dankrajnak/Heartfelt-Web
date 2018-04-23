export default class Microphone {
  /**
   * Record audio using AudioContext.  Chunks of audio will be passed into
   * the provided processAudio function.  Audio will be passed into processAudio
   * as an Int16Array.
   * @param {function} processAudio a function which takes in the audio as a Int16Array
   */
  constructor(processAudio) {
    this.recording = false;
    this.stream = null;
    this.recorder = null;
    this.intervalKey = null;
    this.microphoneStream = null;
    this.processAudio = processAudio;
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
        this.microphoneStream = stream;
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

    // Create a scriptProcessorNode, which takes in buffered audio, processes it
    // and then sends it to an output buffer.  In this case, we won't send any
    // audio to the output buffer.  We will convert the buffer to 16bit integers
    // and send it through the sender.
    this.recorder = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.recorder.onaudioprocess = (audio) => {
      let left = audio.inputBuffer.getChannelData(0);
      this.processAudio(Microphone.convertFloat32ToInt16(left));

    }
  }

  startRecording() {
    this.recording = true;
    this.audioInput.connect(this.recorder)
    this.recorder.connect(this.audioContext.destination);
  }

  /**
   * Stop recording and free up resources.
   * @return {Promise}      resolves after microphone is successfully closed.
   */
  stopRecording() {
    this.recording = false;
    this.microphoneStream.getTracks().forEach((track)=>track.stop());
    // This is a little hacky, but there's a bit of a delay because
    // the audio has to be processed.  From what I researched, there is
    // no event that we can listen to for when all the audio has been passed
    // through the recorder script processor.  So, we'll wait about half a second
    // and then close everything.
    return new Promise((res, rej)=>{
      setTimeout(()=>{
        this.audioInput.disconnect();
        this.audioContext.close();

        this.recorder.disconnect();
        res();
      }, 500);
    })
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
