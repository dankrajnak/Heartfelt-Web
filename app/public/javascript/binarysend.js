const io = require('socket.io-client');
const ss = require('socket.io-stream');
const Readable = require('stream').Readable;

export default class BinarySend{

  constructor(){
    this.sending = false;
    this.socket = io.connect('heartfelt-installation.azurewebsites.net');
    this.stream = ss.createStream({objectMode: true});
    this.audioStream = new Readable({objectMode: true});
    this.buffer = [];

    this._bufferLeft = 0;
    // OK.  So, this may be a reaaally dumb way to do this, but uhh, it's late,
    // and I need this to work. The basic problem is that sometimes when _read
    // is called, the buffer is empty, but there is still data to send.  It's
    // just being generated slower than it's being sent.  So, we just set a timeout
    // if we're still sending stuff and wait until the buffer fills up a bit more.
    this.audioStream._read = (size = 'does not matter')=>{
      if(this.sending || this.buffer.length > 0){
        if(this.buffer.length>0){
          this.audioStream.push(this.buffer.pop())
        } else{
          setTimeout(()=>this.audioStream._read(), 0)
        }
      }
    }
  }

  send(data){
    this.buffer.unshift(data);
    if(!this.sending){
      this.sending = true;
      this.socket.emit('startAudio');
      ss(this.socket).emit('audioMessage', this.stream);
      this.audioStream.pipe(this.stream);
    }
  }

  /**
   * Sends all the data left on the buffer and closes the stream.
   * @param  {bool} save If false, the file will be deleted immediately after it's saved.
   * @return {Promise}   Resolves when all the data has been sent.
   */
  close(save){
    // Stop the stream and delete the file.
    return new Promise((resolve, reject)=>{
      this.sending = false;
      if(!save){
        this.buffer.length = 0;
        this.socket.emit('deleteAudio');
        this.socket.emit('finishAudio');
        this.stream.end();
        resolve();
      } else{
        // Not sure if this is necessary
        // this.buffer.unshift(null);

        //Used in getPercentageLeft()
        this._bufferLeft = this.buffer.length;

        this.flush().then(()=>{
          this.socket.emit('finishAudio');
          this.stream.end();
          resolve();
        })
      }
    })
  }

  /**
   * This doesn't operate like a normal flush.  This will only resolve when
   * this.close() has been called and this.sending is false.  Because (and I know
   * at this point I might be tying this too tightly to the Microphone class)
   * the buffer is often 0, and it's not possible to listen for when all the audio
   * has been processed, this is what makes sense.
   * @return {Promise} A promise that will resovle when _checkIfFinished() is true.
   */
  flush(){
    return new Promise((resolve, reject)=>{
      let interval = setInterval(()=>{
        if(this._checkIfFinished()){
          clearInterval(interval);
          resolve();
        }
      }, 10);
    })
  }

  getPercentageProgress(){
    if(this.sending){
      return 0;
    } else{
      return Math.round(100*(1-this.buffer.length/this._bufferLeft));
    }
  }

  _checkIfFinished(){
    return this.buffer.length == 0 && !this.sending;
  }
}
