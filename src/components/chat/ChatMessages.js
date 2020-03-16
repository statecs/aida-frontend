import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './ChatMessages.css';
import ChatMessage from './ChatMessage/ChatMessage';
import PulseLoader from 'react-spinners/PulseLoader';
import StepWizard from 'react-step-wizard';
import Nav from './Nav';
import "./transitions.css";

const spinnerCss = "display: table; margin: 20px auto;";

const animations = {
    enterRight: "animated slideInUp",
    enterLeft: "animated slideInUp",
    intro: "animated intro"
  };

class ChatMessages extends Component {

    sendValues = (payload) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = payload;
        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);
    };
    render() {
        let spinner;
    if (this.props.loading) {
      spinner = <PulseLoader css={spinnerCss} color={"#2177D2"} />;
    } else {
      spinner = null;
    }
        return (

        <React.Fragment>
            {    
                <div className="container">
                    <div className="chat-container">
                        <div className="chat-display">
                            <div className="chats">
                                <div className="msg-display">

                                    <StepWizard className="msg-display" nav={<Nav />} isHashEnabled={true} isLazyMount={true} transitions={animations}>

                                        {this.props.messages.map((msg, index) => {

                                     if (msg.sender === "bot" ){
                                        
                                         return (

                                         <React.Fragment key={"messages-" + index }>
                                         
                                            {msg.sender !== "bot" &&
                                           <div className="user-messages" hasKey={"messages-" + msg.sender } >
                                                    <div className="user-msg">
                                                        <div className="user-msg-text">
                                                            <p className="display-linebreak">{msg.message}</p>
                                                        </div>
                                                    </div>
                                                    <div className="user-messages-img">
                                                   
                                                    </div>
                                                </div>

                                            }

                                            {msg.sender === "bot" &&
                                            <div className="bot-msg" hasKey={"messages-" + msg.sender } >
                                                        <div className="bot-msg">
                                                            <div className="bot-msg-text">
                                                                <p className="display-linebreak">{msg.message}</p>
                                                                {msg.buttons &&
                                                                    msg.buttons.map((button, id) =>
                                                                        <button key={"buttons-" + id } type="submit" onClick={() => {  this.sendValues(button.payload)} }>{button.title}</button> 
                                                                    )}
                                                            </div>
                                                        </div>
                                                        
                                                    </div>

                                            }
                                        
                                            
                                            </React.Fragment>)

                                    }
                                        
                                    }
                                    
                                    )}</StepWizard> 

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
                {spinner}
    
       </React.Fragment>
        );
    }
}

ChatMessages.propTypes = {
    messages: PropTypes.array.isRequired,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func
};


const mapStateToProps = state => ({
    messages: state.messages.messages,
    loading: state.messages.loading
})

export default connect(mapStateToProps, { sendMessage })(ChatMessages);