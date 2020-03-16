import React from 'react';
/* eslint react/prop-types: 0 */
import styles from './nav.less';
import ChatInput from './ChatInput';

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
        
    
        <div className={styles.nav}>{dots}
         <p><button onClick={props.previousStep}>Tillbaka</button></p>
           <p><button onClick={props.lastStep}>Nästa</button></p>


        </div>
    );
};

export default Nav;