import React, { Component } from 'react';
import './MyPanel.css';
import {navigate} from "@reach/router"


class MyPanel extends Component {

 clearLocalStorage = () => {
     localStorage.clear();
     navigate('/')
     window.location.reload();
    };
    render() {
        return (
            <React.Fragment>
                <div className="container top-margin">
                    <h1 className='introPanel'>Mina ärenden</h1>
                    <div className="catDisplay">
                        <button onClick={() => {navigate('/chat')}}  className="agreeBtn " variant="primary" aria-label="Gå till chatt"> Gå till chatt</button>
                        <button onClick={() => {this.clearLocalStorage()}}  className="agreeBtn call-btn" variant="primary" aria-label="Logga ut" >Avsluta</button>
                    </div>
                </div>
            </React.Fragment>
        )
    };
};

export default (MyPanel);