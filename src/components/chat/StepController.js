import React from 'react';
import ChatInput from './ChatInput';

const StepController = ({ stepInstance }) => {
    return (
        <React.Fragment>
                <div className="inputContainer">
                    <ChatInput stepInstance={stepInstance} />
                </div>
        </React.Fragment>

  
    )

}

export default StepController;