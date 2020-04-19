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
import {navigate} from "@reach/router"
import { getSmiley } from './smileys/Smileys';
import { Range, getTrackBackground } from 'react-range';
import { FaRegFrown, FaRegAngry, FaRegMeh, FaRegSmile, FaRegLaughBeam, FaRegFrownOpen, FaRegGrinAlt, FaPause, FaVolumeUp  } from "react-icons/fa";
import { AiOutlineMinusCircle, AiOutlinePlusCircle  } from "react-icons/ai";



class ChatStep extends Component {

 constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            userAgent: navigator.userAgent,
            user: this.props.user,
            message: this.props.msg.message,
            rating: "",
            option: "",
            freeText: "",
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
       // this.handleSubmit = this.handleSubmit.bind(this);

        if (this.props.msg.custom ){
            if (this.props.msg.custom.type === "numberInput" ){
            let data = this.props.msg.custom.units.map((unit, id) => {
                return (unit.unit);
             })

            let keys = this.props.msg.custom.units.map((unit, id) => {
                return unit.step.values;
            })

            var result = {};
                data.forEach((key, i) => 
                    [result[key]] = [[keys[i]]],
            );
            this.state = result;

            }
        }
       
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

    closeCase = () => {
        localStorage.removeItem("state");
        navigate('/')
        window.location.reload();
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

    handleRangeInputChange(values, index, e, state) {
        const name = e.unit;
        this.setState({[name]: [values]});

    }

    handleRangeChange(values, index, e, state) {
        const name = e.unit;
        this.setState({[name]: values});
        
    }

    incrementInput(id, unit) {
        this.setState({[unit.unit]: [+this.state[unit.unit] +1] });
    }

    decrementInput(id, unit) {
        this.setState({[unit.unit]: [+this.state[unit.unit] - 1 ]});
    }

    sendRangeChange(e){
        let sender = this.props.user;
        let receiver = 'bot';
        let message = JSON.stringify(e).replace(/[[\]"]+/g,"").replace(/[{()}]/g, '').replace(/:/g,'');;

        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);

    }


    handleOptionChange = changeEvent => {
        this.setState({
            option: changeEvent.target.value
        });
    };


 handleRatingChange = changeEvent => {
     console.log(changeEvent.target.value, "hej");
        this.setState({
            rating: changeEvent.target.value
        });
    };

    


    handleSubmit(event) {
        //event.preventDefault();

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
        console.log(this.state.option);
        if (this.state.option){
            let sender = this.props.user;
            let receiver = 'bot';
            let message = this.state.option;
            const rasaMsg = { sender, receiver, message };
            this.props.sendMessage(rasaMsg);
        } else {
            let sender = this.props.user;
            let receiver = 'bot';
            let message = values;
            const rasaMsg = { sender, receiver, message };
            this.props.sendMessage(rasaMsg);
        } 
        
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

  componentDidMount(){
        this.h1.focus();
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
                    ? <Modal.Body> <div className="container-feedback"><h1> Tack för din feedback!</h1> </div> <button className="agreeBtn" variant="secondary" onClick={() => this.closePopupForm()}>Stäng</button></Modal.Body>
                    : <Modal.Body>
                    <div id="feedback-form">
                      <h1> Hur var din upplevelse?</h1>
                        <div className="container-feedback">

                            <button  aria-label="Mycket dåligt" role="radio" className="item" aria-checked={this.state.rating === "1"} onClick={() => this.setState({rating: "1"})}>
                            <label htmlFor="1-rating">
                            <input className="radio" type="radio" name="1-rating" id="1-rating" value="1" checked={this.state.rating === '1'} onClick={this.handleRatingChange} onChange={this.handleRatingChange}/>
                            <span><FaRegAngry/><p>Mycket dåligt</p></span>
                            </label>
                            </button>

                            <button  aria-label="Dåligt" role="radio" className="item" aria-checked={this.state.rating === "2"} onClick={() => this.setState({rating: "2"})}>
                            <label htmlFor="2-rating">
                            <input className="radio" type="radio" name="2-rating" id="2-rating" value="2" checked={this.state.rating === '2'}  onChange={this.handleRatingChange}/>
                            <span><FaRegFrown/><p>Dåligt</p></span>
                            </label>
                            </button>

                            <button aria-label="Varken eller" role="radio" className="item" aria-checked={this.state.rating === "3"} onClick={() => this.setState({rating: "3"})}>
                            <label htmlFor="3-rating">
                            <input className="radio" type="radio" name="3-rating" id="3-rating" value="3" checked={this.state.rating === '3'}  onChange={this.handleRatingChange}/>
                            <span><FaRegMeh/><p>Varken eller</p></span>
                            </label>
                            </button>

                           <button aria-label="bra"  role="radio" className="item" aria-checked={this.state.rating === "4"} onClick={() => this.setState({rating: "4"})}>
                            <label htmlFor="4-rating">
                            <input className="radio" type="radio" name="4-rating" id="4-rating" value="4"  checked={this.state.rating === '4'}  onChange={this.handleRatingChange}/>
                            <span><FaRegSmile/><p>Bra</p></span>
                            </label>
                            </button>

                           <button aria-label="Mycket bra"  role="radio" className="item" aria-checked={this.state.rating === "5"} onClick={() => this.setState({rating: "5"})}>
                            <label htmlFor="5-rating">
                            <input className="radio" type="radio" name="5-rating" id="5-rating" value="5" checked={this.state.rating === '5'} onChange={this.handleRatingChange}/>
                            <span><FaRegLaughBeam/><p>Mycket bra</p></span>
                            </label>
                            </button>

                        </div>

                        <input aria-label="Skriv en kommentar" className="textArea" type="text" placeholder="Skriv en kommentar.." name="freeText" value={this.state.freeText} onChange={this.handleInputChange}/>


                        <button onClick={()=>this.handleSubmit()} className="agreeBtn" variant="secondary">Skicka</button>
                       

                    </div>
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
                                <h1 tabIndex="0" ref={(h1) => { this.h1 = h1}} aria-label={this.props.msg.message}>{this.props.msg.message}</h1>
                                
                            </div>
                           

                        </div>
                        
                         
                          <Link className="feedback-link" onClick={() => this.openPopupForm()}>Har du synpunkter?</Link>  
                           <button className="voiceOver" aria-label="Aktivera textuppläsning" onClick={() => this.speakNow()}>
                         {this.state.playing ? ( <FaPause/>) : (<FaVolumeUp/>)
                        
                         }
                         
                         </button> 
                    </div>    

                    <div className="msgCustom">
                        {this.props.msg.buttons &&
                            this.props.msg.buttons.map((button, id) =>
                                <React.Fragment key={id}>
                                        <button role="radio" className="choice btn" onClick={this.onToggle.bind(this, id, button)} aria-checked={button.checked === true} checked={button.checked === true} name={button.payload} value={button.payload}>
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
                                         {(id === this.props.msg.custom.data.length - 1) && (custom.payload === "Annat" && custom.checked !== true )  &&
                                             <Button onClick={() => {this.sendFormValues()}} className="valSubmitBtn">Nästa</Button>
                                        } 
                                         {(id === this.props.msg.custom.data.length - 1) && (custom.payload !== "Annat" )  &&
                                             <Button onClick={() => {this.sendFormValues()}} className="valSubmitBtn">Nästa</Button>
                                        }
                                    </React.Fragment>
                                )}
                                </React.Fragment>
                                
                                }

                                {this.props.msg.custom.type === "range5" && 
                                <React.Fragment>
                                  
                                <div className="container-feedback">
                            
                     
                            
                            <button aria-label="1" role="radio" className="item" aria-checked={this.state.option === "1"} onClick={() => this.setState({valuesRange: [0.2], option: "1" })}>
                                 
                                 
                            <label htmlFor="1">
                            <input className="radio" onClick={() => this.setState({valuesRange: [0.2]})} type="radio" name="1" id="1" value="1" checked={this.state.option === '1'} onChange={this.handleOptionChange}/>
                            <span><FaRegGrinAlt fill="#19C733"/></span>
                            </label>
                            </button>

                            <button aria-label="2" role="radio" className="item" aria-checked={this.state.option === "2"} onClick={() => this.setState({valuesRange: [1.4], option: "2" })}>
                            <label htmlFor="2">
                            <input  className="radio" onClick={() => this.setState({valuesRange: [1.4]})} type="radio" name="2" id="2" value="2" checked={this.state.option === '2'}  onChange={this.handleOptionChange}/>
                            <span><FaRegSmile fill="#7CC710"/></span>
                            </label>
                            </button>

                            <button aria-label="3" role="radio" className="item" aria-checked={this.state.option === "3"} onClick={() => this.setState({valuesRange: [2.5], option: "3" })}>
                            <label htmlFor="3">
                            <input  className="radio" onClick={() => this.setState({valuesRange: [2.5]})} type="radio" name="3" id="3" value="3" checked={this.state.option === '3'}  onChange={this.handleOptionChange}/>
                            <span><FaRegMeh  fill="#FFCB03"/></span>
                            </label>
                            </button>

                            <button  aria-label="4" role="radio" className="item" aria-checked={this.state.option === "4"} onClick={() => this.setState({valuesRange: [3.6], option: "4" })}>
                            <label htmlFor="4">
                            <input className="radio" onClick={() => this.setState({valuesRange: [3.6]})} type="radio" name="4" id="4" value="4"  checked={this.state.option === '4'}  onChange={this.handleOptionChange}/>
                            <span><FaRegFrownOpen fill="#FB6B13"/></span>
                            </label>
                            </button>

                           <button  aria-label="5" role="radio" className="item" aria-checked={this.state.option === "5"} onClick={() => this.setState({valuesRange: [4.8], option: "5" })}>
                            <label htmlFor="5">
                            <input className="radio" onClick={() => this.setState({valuesRange: [4.8]})} type="radio" name="5" id="5" value="5" checked={this.state.option === '5'} onChange={this.handleOptionChange}/>
                            <span><FaRegFrown fill="#F02A28"/></span>
                            </label>
                            </button></div>
                            <div className="container-feedback-number" aria-hidden="true">
                                    <p className="item">1</p>
                                    <p className="item">2</p>
                                    <p className="item">3</p>
                                    <p className="item">4</p>
                                    <p className="item">5</p>
                            </div>

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
                                            colors: ['#3875A8', '#ffffff'],
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
                                    <div aria-label="Ändra värde"
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
                                        backgroundColor: isDragged ? '#3875A8' : '#CCC'
                                        }}
                                    />
                                    </div>
                                )}
                                />
                                  <output style={{ margin: '10px 0 5px 0 ', width: '100%' }}>
                               
