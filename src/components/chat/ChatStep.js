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
import { Range, getTrackBackground, Direction } from 'react-range';
import { FaRegFrown, FaRegAngry, FaRegMeh, FaRegSmile, FaRegLaughBeam, FaRegFrownOpen, FaRegGrinAlt, FaPause, FaVolumeUp  } from "react-icons/fa";
import { AiOutlineMinusCircle, AiOutlinePlusCircle  } from "react-icons/ai";
import SearchSelect from './customTypes/SearchSelect';



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
            selectedOption: '',
            freeText: "",
            values: [50],
            error: false,
            valuesRange: [2.5],
            showPopupForm: false,
            chosenVals: [],
            submitted: false,
            playing: false,
            showFinalForm: true,
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

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

    handleRangeInput100Change(e, index){
         const value = e.target.value;
        this.setState({values: [value]});
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

    decrement100Input () {
         this.setState({values: [+this.state.values - 1 ]});
    }

    increment100Input () {
         this.setState({values: [+this.state.values + 1 ]});
    }


    skipQuestion = () => {
                let receiver = this.state.receiver;
                let message = "Hoppa över frågan"
                let sender = this.props.user;
                const rasaMsg = { sender, receiver, message };
                //Send message to rasa and get chatbot response
                this.props.sendMessage(rasaMsg);
                this.setState({ message: '' });
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

         this.setState({ error: false });

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
         else{
            this.setState({ error: true });
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
                    {this.props.msg.buttons &&
                    <React.Fragment>
                                     <div className="skip-question">
                                <button onClick={() => this.skipQuestion()}>
                                    Hoppa över frågan
                                    </button>
                            </div>
                              </React.Fragment>
    }
                           
                           
                        
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


<svg viewBox="0 0 107 105" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="svg" stroke="#dadada" stroke-width="13">
            <path d="M93.0589557,13.3573974 C92.965734,13.287349 92.8451479,13.20399 92.7003089,13.1116818 C92.2126792,12.8009077 91.5717182,12.4658203 90.8430324,12.148795 C89.3472544,11.4980352 87.7127771,11.0257031 86.6000173,10.8849627 C85.5665233,10.7542476 84.7498978,10.7112451 83.7812813,10.7243768 C83.1342271,10.7331491 83.2794531,10.7268095 80.8472642,10.8440127 C79.6622297,10.9011175 78.7405145,10.9370109 77.6969207,10.9612939 C74.1615134,11.0435582 70.5160544,11.0351427 65.2750671,10.9630542 C64.7494173,10.955824 64.3085615,10.9471615 63.4766331,10.9289531 C61.0190616,10.8751642 60.0884753,10.8734154 59.0187295,10.9392173 C58.9870192,10.941184 58.9870192,10.941184 58.9554775,10.943205 C57.2692356,11.0521212 56.0432551,11.0521212 53.7028825,10.9946472 C52.7358569,10.9708993 52.3678265,10.964 51.9259302,10.964 C51.7892135,10.964 51.5671712,10.9654837 51.1978651,10.9688183 C51.137395,10.9693643 50.2622225,10.9776284 49.9528301,10.9803392 C47.0133568,11.0060933 44.5234805,11.0060933 41.8628436,10.9626683 C40.1701436,10.9350413 38.394609,10.933958 35.4426013,10.9505478 C34.9849617,10.9531643 34.9849617,10.9531643 34.5259189,10.9558812 C31.2894847,10.975047 29.9138118,10.9784763 28.2546153,10.963598 C27.2192245,10.9543134 26.247368,10.9386101 24.9178718,10.91214 C22.2210031,10.8584457 22.1686704,10.8575262 21.4840461,10.8569597 C21.2594355,10.8567738 21.0727809,10.8584222 20.9266198,10.8614 C11.6358274,12.9091514 10.2334504,17.824316 10.9392727,41.2391316 C10.9641312,42.063783 10.9798998,42.5940206 10.9958422,43.1466994 C11.0269863,44.2263796 11.0226306,45.0263162 10.9933356,46.7812488 C10.9669637,48.3610733 10.9649277,49.0333024 10.9930253,49.785206 C11.0173651,50.4365523 11.0217168,53.954347 10.998444,55.2734437 C10.9550983,57.7302687 10.9477644,60.3659875 10.9670758,63.7202365 C10.9737458,64.8787649 10.9813252,65.8533276 10.9984979,67.8760845 C10.9990687,67.9433184 10.9990687,67.9433184 10.9996396,68.010551 C11.1217938,82.3975075 13.247202,89.3904825 18.3503982,92.3365568 C19.7429434,93.140473 25.8712193,93.9452339 34.2911922,94.1179743 C38.0035483,94.1941353 41.5170784,94.1733663 47.0019055,94.0791327 C51.9133414,93.9947505 52.0721043,93.9923611 53.5,93.9923611 C54.8380543,93.9923611 55.5296366,93.9937899 59.1331629,94.0027282 C65.3566453,94.0181652 69.0049338,94.0181652 73.1556478,93.9925514 C79.3220915,93.9544988 83.7628856,93.7143491 87.4062306,93.1442525 C89.3280473,92.843534 90.9080955,92.4619237 92.1174205,92.0192587 C93.0376007,91.6824332 93.6036751,91.3656881 93.8368149,91.1575342 C93.9281255,91.0760094 94.2430679,90.6887185 94.552611,90.1554741 C95.0185713,89.3527726 95.3525111,88.4312906 95.5012379,87.4054032 C96.0079172,83.9104307 96.1512708,79.4648767 96.0939409,72.0337804 C96.087867,71.2464759 96.0815741,70.5830502 96.067648,69.2056112 C96.0571354,68.1658091 96.0532187,67.7687739 96.0482864,67.2239103 C96.0254848,64.7050717 96.0287808,62.5976298 96.0509421,58.6399812 C96.0742859,54.471138 96.0761224,53.0333282 96.0491877,51.3700901 C96.0122921,49.0917601 95.9984071,46.8031936 95.994599,43.5089467 C95.9939957,42.9870384 95.9936953,42.5712985 95.9931525,41.6335445 C95.9870348,31.063059 95.8912081,26.6224975 95.4446666,22.0274894 C95.2089352,19.6017628 94.7062649,17.3517647 94.0393517,15.5073637 C93.7691588,14.760124 93.4883072,14.1273204 93.2273206,13.6483494 C93.1648274,13.5336597 93.1079806,13.4361379 93.0589557,13.3573974 Z" id="Shape"></path>
        </g>
    </g>
</svg>
                                                
                                            }
                                            {custom.checked === true && 


   <svg viewBox="0 0 107 105" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M20.9266198,10.8614 C11.6358274,12.9091514 10.2334504,17.824316 10.9392727,41.2391316 C10.9641312,42.063783 10.9798998,42.5940206 10.9958422,43.1466994 C11.0269863,44.2263796 11.0226306,45.0263162 10.9933356,46.7812488 C10.9669637,48.3610733 10.9649277,49.0333024 10.9930253,49.785206 C11.0173651,50.4365523 11.0217168,53.954347 10.998444,55.2734437 C10.9550983,57.7302687 10.9477644,60.3659875 10.9670758,63.7202365 C10.9737458,64.8787649 10.9813252,65.8533276 10.9984979,67.8760845 C10.9990687,67.9433184 10.9990687,67.9433184 10.9993794,67.9840434 L11.009537,68.8991155 C11.2006904,82.6551348 13.3549935,89.4527105 18.3503982,92.3365568 C19.7429434,93.140473 25.8712193,93.9452339 34.2911922,94.1179743 C38.0035483,94.1941353 41.5170784,94.1733663 47.0019055,94.0791327 C51.7931346,93.9968158 51.7409034,93.9976269 53.1356091,93.9929927 L54.4855788,93.9929099 C55.616891,93.9940921 55.9969978,93.9949491 59.1331629,94.0027282 C65.3566453,94.0181652 69.0049338,94.0181652 73.1556478,93.9925514 C79.3220915,93.9544988 83.7628856,93.7143491 87.4062306,93.1442525 C89.3280473,92.843534 90.9080955,92.4619237 92.1174205,92.0192587 C93.0376007,91.6824332 93.6036751,91.3656881 93.8368149,91.1575342 C93.9281255,91.0760094 94.2430679,90.6887185 94.552611,90.1554741 C95.0185713,89.3527726 95.3525111,88.4312906 95.5012379,87.4054032 C96.0079172,83.9104307 96.1512708,79.4648767 96.0939409,72.0337804 C96.087867,71.2464759 96.0815741,70.5830502 96.067648,69.2056112 C96.0571354,68.1658091 96.0532187,67.7687739 96.0482864,67.2239103 C96.0254848,64.7050717 96.0287808,62.5976298 96.0509421,58.6399812 C96.0742859,54.471138 96.0761224,53.0333282 96.0491877,51.3700901 C96.0122921,49.0917601 95.9984071,46.8031936 95.994599,43.5089467 C95.9939957,42.9870384 95.9936953,42.5712985 95.9931525,41.6335445 C95.9870348,31.063059 95.8912081,26.6224975 95.4446666,22.0274894 C95.2089352,19.6017628 94.7062649,17.3517647 94.0393517,15.5073637 C93.7691588,14.760124 93.4883072,14.1273204 93.2273206,13.6483494 C93.1648274,13.5336597 93.1079806,13.4361379 93.0589557,13.3573974 C92.965734,13.287349 92.8451479,13.20399 92.7003089,13.1116818 C92.2126792,12.8009077 91.5717182,12.4658203 90.8430324,12.148795 C89.3472544,11.4980352 87.7127771,11.0257031 86.6000173,10.8849627 C85.5665233,10.7542476 84.7498978,10.7112451 83.7812813,10.7243768 C83.1342271,10.7331491 83.2794531,10.7268095 80.8472642,10.8440127 C79.6622297,10.9011175 78.7405145,10.9370109 77.6969207,10.9612939 C74.1615134,11.0435582 70.5160544,11.0351427 65.2750671,10.9630542 C64.7494173,10.955824 64.3085615,10.9471615 63.4766331,10.9289531 C61.0190616,10.8751642 60.0884753,10.8734154 59.0187295,10.9392173 C58.9870192,10.941184 58.9870192,10.941184 58.9554775,10.943205 C57.2692356,11.0521212 56.0432551,11.0521212 53.7028825,10.9946472 C52.7358569,10.9708993 52.3678265,10.964 51.9259302,10.964 C51.7892135,10.964 51.5671712,10.9654837 51.1978651,10.9688183 C51.137395,10.9693643 50.2622225,10.9776284 49.9528301,10.9803392 C47.0133568,11.0060933 44.5234805,11.0060933 41.8628436,10.9626683 C40.1701436,10.9350413 38.394609,10.933958 35.4426013,10.9505478 C34.9849617,10.9531643 34.9849617,10.9531643 34.5259189,10.9558812 C31.2894847,10.975047 29.9138118,10.9784763 28.2546153,10.963598 C27.2192245,10.9543134 26.247368,10.9386101 24.9178718,10.91214 C22.2210031,10.8584457 22.1686704,10.8575262 21.4840461,10.8569597 C21.2594355,10.8567738 21.0727809,10.8584222 20.9266198,10.8614 Z M46.4911549,46.905908 L61.1120874,23.5275236 C64.3433016,18.266584 69.2439768,15 75.3488533,15 C84.2680201,15 92,22.0465539 92,31.2296041 C92,34.7411016 90.8994505,37.9422872 89.0179817,41.0243676 L88.9331145,41.1633907 L62.2440061,81.8424674 L62.1536052,81.9778397 C58.8319676,86.8652727 53.6214633,90 47.7036486,89.9999989 C41.9811288,90.0027085 37.2152136,87.3430583 33.5028553,82.8993761 L20.089469,66.8999574 L19.9808153,66.7606418 C17.3837049,63.4306273 16,59.7778832 16,55.673778 C16,46.5960279 23.423244,39.2107005 32.5328505,39.2107005 C37.6339715,39.2107005 41.9080878,41.5117513 45.2464573,45.3910953 L45.3255979,45.4830605 L46.4911549,46.905908 Z" id="Combined-Shape" stroke="#3875A8" stroke-width="20" fill="#3875A8"></path>
    </g>
</svg>


                                            
                                            }
                                        </button>
                                        {(id === this.props.msg.custom.data.length - 1) &&
                                         <div className="skip-question-btn">
                                        <button onClick={() => this.skipQuestion()}>
                                            Hoppa över frågan
                                            </button>
                                        </div>
                                        }
                                        
                                        {custom.checked === true && custom.payload === "Annat" &&
                                         <React.Fragment>
                                            <div className="flexible-space"></div>
                                            <div className="padding-top inputContainer">
                                            <ChatInput  />
                                            </div>
                                        </React.Fragment>
                                            }
                                        
                                         
                                         
                                        {(id === this.props.msg.custom.data.length - 1) && this.state.error &&
                                                <div class="form__field form__field--page-error form__field--boxed" tabindex="-1" role="alert" id="page-error-message">
                                                <p>Du har missat att svara på frågan.</p>
                                                </div>
                                        }
                                         {(id === this.props.msg.custom.data.length - 1) && (custom.payload === "Annat" && custom.checked !== true )  &&
                                             <Button onClick={() => {this.sendFormValues()}}className={this.state.error ? "valSubmitBtn error-btn" : "valSubmitBtn"}>Nästa fråga</Button>
                                        } 
                                          {(id === this.props.msg.custom.data.length - 1) && (custom.payload !== "Annat" )  &&
                                             <Button onClick={() => {this.sendFormValues()}} className={this.state.error ? "valSubmitBtn error-btn" : "valSubmitBtn"}>Nästa fråga</Button>
                                        }
                                        
                                       
                                    </React.Fragment>
                                )}
                                </React.Fragment>
                                
                                }

                                {this.props.msg.custom.type === "range5" && 
                                <React.Fragment>
                                  
                                <div className="container-feedback">
                            
                     
                            
                            <button aria-label="5" role="radio" className="item" aria-checked={this.state.option === "5"} onClick={() => this.setState({valuesRange: [4.8], option: "5" })}>
                                 
                                 
                            <label htmlFor="5">
                            <input className="radio" onClick={() => this.setState({valuesRange: [4.8]})} type="radio" name="5" id="5" value="5" checked={this.state.option === '5'} onChange={this.handleOptionChange}/>
                            <span><FaRegFrown fill="#F02A28 "/></span>
                            </label>
                            </button>

                            <button aria-label="4" role="radio" className="item" aria-checked={this.state.option === "4"} onClick={() => this.setState({valuesRange: [3.6], option: "4" })}>
                            <label htmlFor="4">
                            <input  className="radio" onClick={() => this.setState({valuesRange: [3.6]})} type="radio" name="4" id="4" value="4" checked={this.state.option === '4'}  onChange={this.handleOptionChange}/>
                            <span><FaRegFrownOpen fill="#FB6B13"/></span>
                            </label>
                            </button>

                            <button aria-label="3" role="radio" className="item" aria-checked={this.state.option === "3"} onClick={() => this.setState({valuesRange: [2.5], option: "3" })}>
                            <label htmlFor="3">
                            <input  className="radio" onClick={() => this.setState({valuesRange: [2.5]})} type="radio" name="3" id="3" value="3" checked={this.state.option === '3'}  onChange={this.handleOptionChange}/>
                            <span><FaRegMeh  fill="#FFCB03"/></span>
                            </label>
                            </button>

                            <button  aria-label="2" role="radio" className="item" aria-checked={this.state.option === "2"} onClick={() => this.setState({valuesRange: [1.4], option: "2" })}>
                            <label htmlFor="2">
                            <input className="radio" onClick={() => this.setState({valuesRange: [1.4]})} type="radio" name="2" id="2" value="2"  checked={this.state.option === '2'}  onChange={this.handleOptionChange}/>
                            <span><FaRegSmile fill="#7CC710"/></span>
                            </label>
                            </button>

                           <button  aria-label="1" role="radio" className="item" aria-checked={this.state.option === "1"} onClick={() => this.setState({valuesRange: [0.2], option: "1" })}>
                            <label htmlFor="1">
                            <input className="radio" onClick={() => this.setState({valuesRange: [0.2]})} type="radio" name="1" id="1" value="1" checked={this.state.option === '1'} onChange={this.handleOptionChange}/>
                            <span><FaRegGrinAlt fill="#19C733"/></span>
                            </label>
                            </button></div>
                            <div className="container-feedback-number" aria-hidden="true">
                                    <p className="item">5</p>
                                    <p className="item">4</p>
                                    <p className="item">3</p>
                                    <p className="item">2</p>
                                    <p className="item">1</p>
                            </div>

                                <div
                                style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                                }}
                            >



                                <Range
                                direction={Direction.Left}
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
                                            min: "5",
                                            max: "0",
                                            
                                            direction: Direction.Right
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
                                 <output style={{ margin: '0px 0 40px 0 ', width: '100%' }} >
                                <div style={{ float: 'left' }}>{this.props.msg.custom.alt.firstItem}</div><div style={{ float: 'right' }}>{this.props.msg.custom.alt.lastItem}</div>

                                </output>  
                                
                            </div>
                                
                            <Button onClick={() => {this.sendRangeValues(JSON.stringify(this.state.valuesRange[0]))}} className="valSubmitBtn">Nästa fråga</Button>

                                </React.Fragment>
                                
                                }

                                {this.props.msg.custom.type === "range100" && 
                                <React.Fragment>

                                    {getSmiley(this.state.values)}

                        <div style={{ marginTop: '20px'}}className="rangeTopContainer">
                            <button aria-label={"Minska värdet med 1. Aktuellt värde är:" + this.state.values} className="rangeDecrement" onClick={() => {this.decrement100Input(this.state.values)}}> <AiOutlineMinusCircle/> </button>
                         
                            <input size="3" aria-label="Ändra värde" style={{
                                        color: '#3875A8', backgroundColor: "transparent", border: "0", borderBottom: "1px solid #ccc", height: "30px", width:"55px",
                                        fontWeight: 'bold', fontSize: "20px", textAlign: "center"}} value={this.state.values} onChange={e => this.handleRangeInput100Change(e, this.state.values)}/>
                                        
                            <button aria-label={"Öka värdet med 1. Aktuellt värde är:" + this.state.values} className="rangeIncrement" onClick={() => {this.increment100Input(this.state.values)}} > <AiOutlinePlusCircle/></button>
                      </div>

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
                                        marginTop: '-10px',
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
                                        height: '16px',
                                        width: '5px',
                                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                                        }}
                                    />
                                    </div>
                                   
                                )}
                                />
                                <output style={{ margin: '10px 0 30px 0 ', width: '100%' }}>
                                <div style={{ float: 'left' }}>{this.props.msg.custom.alt.firstItem}</div><div style={{ float: 'right' }}>{this.props.msg.custom.alt.lastItem}</div>
                                </output>    
                               
                                <Button onClick={() => {this.sendRangeValues(JSON.stringify(this.state.values[0]))}} className="valSubmitBtn">Nästa fråga</Button>
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
                                 <Button onClick={() => {this.sendRangeChange(this.state)}} className="valSubmitBtn">Nästa fråga</Button>
                    
                                </React.Fragment>

                                 }

                                {this.props.msg.custom.type === "finalPage" && 


                                <React.Fragment>

                                {this.props.msg.custom.severity === "low" && 

                                   <Modal show={this.state.showFinalForm}
                                        size="lg"
                                        enforceFocus={true}
                                        backdrop="static"
                                        dialogClassName="feedback-modal"
                                        role="main"
                                        centered>
                                        <Modal.Header></Modal.Header>
                                        
                                        <div className="container">
                                        
                                         <div class="scroll">

                                        {this.props.msg.custom.text.map((title, id) =>
                                        <React.Fragment key={id}>
                                                <h1 class="titleModal">{title.title}</h1>
                                                   <p>{title.content}</p>
                                                   <a rel="noopener noreferrer" target="_blank" href={title.link}>{title.linkText}</a>

                                          </React.Fragment>

                                        )}
                               {this.props.msg.custom.data &&
                               <React.Fragment>
                                             <br/><br /><h4>Se dina svar nedan</h4>
                                            
                                          {this.props.msg.custom.data.map((custom, id) =>

                                    <React.Fragment key={id}>

                                            <p>{custom.title}</p>
                                            <p><strong>{custom.answer}</strong></p>



                                    </React.Fragment>
                                          
                                          )}
                                      </React.Fragment>    
                               }</div>
<div className="btnContainer">
            < button className="agreeBtn btn btn-primary" onClick={()=>this.startCase()} >Läs mer på 1177.se</button>
             <button className="agreeBtn btn btn-primary" onClick={()=>this.closeCase()}>Avsluta</button>
    </div>
</div>
                                    </Modal>
                                
                                
                                }

                                {this.props.msg.custom.severity === "medium" && 

                                   <Modal show={this.state.showFinalForm}
                                        size="lg"
                                        backdrop="static"
                                        enforceFocus={true}
                                        dialogClassName="feedback-modal"
                                        role="main"
                                        centered>
                                        <Modal.Header></Modal.Header>
                                        
                                        <div className="container">
                                        
                                         <div class="scroll">

                                        {this.props.msg.custom.text.map((title, id) =>
                                        <React.Fragment key={id}>
                                                <h1 class="titleModal">{title.title}</h1>
                                                   <p>{title.content}</p>
                                                   <a rel="noopener noreferrer" target="_blank" href={title.link}>{title.linkText}</a>

                                          </React.Fragment>

                                        )}


                               {this.props.msg.custom.data &&
                               <React.Fragment>
                                             <br/><br /><h4>Se dina svar nedan</h4>
                                            
                                          {this.props.msg.custom.data.map((custom, id) =>

                                    <React.Fragment key={id}>

                                            <p>{custom.title}</p>
                                            <p><strong>{custom.answer}</strong></p>



                                    </React.Fragment>
                                          
                                          )} </React.Fragment>
                                          }}</div>
<div className="btnContainer">
            < button className="agreeBtn btn btn-primary" onClick={()=>this.startCase()} >Kontaka läkare</button>
             <button className="agreeBtn btn btn-primary" onClick={()=>this.closeCase()}>Avsluta</button>
             </div>
</div>
                                    </Modal>
                                
                                
                                }

                                {this.props.msg.custom.severity === "high" && 

                                   <Modal show={this.state.showFinalForm}
                                        size="lg"
                                        backdrop="static"
                                        enforceFocus={true}
                                        dialogClassName="feedback-modal"
                                        role="main"
                                        centered>
                                        <Modal.Header></Modal.Header>
                                        
                                  <div className="container">
                                        
                                         <div class="scroll">

                                        {this.props.msg.custom.text.map((title, id) =>
                                        <React.Fragment key={id}>
                                                <h1 class="titleModal">{title.title}</h1>
                                                   <p>{title.content}</p>
                                                   <a rel="noopener noreferrer" target="_blank" href={title.link}>{title.linkText}</a>

                                          </React.Fragment>

                                        )}
                               {this.props.msg.custom.data &&
                                <React.Fragment>

                                             <br/><br /><h4>Se dina svar nedan</h4>
                                            
                                          {this.props.msg.custom.data.map((custom, id) =>

                                    <React.Fragment key={id}>

                                            <p>{custom.title}</p>
                                            <p><strong>{custom.answer}</strong></p>



                                    </React.Fragment>
                                          
                                          )}
                                        </React.Fragment>   
                               }</div>
<div className="btnContainer">
            < button className="agreeBtn btn btn-primary" onClick={()=>this.startCase()} >Ring 112</button>
             <button className="agreeBtn btn btn-primary" onClick={()=>this.closeCase()}>Avsluta</button>
             </div>
</div>

                                    </Modal>
                                
                                
                                }
                                    </React.Fragment>
                                }


  
                            </React.Fragment>
                            }

                             </div>

              {this.props.msg.custom && this.props.msg.custom.type === "searchSelect" && 

                        <React.Fragment>
                        <div className="flexible-space"></div>
                            <div className="inputContainer">
                            <SearchSelect msg={this.props.msg} />

                        </div>
                        </React.Fragment>
}
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