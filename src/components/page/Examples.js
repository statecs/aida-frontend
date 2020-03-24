import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import {Button} from 'cauldron-react'
import {Link, navigate} from "@reach/router"

let values = [{
    name: "Jag har huvudvärk",
},
{
    name: "Jag har ont i halsen",
},
{
    name: "Jag har hosta och feber",

}];

class Examples extends Component {

        sendValues = (el) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = el.target.value;
        const rasaMsg = { sender, receiver, message };
        //Send message to rasa and get chatbot response
        this.props.sendMessage(rasaMsg);
        navigate('/aida/chat')
        
    };

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h3 className='intro'>Vanliga ärenden</h3>
                     <Link to="/aida/kategorier" className="icons"  aria-label="Visa fler">Kategorier</Link>
               
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


Examples.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendMessage })(Examples);