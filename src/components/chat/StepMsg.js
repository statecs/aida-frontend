import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './ChatMessages.css';

class StepMsg extends Component {

 constructor(props) {
        super(props);
        this.state = {
            chosenVals: [],
        };
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

         setTimeout(() => {
            this.props.lastStep()
        }, 1000);
    };

    sendValues = (payload) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = payload;
        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);
    
        setTimeout(() => {
            this.props.lastStep()
        }, 1000);


    };
    render() {

        return (
         <React.Fragment>
            {this.props.msg.sender !== "bot" &&
             <div className="user-messages">
                <div className="user-msg">
                    <div className="user-msg-text">
                        <p className="display-linebreak">{this.props.msg.message}</p>
                    </div>
                </div>
                <div className="user-messages-img"></div>
            </div>
            }

            {this.props.msg.sender === "bot" &&
                        <div className="bot-msg-text">
                            <p role="region" aria-live="polite" aria-atomic="true"  className="display-linebreak">{this.props.msg.message}</p>

                        {this.props.msg.buttons &&
                            this.props.msg.buttons.map((button, id) =>
                                <button key={"buttons-" + id } type="submit" onClick={() => {  this.sendValues(button.payload)} }>{button.title}</button> 
                            )}

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
                                <button  onClick={() => {this.sendFormValues()}} className="valSubmitBtn">Skicka</button>
                            </ul>
                          
                            }
                       </div>
            }
                                             
        </React.Fragment>
        );
    }
}

StepMsg.propTypes = {
    messages: PropTypes.array.isRequired,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func
};


const mapStateToProps = state => ({
    messages: state.messages.messages,
    loading: state.messages.loading
})

export default connect(mapStateToProps, { sendMessage })(StepMsg);