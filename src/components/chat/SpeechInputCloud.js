import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaMicrophone, FaCircle } from "react-icons/fa";
import CloudSpeechAPI from '../../helpers/SpeechApi';
import Speech from 'speak-tts'

import Recorder from '../../helpers/Recorder';

type SpeechInputProps = {
  onSpeechInput: (message: string) => Promise<void>,
  onSpeechEnd: () => Promise<void>,
  language: string
};

type SpeechInputState = {
  isRecognizing: boolean,
  finalTranscript: string,
  interimTranscript: string
};

function supportsMediaDevices() {
  return navigator.mediaDevices;
}



export default class SpeechInputCloud extends Component<
  SpeechInputProps,
  SpeechInputState
> {

constructor() {
    super();
    this.state = {
      audio: null,
      text: "",
      stream: null,
      message: '',
      accept: true,
      record: false,
      blob: null,
      recording: false,
      recorder: null,
      audioContext: null,
    };
    
    this.toggleMicrophone = this.toggleMicrophone.bind(this);

    this.startRecord = this.startRecord.bind(this)
    this.stopRecord = this.stopRecord.bind(this)

}

    isIOS = () => {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    }

    startRecord = async () => {
     try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.setState({ stream });
        } catch (error) {
            this.setState({
                accept: false
            })
        }
        
        if (this.isIOS()) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.setState({ stream })
        }
        const { stream } = this.state;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const recorder = new Recorder(audioContext);
        recorder.init(stream)
            .then(
                this.setState(
                    {
                        audioContext,
                        recorder,
                        recording: true
                    },
                    () => {
                        recorder.start();
                          this.detectSilence(stream, audioContext, recorder, this.stopRecord, this.onSpeak, 3500);
                    }
                )
            ).catch(function(err) {
              console.log('Error: ' + err);
            });
    }


    stopRecord = () => {
      if (this.state.recording){
      if (this.isIOS()) {
            const { stream, audioContext } = this.state;
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
        }
        const { recorder } = this.state;
        this.setState({
            recording: false
        },
            () => {
                recorder.stop().then(({ blob, buffer }) => {
                    CloudSpeechAPI.sendRequest(blob, buffer, "sv-SE")
                    .then((data: any) => {
    
            if (data && data['results']) {
              const finalTranscript = data['results'][0].alternatives[0].transcript;

              this.props.onSpeechInput(finalTranscript);
              this.props.onSpeechEnd();
              if(document.getElementById("log")){
                  document.getElementById("log").innerHTML="";
              }
            }
            else {
             document.getElementById("log").innerHTML="Hoppsan! Ett fel uppstod. Försök igen.";
            }
          });
                })
            }
        );
}

    }

      detectSilence(stream, audioContext, recorder, onSoundEnd = _=>{}, onSoundStart = _=>{}, silence_delay = 3000) {

      if (this.state.recording){

        const analyser = audioContext.createAnalyser();
        const streamNode = audioContext.createMediaStreamSource(stream);
        streamNode.connect(analyser);

        analyser.minDecibels = -70;

        const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
        let silence_start = performance.now();
        let triggered = false; // trigger only once per silence event

        function loop(time) {
          requestAnimationFrame(loop); // we'll loop every 60th of a second to check
          analyser.getByteFrequencyData(data); // get current data
          if (data.some(v => v)) { // if there is data above the given db limit
            if(triggered){
                triggered = false;
              }

            silence_start = time; // set it to now
          }

          if (!triggered && time - silence_start > silence_delay) {
            onSoundEnd();
            triggered = true;
          }
        }
        loop();
      }
}

  toggleMicrophone() {
    if (this.state.recording) {
      this.stopRecord();

    } else {
      this.startRecord();
    }
  }
    

  componentDidMount(prevProps, prevState){
    if (supportsMediaDevices){
        this.startRecord();
    }
  }

  componentWillUnmount(prevProps, prevState){
    if (supportsMediaDevices){
        this.stopRecord();
    }
  }
    render() {

          return supportsMediaDevices() ? (  
          
          <React.Fragment>

              <div className="controls">

          <div onClick={this.toggleMicrophone}>
            {this.state.recording ? (
            
               <div class="speech-control-container listen">
              <div class="speech-control">
              <FaMicrophone className="microphone-icon" />
          </div>
          <div class="speech-control-pulse"></div>
          <svg x="0px" y="0px" class="speech-control-loader">
              <circle class="circle" stroke-width="10" r="101" />
          </svg>
          
      </div>
      

          ) :  (
             
                 <div class="speech-control-container ">
              <div class="speech-control">
              <FaMicrophone className="microphone-icon" />
          </div>
          <div class="speech-control-pulse"></div>
          <svg x="0px" y="0px" class="speech-control-loader">
              <circle class="circle" stroke-width="10" r="101" />
          </svg>
      </div>

             
          )}
          </div>

          <div id="log"></div>
        </div>

      </React.Fragment> ) : (  <React.Fragment> <span>Voice is not supported</span></React.Fragment>


)

};

}
