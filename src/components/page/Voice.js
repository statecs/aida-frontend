import React, { Component, useEffect } from 'react';
import './Voice.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VoiceInput from '../chat/VoiceInput';
import Speech from 'speak-tts'
import PulseLoader from 'react-spinners/PulseLoader';
import Modal from 'react-bootstrap/Modal';
import { FaMicrophone } from "react-icons/fa";

const spinnerCss = "display: table; margin: 20px auto;";

class Voice extends Component {

constructor() {
    super();
    this.state = {
      message: '',
      record: false,
      playing: false,
    };
    
    this.speech = new Speech();
}

  isIOS = () => {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    }


handlePause = () => {
    this.speech.cancel();
    
    this.setState({
      playing: false
    });
  };

handlePlay = () => {
  this.setState({
      playing: true
    });

    this.speakNow();
  
 
  };

   /**
   * Plays back the message
   */
  speakNow = () => {

    this.speech.setLanguage("sv-SE");

     if (this.props.buttons) {
      let custom = this.props.buttons.map((msg, i) =>  { return msg.payload});
      let customButtons = custom.join(", ");

      this.speech.speak({
        text: this.props.text + customButtons , 
         queue: false,
         listeners: {

            onend: () => {
                console.log("End utterance")
            },

    }
         
            }).then(() => {
            this.speech.cancel();
              this.setState({
            playing: false,
          });

      }).catch(e => {
          console.error("An error occurred :", e)
      })
      
    }  else if (this.props.custom) {
      let custom = this.props.custom.map((msg, i) =>  { return msg.payload});
      let customButtons = custom.join(", ");

       this.speech.speak({
        text: this.props.text + customButtons, 
         queue: false,
         listeners: {

            onend: () => {
                console.log("End utterance")
            },

    }
      }).then(() => {
        this.speech.cancel();
            this.setState({
            playing: false,
          });

      }).catch(e => {
          console.error("An error occurred :", e)
      })

    }

      else {
        this.speech.speak({
            text: this.props.text, 
            queue: false,
            listeners: {

              onend: () => {
                  console.log("End utterance")
              },

          }
        }).then(() => {
           this.speech.cancel();
              this.setState({
              playing: false,
            });
        }).catch(e => {
          console.error("An error occurred :", e)
        })

      }
      
    }

  
componentDidUpdate(prevProps, prevState){

  if (prevProps.loading){

    this.handlePlay();
    
      if (prevState.playing !== this.state.playing) {
          this.setState({
              playing: false
        });
    }
  
    } 
    
    const uA = navigator.userAgent;
    const vendor = navigator.vendor;
    if (/Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA)) {
      //Desktop Safari
      if (prevState.playing !== this.state.playing) {
              this.setState({
                  playing: false
            });
    }
}


}

componentDidMount (){

    if (this.isIOS()) {
      this.setState({ showVoiceStart: true});
    }
  
}

componentWillUnmount(){
    this.handlePause();
     this.setState({
          playing: false
       });
}


playSound(){
  
    this.setState({ showVoiceStart: false});

    this.speech.speak({
            queue: false,
        })

}


    render() {

      
     
  let spinner;
    if (this.props.loading) {
      spinner = <PulseLoader css={spinnerCss} color={"#2177D2"} />;
    } else {
      spinner = null;
    }
    return (

<React.Fragment>

{this.state.showVoiceStart &&

<Modal onClick={() => this.playSound()}
                        show={true}
                        size="lg"
                        backdrop='static'
                        enforceFocus={true}
                        dialogClassName="feedback-modal"
                        centered
                    >
               

                  <Modal.Body>

                      <div className="voiceButton" onClick={() => this.playSound()} id="enableSound"><FaMicrophone /> </div>
                      <span className="activateMic">Klicka här för att aktivera mikrofonen</span>

                    
                    </Modal.Body>
                    
                }

                </Modal>

}



  {this.props.loading && 
        <span className="alertLoading" role="alert" aria-busy="true">{spinner} Laddar</span>
        }

    {!this.props.loading && 

<div className="container">

<div className="container top-margin">
                    {this.props.text &&
                      <React.Fragment>

        
       <div onClick={() => this.handlePlay()}>
                  <p className="voiceMsg">{this.props.text}</p>       

              {this.props.buttons && 
              <React.Fragment>       
              {this.props.buttons.map((msg, i) =>   
                                  <div key={i}>
                                  {msg.payload}
                                  </div>
                                
                                
                                )}
                                </React.Fragment>       
              }

                  {this.props.custom && 
              <React.Fragment>       
              {this.props.custom.map((msg, i) =>   
                                  <div key={i}>
                                  {msg.payload}
                                  </div>
                                
                                
                                )}
                                </React.Fragment>       
              }

                 

                              
                  </div>  
                      

                  </React.Fragment>           
                  }
          
          {!this.state.playing && !this.state.showVoiceStart &&
             <VoiceInput/>
          }
            
        
            </div>    
      </div>  }
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