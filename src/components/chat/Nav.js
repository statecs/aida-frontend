import React from 'react';
/* eslint react/prop-types: 0 */
import styles from './nav.less';
import './nav.less';
import { MdKeyboardArrowUp } from "react-icons/md";
import ProgressBar from 'react-bootstrap/ProgressBar';

const Nav = (props) => {
    console.log(props);

    var now = 0;
    for (let i = 1; i <= props.currentStep; i += 1){
        now = (i*100) / props.totalSteps/3;
    } 

    return (
        <React.Fragment>
        {props.currentStep !== 1 && 
        <div className="backNav">
         <button onClick={props.previousStep}><MdKeyboardArrowUp/><br /><span>Ångra</span></button>
        </div> } 
        {props.currentStep === 1 &&
        <div className="backNav-none"></div>
        }
        <ProgressBar now={now} />
        
        </React.Fragment>
        
    );
};

export default Nav;