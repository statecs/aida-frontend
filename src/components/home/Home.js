import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './Home.css';
import {Button, TextField} from 'cauldron-react'
import {navigate} from "@reach/router"

let values = [{
    name: "Jag har huvudvärk",
},
{
    name: "Jag har ont i halsen",
},
{
    name: "Jag har hosta och feber",

}];

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            value: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }
    
    sendValues = (el) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = el.target.value;
        const rasaMsg = { sender, receiver, message };
        //Send message to rasa and get chatbot response
        this.props.sendMessage(rasaMsg);
        navigate('/aida/chat')
        
    };

     validate = e => {
        e.preventDefault();
        const isEmpty = !this.input.value.trim();
        this.setState({
             error: isEmpty ? 'Kan inte vara tomt' : null
        });

        if (isEmpty) {
            this.input.focus();
        } else{
            let sender = this.props.user;
            let receiver = 'bot';
            let message = this.input.value;
            const rasaMsg = { sender, receiver, message };
            //Send message to rasa and get chatbot response
            this.props.sendMessage(rasaMsg);
            navigate('/aida/chat')
        }
  };

    render() {
        return (
            <React.Fragment>
                <div className="container">
                
                        <form onSubmit={this.validate} noValidate>

                                <TextField
                                    id="name"
                                    label="Hej, vad söker du vård för?"
                                    placeholder="Hej, vad söker du vård för?"
                                    aria-describedby="text-field-help"
                                    error={this.state.error}
                                    fieldRef={el => this.input = el}/>

                           
                        </form>

                    <h1 className='intro' >Vanliga ärenden</h1>
                        <div className='cardDisplay'>
                            {values.map((value) => (
                                    <div key={value.name}>
                                        <Button onClick={this.sendValues} value={value.name} type="submit" id="submit">{value.name}</Button>
                                    </div>
                                ))}  
                    </div>

                    <Button target='_blank' rel="noopener noreferrer" href="https://forms.gle/72kUUsRsk48VRuNUA">Ge feedback</Button>
                </div>

            </React.Fragment>
        )
    };
};

Home.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendMessage })(Home);