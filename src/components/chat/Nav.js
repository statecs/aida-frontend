import React from 'react';
/* eslint react/prop-types: 0 */
import styles from './nav.less';
import { MdKeyboardArrowUp } from "react-icons/md";

const Nav = (props) => {
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
};

export default Nav;