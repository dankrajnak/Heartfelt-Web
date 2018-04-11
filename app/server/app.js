import path from 'path';
import express from 'express';
import MessageService from '../services/getMessages';
import StreamRecieve from '../services/streamRecieve';


const app = express();
const server = require('http').Server(app);
const messageService = new MessageService();


let streamRecieve = new StreamRecieve(server);

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'))

//Get root
app.get('/', (req, res)=>{

    messageService.createContainer().then(() =>{
      messageService.list().then((lis) => {
        // Message names are stored as the number of miliseconds since January 1st, 1970
        // to when the message was created.  We can this to sort them based
        // on their creation time.
        lis.data.entries.forEach((entry)=>console.log(entry.name));
        lis.data.entries.sort((a, b)=>{
          return parseInt(b.name.slice(0, -4)) - parseInt(a.name.slice(0, -4));
        });
        let messages = lis.data.entries.map((entry, index)=> ({
            name: `Message ${lis.data.entries.length - index}`,
            link: messageService.getUri(entry.name).uri
          }));
        res.render('index', {messages: messages});
      });
    });
});

//Get record
app.get('/record', (req, res)=>{
  res.render('record');
})


export default server;
