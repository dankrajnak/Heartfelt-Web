const io = require('socket.io-client');
const ss = require('socket.io-stream');
const Readable = require('stream').Readable;

export default class BinarySend{

  constructor(){
    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket.binaryType = 'arraybuffer'
    this.sending = false;
    this.socket = io.connect('localhost:8080');
    this.stream = ss.createStream({objectMode: true});
    this.audioStream = new Readable({objectMode: true});
    this.buffer = [];
    // OK.  So, this may be a reaaally dumb way to do this, but uhh, it's late,
    // and I need this to work. The basic problem is that each time _read is called,
    // it needs to push something into the stream.  Sometimes the audio isn't sampled
    // fast enough and the buffer is empty.  So, if it's empty, we'll just wait a little bit.
    this.audioStream._read = (size = 'does not matter')=>{
      if(this.sending || this.buffer.length > 0){
        console.log(this.buffer.length);
        if(this.buffer.length>0){
          setTimeout(()=>this.audioStream.push(this.buffer.pop()), 10);
        } else{
          setTimeout(()=>this.audioStream._read(), 10)
        }
      }
    }
  }

  send(data){
    this.buffer.unshift(data);
    if(!this.sending){
      this.sending = true;
      ss(this.socket).emit('audioMessage', this.stream);
      this.audioStream.pipe(this.stream);
    }
  }

  close(){
    this.sending = false;
    console.log('CLOSED');
    this.buffer.unshift(null);
    this.stream.end();
    console.log('END')
  }
}
