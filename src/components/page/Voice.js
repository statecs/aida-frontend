import React, { Component, useEffect } from 'react';
import './Voice.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VoiceInput from '../chat/VoiceInput';
import Speech from 'speak-tts'

const speech = new Speech() // will throw an exception if not browser supported

speech.init({
   	'volume': 1,
        'lang': 'sv-SE',
        'rate': 1.1,
        'pitch': 1,
        'splitSentences': true,
})


class Voice extends Component {

constructor() {
    super();
    this.state = {
      message: ''
    };
    
    this.play = this.play.bind(this);
}

  play(text) {
    speech.speak({
        text: text,
    })

    if (this.props.buttons) {
            let custom = this.props.buttons.map((msg, i) =>  { return msg.payload});
            let customButtons = custom.join(", ");

            speech.speak({
              text: customButtons
            })
      }

    if (this.props.custom) {
          let custom = this.props.custom.map((msg, i) =>  { return msg.payload});
          let customButtons = custom.join(", ");

          speech.speak({
            text: customButtons
          })
      }
  }


    render() {

    if (this.props.loading === false){
      speech.resume();
      speech.speak({
        text: this.props.text
    })

    if (this.props.buttons) {
      let custom = this.props.buttons.map((msg, i) =>  { return msg.payload});
      let customButtons = custom.join(", ");

      speech.speak({
        text: customButtons
      })
    }

    if (this.props.custom) {
      let custom = this.props.custom.map((msg, i) =>  { return msg.payload});
      let customButtons = custom.join(", ");

      speech.speak({
        text: customButtons
      })
    }

    } else if (this.props.loading === true){
        speech.cancel();
    }
  
    return (
            <React.Fragment>
                <div className="container top-margin">
                    {this.props.text &&
                      <React.Fragment>
                      
                      <button
                        className="rs-play"
                        onClick={() => this.play(this.props.text)}
                      >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                      </svg>
                    </button>
                  <div>
                  <p className="voiceMsg">{this.props.text}</p>       

              {this.props.buttons && 
              <React.Fragment>       
              {this.props.buttons.map((msg, i) =>   
                                  <div>
                                  {msg.payload}
                                  </div>
                                
                                
                                )}
                                </React.Fragment>       
              }

                  {this.props.custom && 
              <React.Fragment>       
              {this.props.custom.map((msg, i) =>   
                                  <div>
                                  {msg.payload}
                                  </div>
                                
                                
                                )}
                                </React.Fragment>       
              }

                 

                              
                  </div>  
                      

                  </React.Fragment>           
                  }
          
            <VoiceInput  />
        
            </div>
            </React.Fragment>
        )
    };
};


const mapStateToProps = (state) => {
  if (state.messages.messages[state.messages.messages.length-1] === undefined){
    return {
          messages: state.messages.messages,
          loading: state.messages.loading,
        }
  }
  if (state.messages.messages[state.messages.messages.length-1].custom){
    return {
        messages: state.messages.messages,
        loading: state.messages.loading,
        text: state.messages.messages[state.messages.messages.length-1].message,
        custom: state.messages.messages[state.messages.messages.length-1].custom.data,
    } 
  } else if (state.messages.messages[state.messages.messages.length-1].buttons){
      return {
        messages: state.messages.messages,
        loading: state.messages.loading,
        text: state.messages.messages[state.messages.messages.length-1].message,
        buttons: state.messages.messages[state.messages.messages.length-1].buttons,      
    }
  } else if (state.messages.messages[state.messages.messages.length-1].message){
    return {
        messages: state.messages.messages,
        loading: state.messages.loading,
        text: state.messages.messages[state.messages.messages.length-1].message,
    }
  }
  else {
    return {
      messages: state.messages.messages,
      loading: state.messages.loading,
    }
  }
  
}

export default connect(mapStateToProps)(Voice);