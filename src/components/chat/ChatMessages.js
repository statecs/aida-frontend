import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ChatMessages.css';
import PulseLoader from 'react-spinners/PulseLoader';
import StepWizard from 'react-step-wizard';
import Nav from './Nav';
import ChatStep from './ChatStep';
import StepController from './StepController';
import "./transitions.css";

const spinnerCss = "display: table; margin: 20px auto;";

const animations = {
    enterRight: "animated intro",
    enterLeft: "animated intro",
    intro: "animated intro"
  };

class ChatMessages extends Component {

    setInstance = instance => this.setState({instance});

    render() {

    const instance = this.state;

    if((this.state && this.state.instance.totalSteps > 0)){
        setTimeout(() => {
            this.state.instance.lastStep();
        }, 0);
    }
        let spinner;
    if (this.props.loading) {
      spinner = <PulseLoader css={spinnerCss} color={"#2177D2"} />;
    } else {
      spinner = null;
    }
        return (

        <React.Fragment>
        {spinner}
        <div className="container" role="region" aria-live="polite">

            {!this.props.loading &&
            <React.Fragment>
            
            <StepWizard className="msg-display" nav={<Nav />} isLazyMount={true} transitions={animations} instance={this.setInstance}>
                                    {this.props.messages
                                        .filter(msg => msg.sender === "bot" )
                                        .map((msg, idx) => <ChatStep  key={idx+1} msg={msg} ></ChatStep> )}

                                    </StepWizard> 
                                    {instance ? <StepController stepInstance={this.state.instance}/> : null }
                              
      </React.Fragment>
            }
             </div> 
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