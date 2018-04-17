import BinarySend from './BinarySend';
import Microphone from './Microphone';

console.log('HIII!!');
const bs = new BinarySend();
console.log('HEY.');
setInterval(()=>console.log('Check'), 1000)
const microphone = new Microphone(bs);

let recording = false;
const button = document.getElementById('record');

button.addEventListener('click', (e)=>{
  recording = !recording;
  if(recording){
    microphone.askForMicrophone().then(()=> {
      Microphone.countdown(5, (count)=>{
        button.innerHTML = count;
      }).then(()=>{
        button.innerHTML = 'Stop Recording';
        microphone.startRecording();
      })
    }).catch((error)=>{
      console.log(error);
    });
  }
  else{
    microphone.stopRecording();
    button.innerHTML = 'Thank you for your message!';
  }
});
