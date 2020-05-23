import React, { Component } from 'react';
import './Voice.css';
import {navigate} from "@reach/router"
import { sendMessage } from '../../actions/messageActions';
import { connect } from 'react-redux';
import VoiceInput from '../chat/VoiceInput';
import Speech from 'speak-tts'
import PulseLoader from 'react-spinners/PulseLoader';
import Modal from 'react-bootstrap/Modal';
import { FaMicrophone, FaMicrophoneSlash  } from "react-icons/fa";

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

  supportsMediaDevices = () => {
      return navigator.mediaDevices;
    }

  isIOS = () => {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    }


handlePause = () => {
   this.setState({
      playing: false
    });

    this.speech.cancel();
    
   
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
      let customButtons = custom.join(", eller, ");

      this.speech.speak({
        text: this.props.text + "<> Säg: <> " + customButtons , 
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
        text: this.props.text + "<> Alternativen är: <><> " + customButtons, 
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

  closePopupForm = () => {
      navigate(-1)
  }

  sendValues = (payload) => {
     const chosenVals = this.props.buttons.filter(item => item.checked);
        let messages = chosenVals.map((item, index) => {
            return (
                item.payload
            
            );
        })

        if (messages.length !== 0) {
            let sender = this.props.user;
            let receiver = 'bot';
            let message = messages.join(", ");
            const rasaMsg = { sender, receiver, message };
            this.props.sendMessage(rasaMsg);
        }
    };

  sendFormValues = () => {
    
        const chosenVals = this.props.custom.filter(item => item.checked);
        let messages = chosenVals.map((item, index) => {
            return (
                item.payload
            
            );
        })
         if (messages.length !== 0) {
          let sender = this.props.user;
          let receiver = 'bot';
          let message = messages.join(", ");
          const rasaMsg = { sender, receiver, message };
          this.props.sendMessage(rasaMsg);
         }
    };


    onToggle(index, e, button){

        if (this.props.buttons){
            let newButtonItems = this.props.buttons.slice();
            newButtonItems[index].checked = !newButtonItems[index].checked

            this.setState({
                items: newButtonItems
            })

            this.sendValues(button.payload)

        } else if (this.props.custom) {
            let newCustomItems = this.props.custom.slice();
            newCustomItems[index].checked = !newCustomItems[index].checked

            this.setState({
                items: newCustomItems, 
            })
        }

        

      
    }


    render() {

    
     
  let spinner;
    if (this.props.loading) {
      spinner = <PulseLoader css={spinnerCss} color={"#3875A8"} />;
    } else {
      spinner = null;
    }
    return (

      

        <Modal show={true}
                        size="lg"
                        backdrop='static'
                        onHide={this.closePopupForm}
                        enforceFocus={true}
                        dialogClassName="feedback-modal"
                        centered>

                        <Modal.Header closeButton></Modal.Header>

<React.Fragment>

  {this.props.loading && 

        <span className="alertLoadingPopup" role="alert" aria-busy="true">{spinner} Laddar</span>
         
        }

{this.state.showVoiceStart && !this.supportsMediaDevices() && 
<Modal onClick={() => this.closePopupForm()} 
                        show={true}
                        size="lg"
                        backdrop='static'
                        enforceFocus={true}
                        dialogClassName="feedback-modal"
                        centered
                    > 
                    
  <Modal.Body>

                      <div className="voiceButton" id="enableSound"><FaMicrophoneSlash /> </div>
                      <button className="activateMic">Din webbläsare stöds tyvärr inte.</button>

                    
                    </Modal.Body>
                    
                    </Modal>
}
{this.state.showVoiceStart && this.supportsMediaDevices() &&

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
                      <button className="activateMic">Klicka här för att aktivera mikrofonen.</button>

                    
                    </Modal.Body>
                    
                }

                </Modal>

}




     

    {!this.props.loading && 


<div className="container">
                    {this.props.text &&
                      <React.Fragment>

        
      
       <div className="bot-msg" onClick={() => this.handlePlay()}>
                            <div className="bot-msg-text">
                                <h1 aria-label={this.props.text}>{this.props.text}</h1>
                                
                            </div>
                        </div>

{!this.state.playing &&  !this.state.showVoiceStart &&
<div className="speech-control-buttons">
              {this.props.buttons && 
              <React.Fragment>       
              {this.props.buttons.map((msg, i) =>  

              <React.Fragment key={i}>
               <button role="radio" className="btn" onClick={this.onToggle.bind(this, i, msg)} aria-checked={msg.checked === true} checked={msg.checked === true} name={msg.payload} value={msg.payload}>

                 {msg.payload}

                 </button>


                                 </React.Fragment>   
                                
                                )}
                                </React.Fragment>       
              }

                  {this.props.custom && 
              <React.Fragment>       
              {this.props.custom.map((msg, i) =>   

               <React.Fragment key={i}>
                                        <button className="btn" onClick={this.onToggle.bind(this, i)} role="radio" aria-checked={msg.checked === true} checked={msg.checked === true} name={msg.payload} value={msg.payload}>

                                          {msg.payload}

                                        </button>
                                    </React.Fragment>
                                
                                )}
                                 <button role="radio" className="btn" aria-checked="true" onClick={() => {this.sendFormValues()}}>Nästa fråga</button>
                                </React.Fragment>       
              }

</div>

                    }

               
                      

                  </React.Fragment>           
                  }
          
          {!this.state.playing && !this.state.showVoiceStart &&
             <VoiceInput/>
             
          }
            {this.state.playing && !this.state.showVoiceStart &&
             <button  aria-label="Avbryt" className="speech-control-container" onClick={() => this.handlePause()}>
              <div className="speech-control">
              <FaMicrophone className="microphone-icon" />
          </div>

      </button>

          }
          
            
        
       
      </div>  }
            </React.Fragment>
              </Modal >
        )
    };
};


const mapStateToProps = (state) => {
  if (state.messages.messages[state.messages.messages.length-1] === undefined){
    return {
          messages: state.messages.messages,
          loading: state.messages.loading,
          user: state.sessionID.sessionID 
        }
  }
  if (state.messages.messages[state.messages.messages.length-1].custom){
    return {
        messages: state.messages.messages,
        loading: state.messages.loading,
        text: state.messages.messages[state.messages.messages.length-1].message,
        custom: state.messages.messages[state.messages.messages.length-1].custom.data,
        user: state.sessionID.sessionID 
    } 
  } else if (state.messages.messages[state.messages.messages.length-1].buttons){
      return {
        messages: state.messages.messages,
        loading: state.messages.loading,
        text: state.messages.messages[state.messages.messages.length-1].message,
        buttons: state.messages.messages[state.messages.messages.length-1].buttons,   
        user: state.sessionID.sessionID    
    }
  } else if (state.messages.messages[state.messages.messages.length-1].message){
    return {
        messages: state.messages.messages,
        loading: state.messages.loading,
        text: state.messages.messages[state.messages.messages.length-1].message,
        user: state.sessionID.sessionID 
    }
  }
  else {
    return {
      messages: state.messages.messages,
      loading: state.messages.loading,
      user: state.sessionID.sessionID 
    }
  }
  
}

export default connect(mapStateToProps, { sendMessage })(Voice);