import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';
import { sendMessage } from '../../actions/messageActions';
import './ChatMessages.css';
import ChatMessage from './ChatMessage/ChatMessage';
import PulseLoader from 'react-spinners/PulseLoader';

const spinnerCss = "display: table; margin: 20px auto;";
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

                {  <ScrollToBottom className="messagesDisplay" scrollViewClassName="msgScroll">
                  
                <div className="container">
                    <div className="chat-container">
                        <div className="chat-display">
                            <div className="chats">
                                <div className="msg-display">

                                    {this.props.messages.map((msg) => {
                                        
                                            return (

                                         <div className="messages-container" key={"messages-" + msg.id }>
                                            {msg.sender !== "bot" &&
                                           <div className="user-messages" key={"user-" + msg.id }>
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
                                            <div className="bot-msg" key={"user-" + msg.id }>
                                                        <div className="bot-msg">
                                                            <div className="bot-msg-text">
                                                                <p className="display-linebreak">{msg.message}</p>
                                                                {msg.buttons &&
                                                                    msg.buttons.map((button, id) =>
                                                                        <button key={"buttons-" + id } type="submit" onClick={() => this.sendValues(button.payload)}>{button.title}</button> 
                                                                    )}
                                                            </div>
                                                        </div>
                                                        
                                                    </div>

                                            }
                                            </div>)
                                        
                                       
                                        // <tr key={msg.id}>
                                        //     <td>{msg.id}</td>
                                        //     <td>{msg.sender}</td>
                                        //     <td>{msg.receiver}</td>
                                        //     <td className="display-linebreak">{msg.message}</td>
                                        //     <td>
                                        //     </td>
                                        // </tr>
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {spinner}
                 </ScrollToBottom>}

                {/*<table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Message</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.messages.map(msg => (
                            <tr key={msg.id}>
                                <td>{msg.id}</td>
                                <td>{msg.sender}</td>
                                <td>{msg.receiver}</td>
                                <td className="display-linebreak">{msg.message}</td>
                                <td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <ScrollToBottom className="messagesDisplay" scrollViewClassName="msgScroll">
                {this.props.messages.map(msg => <div id={msg.id} key={msg.id}><ChatMessage msg={msg}/></div>)}
                {spinner}
                </ScrollToBottom>
                */}
            </React.Fragment>
        );
    }
}

ChatMessages.propTypes = {
    messages: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    messages: state.messages.messages,
    loading: state.messages.loading
})

export default connect(mapStateToProps, { sendMessage })(ChatMessages);