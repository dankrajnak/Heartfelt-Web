const wav = require('wav');
const ss = require('socket.io-stream');
import MessageService from '../services/getMessages';

class StreamRecieve{
  constructor(httpServer){
    const messageService = new MessageService();

    const io = require('socket.io')(httpServer);
    let clients = [];

    io.on('connection',(socket)=>{
      console.log('Binary Connection');

      socket.on('startAudio', (from, msg)=>{
        console.log('startAudio');
        console.log('from', socket.id);
        clients.push(socket);
      })

      ss(socket).on('audioMessage', (stream, meta) =>{
        console.log('stream');
        let deleteAudio = false;
        let filePath = `${Date.now()}.wav`;
        let writer = new wav.Writer({
          channels: 1,
          bitDepth: 16
        });

        messageService.stream(filePath, stream.pipe(writer)).then(()=>{
          if(deleteAudio)
          messageService.delete(filePath).then(()=>{
            console.log(filePath, 'deleted');
          })
        })

        socket.on('finishAudio', ()=>{
          writer.end();
          console.log('Wrote to file');
        });

        socket.on('deleteAudio', ()=>{
          console.log('marked for delete')
          deleteAudio = true;
        });

      });
    });

    io.on('disconnect', (something)=>{
      console.log('DISCONNECT');
      console.log(something);
    })
  }
}

export default StreamRecieve;
