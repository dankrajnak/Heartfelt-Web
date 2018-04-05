const bs = new BinarySend();

const microphone = new Microphone(bs);

let recording = false;
document.getElementById('record').addEventListener('click', (e)=>{
  recording = !recording;
  if(recording){
    microphone.askForMicrophone().then(()=> microphone.startRecording()).catch((error)=>{
      console.log(error);
    });
  }
  else{
    microphone.stopRecording();
  }
})
