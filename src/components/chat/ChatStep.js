import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage, sendStart } from '../../actions/messageActions';
import './ChatStep.css';
import {Button, Link} from 'cauldron-react'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import formUrl from '../../keys/formUrl';
import ChatInput from './ChatInput';
import Speech from 'speak-tts'
import { getSmiley } from './smileys/Smileys';
import { Range, Direction, getTrackBackground } from 'react-range';
import { FaRegFrown, FaRegAngry, FaRegMeh, FaRegSmile, FaRegLaughBeam, FaRegFrownOpen, FaRegGrinAlt, FaPlay, FaPause, FaVolumeUp  } from "react-icons/fa";

const STEP = 0.1;
const MIN = 0;
const MAX = 100;


class ChatStep extends Component {

 constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            userAgent: navigator.userAgent,
            user: this.props.user,
            message: this.props.msg.message,
            rating: "",
            freeText: "",
            kg:"",
            cm:"",
            grader:"",
            values: [50],
            valuesRange: [3],
            showPopupForm: false,
            chosenVals: [],
            submitted: false,
            playing: false,
            showFinalForm: true,
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
     /**
   * Plays back the message
   */
  speakNow = () => {

if (this.state.playing){

     this.setState({
        playing: false
        });
   this.speech.pause();

} else{


    this.setState({
        playing: true
        });


  this.speech = new Speech();
        
    this.speech.setLanguage("sv-SE");

     if (this.props.msg.buttons) {
      let custom = this.props.msg.buttons.map((msg, i) =>  { return msg.payload});
      let customButtons = custom.join(", eller, ");

      this.speech.speak({
        text: this.props.msg.message + " <> " + customButtons , 
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
      
    }  else if (this.props.msg.custom) {
        if (this.props.msg.custom.data) {

        let custom = this.props.msg.custom.data.map((msg, i) =>  { return msg.payload});
      let customButtons = custom.join(", ");

       this.speech.speak({
        text: this.props.msg.message + "<> Alternativen är: <><> " + customButtons, 
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

      else {
        this.speech.speak({
            text: this.props.msg.message, 
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

}

startCase = () => {      
        let sender = this.props.user;
        let receiver = 'bot';
        let message = "Hej";
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);

        this.setState({ showFinalForm: false, });



    };
closeFinalForm = () => {        
        this.setState({ showFinalForm: false, });
    };

    closePopupForm = () => {
        this.setState({ showPopupForm: false, submitted: false, rating: "", freeText: "", });
    };

    openPopupForm = () => {
        this.setState({ showPopupForm: true });
    };

    handleInputChange(event) {
            const target = event.target;
            const value = target.value;
            const name = target.name;

            this.setState({
                [name]: value
            });
    }

     handleChange(event) {
        this.setState({values: [event.target.value]});
    }

     handleNumberChange(index, e) {
         const target = e.target;
         const value = target.value;
         const name = target.name;

            if (name === "°C"){
                  this.setState({
                        grader: value + name
                });
            } else {
            this.setState({
                [name]: value + name
            });
            }
     
    }


    sendNumberInput(){
        if (this.state.kg || this.state.cm || this.state.grader){
            let sender = this.props.user;
            let receiver = 'bot';
            let message;
            if (this.state.grader){
                message = this.state.grader;
            } else{
                message = this.state.kg + ' ' + this.state.cm;
            }
            const rasaMsg = { sender, receiver, message };
            this.props.sendMessage(rasaMsg);
        }
       
    }

    _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.sendNumberInput();
    }
  }


    handleOptionChange = changeEvent => {
        this.setState({
            rating: changeEvent.target.value
        });
    };


    handleSubmit(event) {
        event.preventDefault();

        let date = this.state.date;
        let userAgent = this.state.userAgent;
        let user = this.state.user;
        let message = this.state.message;
        let rating = this.state.rating;
        let freeText = this.state.freeText;
        let userMessage = this.props.messages.filter(msg => msg.id === this.props.msg.id - 1).map((msg) => msg.message);
    

        if (this.state.rating || this.state.freeText){

                axios({
                    method: 'get',
                    url: `${formUrl}?date=${encodeURIComponent(date)}&userAgent=${encodeURIComponent(userAgent)}&user=${encodeURIComponent(user)}&userMessage=${encodeURIComponent(userMessage)}&message=${encodeURIComponent(message)}&rating=${encodeURIComponent(rating)}&freeText=${encodeURIComponent(freeText)}`
                })

        this.setState({submitted: true})
        }

       
    }

    onToggle(index, e, button){

        if (this.props.msg.buttons){
            let newButtonItems = this.props.msg.buttons.slice();

            for(let [i, g] of this.props.msg.buttons.entries()) {
                g.checked = false;
            }

            newButtonItems[index].checked = !newButtonItems[index].checked

            this.setState({
                items: newButtonItems
            })

            this.sendValues(button.payload)

        } else if (this.props.msg.custom.data) {
            let newCustomItems = this.props.msg.custom.data.slice();
            newCustomItems[index].checked = !newCustomItems[index].checked

            this.setState({
                items: newCustomItems, 
            })
        }

        

      
    }

    sendRangeValues = (values) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = values;
        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);
    };
  
    sendFormValues = () => {
        const chosenVals = this.props.msg.custom.data.filter(item => item.checked);
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

    sendValues = (payload) => {
     const chosenVals = this.props.msg.buttons.filter(item => item.checked);
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

componentWillUnmount(){
    if (this.state.playing){
            this.speech.pause();
           
    }
    
}

    render() {

        return (
         <React.Fragment>

            {this.state.showPopupForm===true &&
            <Modal
                        show={true}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        backdrop='static'
                        onHide={this.closePopupForm}
                        enforceFocus={true}
                        dialogClassName="feedback-modal"
                        centered
                    >
                    <Modal.Header closeButton></Modal.Header>
                    {this.state.submitted
                    ? <Modal.Body> <div className="container-feedback"><h5> Tack för din feedback!</h5> </div> <button className="agreeBtn" variant="secondary" onClick={() => this.closePopupForm()}>Stäng</button></Modal.Body>
                    : <Modal.Body>
                    <form id="feedback-form" onSubmit={this.handleSubmit}>
                      <h4> Hur var din upplevelse?</h4>
                        <div className="container-feedback">

                            <div className="item">
                            <label htmlFor="1">
                            <input className="radio" type="radio" name="1" id="1" value="1" checked={this.state.rating === '1'} onChange={this.handleOptionChange}/>
                            <span><FaRegAngry/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="2">
                            <input className="radio" type="radio" name="2" id="2" value="2" checked={this.state.rating === '2'}  onChange={this.handleOptionChange}/>
                            <span><FaRegFrown/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="3">
                            <input className="radio" type="radio" name="3" id="3" value="3" checked={this.state.rating === '3'}  onChange={this.handleOptionChange}/>
                            <span><FaRegMeh/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="4">
                            <input className="radio" type="radio" name="4" id="4" value="4"  checked={this.state.rating === '4'}  onChange={this.handleOptionChange}/>
                            <span><FaRegSmile/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="5">
                            <input className="radio" type="radio" name="5" id="5" value="5" checked={this.state.rating === '5'} onChange={this.handleOptionChange}/>
                            <span><FaRegLaughBeam/></span>
                            </label>
                            </div>

                        </div>

                        <input className="textArea" type="text" placeholder="Skriv en kommentar.." name="freeText" value={this.state.freeText} onChange={this.handleInputChange}/>


                        <button className="agreeBtn" variant="secondary">Skicka</button>
                       

                    </form>
                    </Modal.Body>
                    
                }

                </Modal>
}
           {this.props.messages.map((msg, id) =>
                                    <React.Fragment key={id}>
                                      {msg.id === this.props.msg.id - 1 &&
                                       <div className="user-messages">
                                        <div className="user-msg">
                                            <div className="user-msg-text">
                                                <p aria-hidden="true" className="display-linebreak">{msg.message}</p>
                                            </div>
                                        </div>
                                        </div>
                                    }
                                    </React.Fragment>
                                )}

                <React.Fragment>
                   <div className="bot-messages">
                        <div className="bot-msg">
                        
                            <div className="bot-msg-text">
                                <h3 aria-label={this.props.msg.message}>{this.props.msg.message}</h3>
                                
                            </div>
                           

                        </div>
                        
                         
                          <Link aria-hidden="true" className="feedback-link" onClick={() => this.openPopupForm()}>Har du synpunkter?</Link>  
                           <button className="voiceOver" aria-label="Aktivera textuppläsning" onClick={() => this.speakNow()}>
                         {this.state.playing ? ( <FaPause/>) : (<FaVolumeUp/>)
                        
                         }
                         
                         </button> 
                    </div>    

                    <div className="msgCustom">
                        {this.props.msg.buttons &&
                            this.props.msg.buttons.map((button, id) =>
                                <React.Fragment key={id}>
                                        <button className="choice btn" onClick={this.onToggle.bind(this, id, button)} aria-checked={button.checked === true} checked={button.checked === true} name={button.payload} value={button.payload}>
                                            <div className="flexible-space">
                                                <div className="label"><span>{button.title}</span></div>
                                                <div className="detailed-label"></div>
                                            </div>
                                            {button.checked !== true && 
                                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M50.026 99.996c27.448 0 49.967-22.52 49.967-49.967 0-27.449-22.52-50.065-50.064-50.065C22.48-.036-.04 22.58-.04 50.03c0 27.448 22.616 49.967 50.065 49.967zm0-12.854a37 37 0 01-37.114-37.113c0-20.587 16.527-37.21 37.017-37.21 20.586 0 37.21 16.623 37.21 37.21.097 20.586-16.527 37.113-37.113 37.113z" fillRule="nonzero"></path></svg>
                                            }
                                            {button.checked === true && 
                                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M50.026 99.996c27.448 0 49.967-22.52 49.967-49.967 0-27.449-22.52-50.065-50.064-50.065C22.48-.036-.04 22.58-.04 50.03c0 27.448 22.616 49.967 50.065 49.967zm-5.22-26.192c-2.126 0-3.866-1.063-5.412-2.9L28.376 57.858c-1.063-1.353-1.546-2.61-1.546-4.06 0-2.899 2.416-5.315 5.412-5.315 1.643 0 2.996.773 4.253 2.223l8.215 9.955 18.267-28.995c1.256-2.03 2.802-3.093 4.735-3.093 2.9 0 5.51 2.223 5.51 5.123 0 1.256-.484 2.513-1.257 3.77L49.929 70.807c-1.257 1.836-3.093 2.996-5.123 2.996z" fillRule="nonzero"></path></svg>
                                            }
                                        </button>
                                    </React.Fragment>
                            )}
                        
                        {this.props.msg.custom && 
                            <React.Fragment>
                                {this.props.msg.custom.type === "multipleSelect" && 
                                <React.Fragment>
                                
                                {this.props.msg.custom.data.map((custom, id) =>
                                    <React.Fragment key={id}>
                                        <button className="choice" onClick={this.onToggle.bind(this, id)} role="radio" aria-checked={custom.checked === true} checked={custom.checked === true} name={custom.payload} value={custom.payload}>
                                            <div className="flexible-space">
                                                <div className="label">{custom.title}</div>
                                                <div className="detailed-label"></div>
                                            </div>
                                            {custom.checked !== true && 
                                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M50.026 99.996c27.448 0 49.967-22.52 49.967-49.967 0-27.449-22.52-50.065-50.064-50.065C22.48-.036-.04 22.58-.04 50.03c0 27.448 22.616 49.967 50.065 49.967zm0-12.854a37 37 0 01-37.114-37.113c0-20.587 16.527-37.21 37.017-37.21 20.586 0 37.21 16.623 37.21 37.21.097 20.586-16.527 37.113-37.113 37.113z" fillRule="nonzero"></path></svg>
                                            }
                                            {custom.checked === true && 
                                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M50.026 99.996c27.448 0 49.967-22.52 49.967-49.967 0-27.449-22.52-50.065-50.064-50.065C22.48-.036-.04 22.58-.04 50.03c0 27.448 22.616 49.967 50.065 49.967zm-5.22-26.192c-2.126 0-3.866-1.063-5.412-2.9L28.376 57.858c-1.063-1.353-1.546-2.61-1.546-4.06 0-2.899 2.416-5.315 5.412-5.315 1.643 0 2.996.773 4.253 2.223l8.215 9.955 18.267-28.995c1.256-2.03 2.802-3.093 4.735-3.093 2.9 0 5.51 2.223 5.51 5.123 0 1.256-.484 2.513-1.257 3.77L49.929 70.807c-1.257 1.836-3.093 2.996-5.123 2.996z" fillRule="nonzero"></path></svg>
                                            }
                                        </button>
                                        
                                        {custom.checked === true && custom.payload === "Annat" &&
                                         <React.Fragment>
                                            <div className="flexible-space"></div>
                                            <div className="padding-top inputContainer">
                                            <ChatInput  />
                                            </div>
                                        </React.Fragment>
                                            }
                                    </React.Fragment>
                                )}
                                <Button onClick={() => {this.sendFormValues()}} className="valSubmitBtn">Skicka</Button>
                                
                                </React.Fragment>
                                
                                }

                                {this.props.msg.custom.type === "reactRange" && 
                                <React.Fragment>
                                <div className="container-feedback">
                                 <div className="item">
                                 
                            <label htmlFor="1">
                            <input className="radio" type="radio" name="1" id="1" value="1" checked={this.state.rating === '1'} onChange={this.handleOptionChange}/>
                            <span><FaRegGrinAlt/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="2">
                            <input className="radio" type="radio" name="2" id="2" value="2" checked={this.state.rating === '2'}  onChange={this.handleOptionChange}/>
                            <span><FaRegSmile/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="3">
                            <input className="radio" type="radio" name="3" id="3" value="3" checked={this.state.rating === '3'}  onChange={this.handleOptionChange}/>
                            <span><FaRegMeh/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="4">
                            <input className="radio" type="radio" name="4" id="4" value="4"  checked={this.state.rating === '4'}  onChange={this.handleOptionChange}/>
                            <span><FaRegFrownOpen/></span>
                            </label>
                            </div>

                            <div className="item">
                            <label htmlFor="5">
                            <input className="radio" type="radio" name="5" id="5" value="5" checked={this.state.rating === '5'} onChange={this.handleOptionChange}/>
                            <span><FaRegFrown/></span>
                            </label>
                            </div></div>

                                <div
                                style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                                }}
                            >
                                <Range
                                values={this.state.valuesRange}
                                step="0.1"
                                min="0"
                                max="5"
                                onChange={valuesRange => this.setState({ valuesRange })}
                                renderTrack={({ props, children }) => (
                                    <div
                                    onMouseDown={props.onMouseDown}
                                    onTouchStart={props.onTouchStart}
                                    style={{
                                        ...props.style,
                                        height: '36px',
                                        display: 'flex',
                                        width: '100%'
                                    }}
                                    >
                                    <div
                                        ref={props.ref}
                                        style={{
                                        height: '5px',
                                        width: '100%',
                                        borderRadius: '4px',
                                        background: getTrackBackground({
                                            values: this.state.valuesRange,
                                            colors: ['#3c7aae', '#ffffff'],
                                            min: "0",
                                            max: "5"
                                        }),
                                        alignSelf: 'center'
                                        }}
                                    >
                                        {children}
                                    </div>
                                    </div>
                                )}
                                renderThumb={({ props, isDragged }) => (
                                    <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '42px',
                                        width: '42px',
                                        borderRadius: '4px',
                                        backgroundColor: '#FFF',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0px 2px 6px #AAA',
                                    }}
                                    >
                                    <div
                                        style={{
                                        height: '16px',
                                        width: '5px',
                                        backgroundColor: isDragged ? '#3c7aae' : '#CCC'
                                        }}
                                    />
                                    </div>
                                )}
                                />
                                <output style={{ marginTop: '60px' }} id="output">
                            
                                </output>
                            </div>
                            <Button onClick={() => {this.sendRangeValues(JSON.stringify(this.state.valuesRange[0]))}} className="valSubmitBtn">Skicka</Button>

                                </React.Fragment>
                                
                                }

                                {this.props.msg.custom.type === "reactRangeUp" && 
                                <React.Fragment>

                                    {getSmiley(this.state.values)}

 <Range
                                values={this.state.values}
                                step="1"
                                min="0"
                                max="100"
                                onChange={values => this.setState({ values })}
                                renderTrack={({ props, children }) => (
                                    <div
                                    onMouseDown={props.onMouseDown}
                                    onTouchStart={props.onTouchStart}
                                    style={{
                                        ...props.style,
                                        height: '36px',
                                        display: 'flex',
                                        width: '100%'
                                    }}
                                    >
                                    <div
                                        ref={props.ref}
                                        style={{
                                        height: '5px',
                                        width: '100%',
                                        marginTop: '100px',
                                        borderRadius: '4px',
                                        background: getTrackBackground({
                                            values: this.state.values,
                                            colors: ['#3c7aae', '#ffffff'],
                                            min: "0",
                                            max: "100"
                                        }),
                                        alignSelf: 'center'
                                        }}
                                    >
                                        {children}
                                    </div>
                                    </div>
                                )}
                                renderThumb={({ props, isDragged }) => (
                                    <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '42px',
                                        width: '42px',
                                        borderRadius: '4px',
                                        backgroundColor: '#FFF',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0px 2px 6px #AAA',
                                    }}
                                    >
                                     <div
                                        style={{
                                        position: 'absolute',
                                        top: '-28px',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                        padding: '3px',
                                        borderRadius: '4px',
                                        backgroundColor: '#548BF4'
                                        }}
                                    >
                                        <input size="3" style={{  backgroundColor: 'transparent',  border: '0',
                                        color: 'white',
                                        fontWeight: 'bold', marginRight: '-5px'}} value={this.state.values} onChange={this.handleChange}/>
                                    </div>
                                    <div
                                        style={{
                                        height: '16px',
                                        width: '5px',
                                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                                        }}
                                    />
                                    </div>
                                   
                                )}
                                />
                                <output style={{ margin: '60px 0 30px 0 ', width: '100%' }} id="output">
                                <div style={{ float: 'left' }}>Värsta tänkbara smärta</div><div style={{ float: 'right' }}>Ingen smärta</div>
                                </output>    
                               
                                <Button onClick={() => {this.sendRangeValues(this.state.values[0].toFixed(1))}} className="valSubmitBtn">Skicka</Button>
                                </React.Fragment>
                                
                                }
                                 {this.props.msg.custom.type === "numberInput" && 

                                 <React.Fragment>
                                 <div className="inputSearchContainer">
                                 {this.props.msg.custom.units.map((unit, id) => 
                                 
                                 <React.Fragment>
    
                                    <input className="textArea search-input" onKeyDown={this._handleKeyDown} placeholder={unit.unit} key={unit.unit} value={this.state.numberValues} type="number" name={unit.unit} id={unit.unit} min={0} max={200} autocomplete="off" onChange={this.handleNumberChange.bind(this, id)} />
                                    <span className="unit">({unit.unit})</span>
                                    
                                    </React.Fragment>

                                 )}
                                    </div> 
                                 <Button onClick={() => {this.sendNumberInput()}} className="valSubmitBtn top-margin">Skicka</Button>
                    
                                </React.Fragment>

                                 }

                                {this.props.msg.custom.type === "finalPage" && 

                                   <Modal show={this.state.showFinalForm}
                                        size="lg"
                                        backdrop='static'
                                        onHide={this.closeFinalForm}
                                        enforceFocus={true}
                                        dialogClassName="feedback-modal"
                                        centered>
                                        <Modal.Header closeButton></Modal.Header>
                                        
                                        <div className="container">
                                        
                                        <h2 role="alertdialog">Tack för dina svar!</h2>
                                          {this.props.msg.custom.data.map((custom, id) =>

                                    <React.Fragment key={id}>
                                            <span>{custom.title}</span>
                                            <span><strong>{custom.answer}</strong></span>



                                    </React.Fragment>
                                          
                                          )}
                                           
            <Button className="agreeBtn" onClick={()=>this.startCase()} variant="primary">Starta nytt ärende</Button>
</div>
                                    </Modal>
                                
                                }




                               
                            </React.Fragment>
                            }

                             </div>
                       </React.Fragment>

                       { ((!this.props.msg.custom) && (!this.props.msg.buttons)) &&
                       <React.Fragment>
                        <div className="flexible-space"></div>
                        <div className="inputContainer">
                        <ChatInput  />
                        </div>
                       </React.Fragment>
                       }
                       
        </React.Fragment>
        );
    }
}

ChatStep.propTypes = {
    messages: PropTypes.array.isRequired,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func
};


const mapStateToProps = state => ({
    user: state.sessionID.sessionID,
    messages: state.messages.messages,
    loading: state.messages.loading
})

export default connect(mapStateToProps, { sendMessage, sendStart })(ChatStep);