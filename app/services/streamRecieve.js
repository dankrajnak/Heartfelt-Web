const wav = require('wav');
const ss = require('socket.io-stream');
import MessageService from '../services/getMessages';

class StreamRecieve{
  constructor(httpServer){
    const messageService = new MessageService();

    const io = require('socket.io')(httpServer);

    io.on('connection',(socket)=>{
      console.log('Binary Connection');


      ss(socket).on('audioMessage', (stream, meta) =>{
        console.log('stream');
        let filePath = `${Date.now()}.wav`;
        let writer = new wav.Writer({
          channels: 1,
          bitDepth: 16
        });

        messageService.stream(filePath, stream.pipe(writer))

        stream.on('finish', ()=>{
          writer.end();
          console.log('Wrote to file');
        });
      });
    });
  }
}

export default StreamRecieve;
