import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ChatMessages.css';
import PulseLoader from 'react-spinners/PulseLoader';
import StepWizard from 'react-step-wizard';
import Nav from './Nav';
import StepMsg from './StepMsg';
import StepController from './StepController';
import "./transitions.css";

const spinnerCss = "display: table; margin: 20px auto;";

const animations = {
    enterRight: "animated slideInUp",
    enterLeft: "animated slideInUp",
    intro: "animated intro"
  };

class ChatMessages extends Component {

    setInstance = instance => this.setState({instance});

    render() {

    const instance = this.state;

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

                                    {spinner}

                                    <StepWizard className="msg-display" nav={<Nav />} isHashEnabled={true} isLazyMount={true} transitions={animations} instance={this.setInstance}>
                                        {this.props.messages.map((msg, index) => {
                                            
                                            if (msg.sender === "bot" ){

                                                return (
                                                    <StepMsg msg={msg} key={"messages-"+ index } hashKey={'basic' + index} ></StepMsg>
                                                    
                                                )
                                                }
                                            })
                                        }
                                    </StepWizard> 
                                    {instance ? <StepController stepInstance={this.state.instance}/> : null }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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

export default connect(mapStateToProps)(ChatMessages);