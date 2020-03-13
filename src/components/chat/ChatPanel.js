import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import './ChatPanel.css';

export default function ChatPanel() {
    return (
        <React.Fragment>
            <div className="outerContainer">
                <div className="container">
                    <ChatMessages />
                        <div className="inputContainer">
                    <ChatInput />
                </div>
                </div>
               

            </div>

        </React.Fragment>
    )
}