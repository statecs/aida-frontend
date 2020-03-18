import React from 'react';
import ChatInput from './ChatInput';

const StepController = ({ stepInstance }) => {
    return (
        <React.Fragment>
            <button onClick={stepInstance.lastStep}>Nästa</button>
                <div className="inputContainer">
                    <ChatInput stepInstance={stepInstance} />
                </div>
        </React.Fragment>

  
    )

}

export default StepController;