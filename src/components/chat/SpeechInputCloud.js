import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaMicrophone, FaCircle } from "react-icons/fa";
import CloudSpeechAPI from '../../helpers/SpeechApi';

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

const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
 
const recorder = new Recorder(audioContext, {
  // An array of 255 Numbers
  // You can use this to visualize the audio stream
  // If you use react, check out react-wave-stream

});

export default class SpeechInputCloud extends Component<
  SpeechInputProps,
  SpeechInputState
> {

constructor() {
    super();
    this.state = {
      audio: null,
      text: "",
      message: '',
      record: false,
      blob: null,
    };
    
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
}

  async getMicrophone() {

    await navigator.mediaDevices.getUserMedia({audio: true})
          .then(stream => recorder.init(stream))
          .catch(err => console.log('Uh oh... unable to get stream...', err));
      
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true
    })

    recorder.start()

    this.setState({ audio });
 
  }

  saveAudio() {

    recorder.stop()
    .then(({blob, buffer}) => {

    CloudSpeechAPI.sendRequest(blob, buffer, "sv-SE")
    .then((data: any) => {
    
            if (data && data['results']) {
              const finalTranscript = data['results'][0].alternatives[0].transcript;

              this.props.onSpeechInput(finalTranscript);
              this.props.onSpeechEnd();
            }
            else {
              console.log("failed");
            }
          });

      })

 
  }


  stopMicrophone() {
 
     this.saveAudio();
    this.setState({ audio: null });
  }

  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();

    } else {
      this.getMicrophone();
    }
  }


    render() {


        return (
            <React.Fragment>


   
              <div className="controls">

                      <button onClick={this.toggleMicrophone}>
            {this.state.audio ? <FaCircle className="vertical-center" color="#ed4933" /> : <FaMicrophone className="vertical-center" />}
          </button>

        </div>



     

          
            </React.Fragment>
        )
};

}
