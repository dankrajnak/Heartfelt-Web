// Requires that recorder.min.js is downloaded also.  I can find a way to bundle them later.

class Microphone {

  constructor() {
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.audioInput = null;
    this.recorder = null;

  }

  startRecording() {
    navigator.getUserMedia({
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, (stream)=>{this._gotStream(stream)}, function(e) {
      alert('Error getting audio');
      console.log(e);
    });
  }

  _gotStream(stream) {
    console.log("Hey", this.audioContext);
    const inputPoint = this.audioContext.createGain();

    // Create an AudioNode from the stream.
    let realAudioInput = this.audioContext.createMediaStreamSource(stream);
    this.audioInput = realAudioInput;
    this.audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    const analyserNode = this.audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    this.recorder = new Recorder(inputPoint);

    const zeroGain = this.audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( this.audioContext.destination );
    // updateAnalysers();
  }
}
