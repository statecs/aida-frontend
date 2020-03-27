import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './ChatStep.css';
import {Button, Link} from 'cauldron-react'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import formUrl from '../../keys/formUrl';
import { FaRegFrown, FaRegAngry, FaRegMeh, FaRegSmile, FaRegLaughBeam  } from "react-icons/fa";

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
            showPopupForm: false,
            chosenVals: [],
            submitted: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


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
    

        axios({
            method: 'get',
            url: `${formUrl}?date=${encodeURIComponent(date)}&userAgent=${encodeURIComponent(userAgent)}&user=${encodeURIComponent(user)}&userMessage=${encodeURIComponent(userMessage)}&message=${encodeURIComponent(message)}&rating=${encodeURIComponent(rating)}&freeText=${encodeURIComponent(freeText)}`
        })

        this.setState({submitted: true})
    }

    onToggle(index, e){
        let newItems = this.props.msg.custom.data.slice();
            newItems[index].checked = !newItems[index].checked

        this.setState({
            items: newItems
        })
    }
  
    sendFormValues = () => {
        const chosenVals = this.props.msg.custom.data.filter(item => item.checked);
        let messages = chosenVals.map((item, index) => {
            return (
                item.payload
            
            );
        })
        let sender = this.props.user;
        let receiver = 'bot';
        let message = messages.join(", ");
        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);
    };

    sendValues = (payload) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = payload;
        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);
    };

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
                        centered
                    >
                    <Modal.Header closeButton></Modal.Header>
                    {this.state.submitted
                    ? <Modal.Body> <div className="container-feedback"><h5> Tack så mycket för din feedback!</h5> </div> <button className="agreeBtn" variant="secondary" onClick={() => this.closePopupForm()}>Stäng</button></Modal.Body>
                    : <Modal.Body>
                    <form id="feedback-form" onSubmit={this.handleSubmit}>
                      <h3> Feedback </h3>
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
                <React.Fragment>
                   <div className="bot-messages">
                        <div className="bot-msg">
                            <div className="bot-msg-text">
                                <h3 aria-label={this.props.msg.message}>{this.props.msg.message}</h3>
                            </div>
                        </div>
                         <Link aria-hidden="true" className="feedback-link" onClick={() => this.openPopupForm()}>Vill du ge feedback?</Link>   
                    </div>    

                    <div className="msgBtn">
                        {this.props.msg.buttons &&
                            this.props.msg.buttons.map((button, id) =>
                                <Button key={"buttons-" + id } type="submit" onClick={() => {  this.sendValues(button.payload)} }>{button.title}</Button>
                            )}
                            </div>
                        <div className="msgCustom">
                              {this.props.msg.custom && 
                            <ul>
                                {this.props.msg.custom.data.map((custom, id) =>
                                    <li key={id}>
                                    <label>
                                        <input onChange={this.onToggle.bind(this, id)} type="checkbox" name={custom.payload} value={custom.payload}/>
                                        {custom.title}
                                    </label>
                                    </li>
                                )}
                                <Button onClick={() => {this.sendFormValues()}} className="valSubmitBtn">Skicka</Button>
                            </ul>
                            }
                             </div>
                       </React.Fragment>
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

export default connect(mapStateToProps, { sendMessage })(ChatStep);