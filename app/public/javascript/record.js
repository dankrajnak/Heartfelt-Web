import BinarySend from './BinarySend';
import Microphone from './Microphone';

const bs = new BinarySend();
const microphone = new Microphone((audio)=>bs.send(audio));

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
    recorded = true;
    button.innerHTML = "Uploading...";
    microphone.stopRecording().then(()=>{
      cancel.style.display = "none";
      let percentageUpdate = setInterval(()=>{
        button.innerHTML = bs.getPercentageProgress() + "%";
      }, 100)
      bs.close(true).then(()=>{
        button.innerHTML = 'Thank you for your message!';
        clearInterval(percentageUpdate);
      });
    });
  }
});

cancel.addEventListener('click', (e)=>{
  cancel.style.display = "none";
  button.innerHTML = 'Cancelling...';
  microphone.stopRecording().then(()=>{
    bs.close(false).then(()=>{
      button.innerHTML = 'Please reload the page';
      recording = false;
    });
  });
})
