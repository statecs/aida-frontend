import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ChatMessages.css';
import PulseLoader from 'react-spinners/PulseLoader';
import StepWizard from 'react-step-wizard';
import Nav from './Nav';
import ChatStep from './ChatStep';
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

    if((this.state && this.state.instance.totalSteps > 0)){
    this.state.instance.lastStep();
    }
        let spinner;
    if (this.props.loading) {
      spinner = <PulseLoader css={spinnerCss} color={"#2177D2"} />;
    } else {
      spinner = null;
    }
        return (

        <React.Fragment>

        <div className="container">

        {this.props.loading && 
        <span className="alertLoading" role="alert" aria-busy="true">{spinner} Laddar</span>
        }

            {!this.props.loading &&
            <React.Fragment>
            <StepWizard className="msg-display" isHashEnabled={true} nav={<Nav />} isLazyMount={true} transitions={animations} instance={this.setInstance}>
                                    {this.props.messages
                                        .filter(msg => msg.sender === "bot" )
                                        .map((msg, idx) => <div key={idx} role="region" aria-live="assertive" aria-atomic="true"><ChatStep msg={msg}></ChatStep></div> )}

                                    </StepWizard> 
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