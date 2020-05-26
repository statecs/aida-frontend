import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './VoiceInput.css';
import SpeechInput from "./SpeechInput";
import SpeechInputCloud from "./SpeechInputCloud";

function supportsSpeechRecognition() {
  return "webkitSpeechRecognition" in window;
}
class VoiceInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receiver: 'Bot',
            message: '',
            _isMounted: false
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
        if(this.state.message){

            if (this.state.message === ("Tillbaka") || this.state.message === ("Ångra") || this.state.message === ("Bakåt") || this.state.message === ("Gå tillbaka") ){
                const { receiver } = this.state;
                let sender = this.props.user;
                const message = "/back";
                const rasaMsg = { sender, receiver, message };
                //Send message to rasa and get chatbot response
                this.props.sendMessage(rasaMsg);

            } else if ((this.state.message === ("Avsluta")) || (this.state.message === ("Avbryt")) || (this.state.message === ("Stäng av"))  || (this.state.message === ("Paus"))) {
                return

            } else {
                const { receiver, message } = this.state;
                let sender = this.props.user;
                const rasaMsg = { sender, receiver, message };
                //Send message to rasa and get chatbot response
                this.props.sendMessage(rasaMsg);
                this.setState({ message: '' });
            }
        }
    };

    componentDidMount() {
        this.setState({ _isMounted: true });
    }

     componentWillUnmount() {
          this.setState({ _isMounted: false });
  }

    render() {  
        return supportsSpeechRecognition() ? (
             <React.Fragment>
              <div className="user-messages">
                                        <div className="user-msg">
                                            <div className="user-msg-text-voice">
                                                <p aria-hidden="true" className="display-linebreak">{this.state.message}</p>
                                            </div>
                                        </div>
                                        </div>
             <div className="voicePageIcon">

     <SpeechInput
                language="sv-SE"
                onSpeechInput={message => this.handleInputChange(message, true)}
                onSpeechEnd={message => this.sendMessage()}
                /> 
                
                </div>

    </React.Fragment>

    ) :   <React.Fragment>
            <div className="userMessage">{this.state.message}</div>
             <div className="voicePageIcon">

    {this.state._isMounted && 

     <SpeechInputCloud
                language="sv-SE"
                onSpeechInput={message => this.handleInputChange(message, true)}
                onSpeechEnd={message => this.sendMessage()}
                /> 
                
    }
                </div>

    </React.Fragment>
    };
};

VoiceInput.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID, // Get unique session id to use for user each time page is loaded.
    messages: state.messages.messages
})

export default connect(mapStateToProps, { sendMessage })(VoiceInput);