import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendBack } from '../../actions/messageActions';
/* eslint react/prop-types: 0 */
import styles from './nav.less';
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
        //navigate('/aida/chat')

        
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
/* const Nav = (props) => {
    const dots = [];
    for (let i = 1; i <= props.totalSteps; i += 1) {
        const isActive = props.currentStep === i;
        dots.push((
            <span
                key={`step-${i}`}
                className={`${styles.dot} ${isActive ? styles.active : ''}`}
                onClick={() => props.goToStep(i)}
            >&bull;</span>
        ));
    }

    return (
        <div className="backNav">
        {props.currentStep !== 1 && 
         <button onClick={props.previousStep}><MdKeyboardArrowUp/><span>Ångra</span></button>
        } 
        </div>
    );
};*/

Nav.propTypes = {
    sendBack: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendBack })(Nav);