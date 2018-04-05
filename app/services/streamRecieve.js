const wav = require('wav');
const BinaryServer = require('binaryjs').BinaryServer;

class StreamRecieve{
  constructor(port, callback){
    this.server = BinaryServer({port: port});

    this.server.on('connection',(client)=>{
      console.log('Binary Connection');


      client.on('stream', (stream, meta) =>{
        console.log('stream');
        let filePath = `./messages/${Date.now()}.wav`;
        let fileWriter = new wav.FileWriter(filePath, {
          channels: 1,
          bitDepth: 16
        });
        stream.pipe(fileWriter);

        stream.on('end', ()=>{
          fileWriter.end();
          console.log('Wrote to file');
          callback(filePath);
        });
      });
    });
  }
}

export default StreamRecieve;
