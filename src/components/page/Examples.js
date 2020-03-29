import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import './Examples.css';
import {Link, navigate} from "@reach/router"
import searchTerms from '../home/searchTerms';
import { MdKeyboardArrowRight } from "react-icons/md";


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
                <div className="container top-margin">
                    <h3 className='intro'>Vanliga ärenden</h3>
                     <Link to="/aida/kategorier">Kategorier  <MdKeyboardArrowRight/></Link>
               
                        <div className='exampleDisplay'>
                            {searchTerms.map((value) => (
                                    <React.Fragment key={value.name}>
                                        <button className="exampleBtn" onClick={this.sendValues} value={value.name} type="submit">{value.name}</button>
                                    </React.Fragment>
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