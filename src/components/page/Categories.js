import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendStart } from '../../actions/messageActions';
import {Link, navigate} from "@reach/router"
import { MdKeyboardArrowRight } from "react-icons/md";
import Button from 'react-bootstrap/Button';

let values = [{
    name: "Huvudvärk",
},
{
    name: "Ont i halsen",
},
{
    name: "Hosta och feber",

}];


class Categories extends Component {

    sendValues = (el) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = el.target.value;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/aida/chat')
        
    };

    render() {
        return (
            <React.Fragment>
                <div className="container top-margin">
                    <h3 className='intro'>Kategorier</h3>
                   
                     <Link to="/aida/exempel" >Vanliga ärenden  <MdKeyboardArrowRight/></Link>
                   
                   <div className='catDisplay'>
                            {values.map((value) => (
                                    <React.Fragment key={value.name}>
                                     <Button className="agreeBtn" variant="primary" onClick={this.sendValues} value={value.name}>{value.name}</Button>
                                    </React.Fragment>
                                ))}  
                    </div>

                </div>
            </React.Fragment>
        )
    };
};

Categories.propTypes = {
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendStart })(Categories);