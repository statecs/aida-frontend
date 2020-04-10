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
                    }
                )
            );
    }


    stopRecord = () => {
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
            }
            else {
              console.log("failed");
            }
          });
                })
            }
        );
    }




  toggleMicrophone() {
    if (this.state.recording) {
      this.stopRecord();

    } else {
      this.startRecord();
    }
  }
    



    render() {

          return supportsMediaDevices() ? (  
          
          <React.Fragment>

              <div className="controls">

          <button onClick={this.toggleMicrophone}>
            {this.state.recording ? <FaCircle className="vertical-center recording" color="#ed4933" /> : <FaMicrophone className="vertical-center" />}
          </button>

        </div>

      </React.Fragment> ) : (  <React.Fragment> <span>Voice is not supported</span></React.Fragment>


)

};

}
