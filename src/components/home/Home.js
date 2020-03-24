import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './Home.css';
import {Button, TextField} from 'cauldron-react'
import {navigate, Link} from "@reach/router"

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
           
                <div className="container-home">
                 <h1 className="site-logo"> 
                    <Link to="/aida" itemProp="url"> 
                        <span itemProp="logo" itemType="http://schema.org/ImageObject" aria-label="Symptomkollen"> 
                    <svg width="129px" height="129px" viewBox="0 0 129 129" version="1.1">
                        <g id="Prototype" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Second-screen" transform="translate(-224.000000, -184.000000)">
                                <g id="Group-5" transform="translate(226.000000, 186.000000)">
                                    <circle id="Oval" stroke="#979797" strokeWidth="4" cx="62.5" cy="62.5" r="62.5"></circle>
                                    <circle id="Oval" fill="#979797" cx="47.5" cy="67.5" r="5.5"></circle>
                                    <circle id="Oval" fill="#979797" cx="61.5" cy="67.5" r="5.5"></circle>
                                    <circle id="Oval" fill="#979797" cx="75.5" cy="67.5" r="5.5"></circle>
                                    <path d="M25,96.0416306 L25,47.0416306 C25.24856,33.722196 36.1221285,23 49.5,23 C62.8778715,23 73.75144,33.722196 73.995799,47.0416817 L74,47.0416306 C87.3199008,47.2906634 98.0416306,58.1640499 98.0416306,71.5416306 C98.0416306,84.9192112 87.3199008,95.7925977 74.0008177,96.0374136 L74,96.0416306 L25,96.0416306 Z" id="Combined-Shape" stroke="#979797" strokeWidth="4" transform="translate(61.520815, 59.520815) rotate(315.000000) translate(-61.520815, -59.520815) "></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                                            
                    </span> 
                    </Link>
                </h1> 

                
                        <form onSubmit={this.validate} noValidate>

                                <TextField
                                    id="name"
                                    label="Hej, vad söker du vård för?"
                                    placeholder="Hej, vad söker du vård för?"
                                    aria-describedby="text-field-help"
                                    error={this.state.error}
                                    fieldRef={el => this.input = el}/>

                           
                        </form>

                    <h2 className='intro' >Vanliga ärenden</h2>
                        <div className='cardDisplay'>
                            {values.map((value) => (
                                    <div key={value.name}>
                                        <Button onClick={this.sendValues} value={value.name} type="submit">{value.name}</Button>
                                    </div>
                                ))}  
                    </div>
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