                                </output>  
                                 <output style={{ margin: '0px 0 60px 0 ', width: '100%' }} >
                                <div style={{ float: 'left' }}>{this.props.msg.custom.alt.firstItem}</div><div style={{ float: 'right' }}>{this.props.msg.custom.alt.lastItem}</div>

                                </output>  
                                
                            </div>
                                
                            <Button onClick={() => {this.sendRangeValues(JSON.stringify(this.state.valuesRange[0]))}} className="valSubmitBtn">Nästa</Button>

                                </React.Fragment>
                                
                                }

                                {this.props.msg.custom.type === "range100" && 
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
                                            colors: ['#3875A8', '#ffffff'],
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
                                    <div aria-label="Ändra värde"
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
                                        top: '-40px',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                        padding: '3px',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        boxShadow: "rgb(170, 170, 170) 0px 2px 6px"
                                        }}
                                    >
                                        <input size="3" aria-label="Ändra värde" style={{  backgroundColor: 'transparent',  border: '0',
                                        color: '#3875A8',
                                        fontWeight: 'bold', textAlign: "center"}} value={this.state.values} onChange={this.handleChange}/>
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
                                <output style={{ margin: '60px 0 30px 0 ', width: '100%' }}>
                                <div style={{ float: 'left' }}>{this.props.msg.custom.alt.firstItem}</div><div style={{ float: 'right' }}>{this.props.msg.custom.alt.lastItem}</div>
                                </output>    
                               
                                <Button onClick={() => {this.sendRangeValues(JSON.stringify(this.state.values[0]))}} className="valSubmitBtn">Nästa</Button>
                                </React.Fragment>
                                
                                }
                                 {this.props.msg.custom.type === "numberInput" && 

                                 <React.Fragment>

                                 <div className="inputRangeContainer">

                                 {this.props.msg.custom.units.map((unit, id) => 
                                 
                          <React.Fragment key={id}>
                          <div className="rangeTopContainer">
                            <button aria-label={"Minska värdet med 1. Aktuellt värde är:" + this.state[unit.unit]} className="rangeDecrement" onClick={() => {this.decrementInput(id, unit)}}> <AiOutlineMinusCircle/> </button>
                         
                            <input size="3" aria-label="Ändra värde" style={{
                                        color: '#3875A8', backgroundColor: "transparent", border: "0", borderBottom: "1px solid #ccc", height: "30px", width:"55px",
                                        fontWeight: 'bold', fontSize: "20px", textAlign: "center"}} value={this.state[unit.unit]} onChange={e => this.handleRangeInputChange(e.target.value, id, unit, this.state[unit.unit])}/>
                                        ({unit.unit})
                            <button aria-label={"Öka värdet med 1. Aktuellt värde är:" + this.state[unit.unit]} className="rangeIncrement" onClick={() => {this.incrementInput(id, unit)}} > <AiOutlinePlusCircle/></button>
                      </div>

                        <Range
                                values={this.state[unit.unit]}
                                step={unit.step.number}
                                min={parseInt(unit.range.firstItem)}
                                max={parseInt(unit.range.lastItem)}
                                onChange={values => this.handleRangeChange(values, id, unit)}
                                renderTrack={({ props, children }) => (
                                <div
                                    onMouseDown={props.onMouseDown}
                                    onTouchStart={props.onTouchStart}
                                    {...props}
                                    style={{
                                    ...props.style,
                                    height: '6px',
                                    width: '100%',
                                    display: 'flex',
                                    backgroundColor: '#3875A8'
                                    }}
                                >
                            {children}
                            
                                <div
                ref={props.ref}
                style={{
                  height: '6px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: this.state[unit.unit],
                    colors: ['#3875A8', '#ccc'],
                    min: parseInt(unit.range.firstItem),
                    max: parseInt(unit.range.lastItem)
                  }),
                  alignSelf: 'center'
                }}
              >
                                    
                                   </div>
                                </div>
                                )}
                                
                                renderThumb={({ props, isDragged }) => (
                                    <div aria-label="Ändra värde"
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
                                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                                        }}
                                    />
                                    </div>
                                   
                                )}
                                />
                                <output style={{ margin: '20px 0 60px 0 ', width: '100%' }}>
                                <div style={{ float: 'left' }}>{unit.range.firstItem}</div><div style={{ float: 'right' }}>{unit.range.lastItem}</div>
                                </output>    
                             
                    
                                </React.Fragment>

                                 )}
                                    </div> 
                                 <Button onClick={() => {this.sendRangeChange(this.state)}} className="valSubmitBtn">Nästa</Button>
                    
                                </React.Fragment>

                                 }

                                {this.props.msg.custom.type === "finalPage" && 

                                   <Modal show={this.state.showFinalForm}
                                        size="lg"
                                        backdrop='static'
                                        onHide={this.closeFinalForm}
                                        enforceFocus={true}
                                        dialogClassName="feedback-modal"
                                        role="main"
                                        centered>
                                        <Modal.Header></Modal.Header>
                                        
                                        <div className="container">
                                        
                                        <h1>Tack för dina svar!</h1>
                                          {this.props.msg.custom.data.map((custom, id) =>

                                    <React.Fragment key={id}>
                                            <span>{custom.title}</span>
                                            <span><strong>{custom.answer}</strong></span>



                                    </React.Fragment>
                                          
                                          )}
                                           
            <Button className="agreeBtn" onClick={()=>this.startCase()} variant="primary">Starta nytt ärende</Button>
             <Button className="agreeBtn" onClick={()=>this.closeCase()} variant="primary">Avsluta</Button>
</div>
                                    </Modal>
                                
                                }




                               
                            </React.Fragment>
                            }

                             </div>
                       </React.Fragment>

                       { ((!this.props.msg.custom)) &&
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