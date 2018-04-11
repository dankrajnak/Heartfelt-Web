const wav = require('wav');
const ss = require('socket.io-stream');


class StreamRecieve{
  constructor(httpServer, callback){
    const io = require('socket.io')(httpServer);

    io.on('connection',(socket)=>{
      console.log('Binary Connection');

      let fileWriter;
      ss(socket).on('audioMessage', (stream, meta) =>{
        console.log('stream');
        let filePath = `./messages/${Date.now()}.wav`;
        fileWriter = new wav.FileWriter(filePath, {
          channels: 1,
          bitDepth: 16
        });

        stream.pipe(fileWriter);
        // stream.pipe(process.stdout);

        stream.on('finish', ()=>{
          fileWriter.end();
          console.log('Wrote to file');
          // callback(filePath);
        });
      });
      //
      // ss(socket).on('end', (stream, meta)=>{
      //   fileWriter.end();
      //   console.log('Wrote to file');
      //   callback(filePath);
      // })
    });
  }
}

export default StreamRecieve;
