import React from 'react';
/* eslint react/prop-types: 0 */
import styles from './nav.less';
import {Button} from 'cauldron-react'

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
         <p><Button onClick={props.previousStep}>Tillbaka</Button></p>
        } 
        </div>
    );
};

export default Nav;