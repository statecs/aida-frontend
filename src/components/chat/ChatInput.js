import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './ChatInput.css';
import SpeechInput from "./SpeechInput";

class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receiver: 'Bot',
            message: ''
        };
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

    sendMessage = () => {
        const { receiver, message } = this.state;
        let sender = this.props.user;
        const rasaMsg = { sender, receiver, message };
        //Send message to rasa and get chatbot response
        this.props.sendMessage(rasaMsg);
        this.setState({ message: '' });

        setTimeout(() => {
        this.props.stepInstance.lastStep()
        }, 1000);
        
    };

    render() {
        return (
            <React.Fragment>
                <div className="chatInput">
                    <textarea
                        className="textArea"
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
                        }}
                    />
            
            <SpeechInput
              language="sv-SE"
              onSpeechInput={message => this.handleInputChange(message, true)}
              onSpeechEnd={message => this.sendMessage()}
            />
                <button onClick={this.sendMessage} className="btn btn-primary submitBtn">Ok</button>
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