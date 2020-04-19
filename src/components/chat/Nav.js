import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendBack } from '../../actions/messageActions';
import { MdKeyboardArrowUp } from "react-icons/md";


class Nav extends Component {
   constructor(props) {
        super(props);
        this.state = {
            receiver: 'Bot',
            message: ''
        };
    }

  sendValues = (el) => {
        this.props.previousStep();
        let sender = this.props.user;
        let receiver = 'bot';
        let message = "/back";
        const rasaMsg = { sender, receiver, message };
        //Send message to rasa and get chatbot response
        this.props.sendBack(rasaMsg);

        
    };

      render() {
        return (

            <div className="backNav">
        {this.props.currentStep !== 1 && 
         <button onClick={this.sendValues}><MdKeyboardArrowUp/><span>Bakåt</span></button>
        } 
        </div>
        )
}

}


Nav.propTypes = {
    sendBack: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendBack })(Nav);