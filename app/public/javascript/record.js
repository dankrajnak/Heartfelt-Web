import BinarySend from './BinarySend';
import Microphone from './Microphone';

const bs = new BinarySend();
const microphone = new Microphone(bs);

let recorded = false;
let recording = false;
const button = document.getElementById('record');
const cancel = document.getElementById('cancel');

button.addEventListener('click', (e)=>{
  if(!recorded && !recording){
    microphone.askForMicrophone().then(()=> {
      Microphone.countdown(5, (count)=>{
        button.innerHTML = count;
      }).then(()=>{
        recording = true;
        button.innerHTML = 'Submit';
        cancel.style.display = "inline-block";
        microphone.startRecording();
      })
    }).catch((error)=>{
      console.log(error);
    });
  }
  else{
    microphone.stopRecording(true);
    button.innerHTML = 'Thank you for your message!';
    cancel.style.display = "none";
    recorded = true;
  }
});

cancel.addEventListener('click', (e)=>{
  console.log('event!');
  microphone.stopRecording(false);
  cancel.style.display = "none";
  button.innerHTML = 'Record';
  recording = false;
})
