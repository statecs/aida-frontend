import React, { Component } from 'react';
import './MyPanel.css';
import {navigate} from "@reach/router"


class MyPanel extends Component {

 clearLocalStorage = () => {
     localStorage.clear();
     navigate('/aida/')
     window.location.reload();
    };
    render() {
        return (
            <React.Fragment>
                <div className="container top-margin">
                    <h3 className='intro'>Mina ärenden</h3>
                    <div className="catDisplay">
                        <button onClick={() => {navigate('/aida/chat')}}  className="agreeBtn " variant="primary" aria-label="Gå till chatt" > Gå till chatt</button>
                        <button onClick={() => {this.clearLocalStorage()}}  className="agreeBtn call-btn" variant="primary" aria-label="Logga ut" >Logga ut</button>
                    </div>
                </div>
            </React.Fragment>
        )
    };
};

export default (MyPanel);