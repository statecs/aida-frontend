import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './ChatInput.css';
import {Link} from "@reach/router"
import { MdKeyboardVoice } from "react-icons/md";

class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receiver: 'Bot',
            message: '',
            error: false
        };
    }

    supportsMediaDevices = () => {
        return navigator.mediaDevices;
    }
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

     handleInputChange = async (
        message: string,
        scrollToEnd: boolean = false
        ) => {
        await this.setState({
        message
    });
  };
    skipQuestion = () => {
                let receiver = this.state.receiver;
                let message = "Hoppa över frågan"
                let sender = this.props.user;
                const rasaMsg = { sender, receiver, message };
                //Send message to rasa and get chatbot response
                this.props.sendMessage(rasaMsg);
                this.setState({ message: '' });
    }
    sendMessage = () => {
        if(this.state.message){
            const { receiver, message } = this.state;
            let sender = this.props.user;
            const rasaMsg = { sender, receiver, message };
            //Send message to rasa and get chatbot response
            this.props.sendMessage(rasaMsg);
            this.setState({ message: '' });
        }
        else{
            this.setState({ error: true });
        }
    };

    render() {
        return (
            <React.Fragment>
            {this.state.error &&

            <div className="form__field form__field--page-error form__field--boxed" tabindex="-1" role="alert" id="page-error-message">
            <p>Du har missat att svara på frågan.</p>

       
            </div>
    }

               <div className={this.state.error ? "inputSearchContainer error" : "inputSearchContainer"}>
                     <label
                                    className={this.state.message ? "field-active" : ""}
                                    >
                                    Skriv ett svar
                                    </label>
                    <input className={this.state.error ? "textArea search-input error-msg": "textArea search-input" }
                
                        type="text"
                        name="message"
                        placeholder="Skriv ett svar..."  
                        onChange={this.onChange}
                        value={this.state.message}
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                this.sendMessage();
                            };
                        }}/>
                        <div className="voiceIcon">
                            {this.supportsMediaDevices() && 
                                <Link aria-label="Röststyrning" to="/assistent/"><MdKeyboardVoice/></Link>
                                }</div>
                                

                                 <button onClick={() =>this.sendMessage()} className="searchIcon" aria-label="Nästa fråga">  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>

                       
                              
                       
            
            </div>

            
          

             

            </React.Fragment>
        );
    };
};

ChatInput.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID, // Get unique session id to use for user each time page is loaded.
    messages: state.messages.messages
})

export default connect(mapStateToProps, { sendMessage })(ChatInput);