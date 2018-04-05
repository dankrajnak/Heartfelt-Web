import path from 'path';
import express from 'express';
import MessageService from '../services/getMessages';
import StreamRecieve from '../services/streamRecieve';


const app = express();

const messageService = new MessageService();


let sendMessage = (filePath)=>{
  messageService.upload(filePath);
}

let streamRecieve = new StreamRecieve(9001, sendMessage);

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'))

//Get root
app.get('/', (req, res)=>{
    messageService.createContainer().then(() =>{
      messageService.list().then((lis) => {
        let messages = lis.data.entries.map((entry)=> ({
            name: entry.name,
            link: messageService.getUri(entry.name).uri
          }));
        res.render('index', {messages: messages});
      });
    });
});



export default app;
