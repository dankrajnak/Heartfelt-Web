class BinarySend{

  constructor(){
    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket.binaryType = 'arraybuffer'
    this.open = false;
    this.stream = null;
    this.client = new BinaryClient('ws://heartfelt-installation.azurewebsites:9001');

    this.client.on('open', ()=>{
      this.open = true;
    })
  }

  send(data){
    if(!this.stream && this.open){
      this.stream = this.client.createStream();
    }
    this.stream.write(data);
  }

  close(){
    this.open = false;
    this.stream.end();
  }
}
