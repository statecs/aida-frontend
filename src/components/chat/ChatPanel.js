import React from 'react';
import ChatMessages from './ChatMessages';
import './ChatPanel.css';

export default function ChatPanel() {
    return (
        <React.Fragment>
            <div className="outerContainer">
                <div className="container">
                    <ChatMessages /> 
                </div>
            </div>
        </React.Fragment>
    )
}