import React, { Component } from 'react';
import './MyPanel.css';
import { Link } from "@reach/router"
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
                <div className="container">
                    <h3 className='intro'>Mina ärenden</h3>
                    <Link href="#content" to="/aida/chat" aria-label="Gå till chatt" >
                            Gå till chatt
                    </Link>
                    
                    <button onClick={() => {this.clearLocalStorage()}} aria-label="Logga ut">
                            Logga ut
                    </button>
                </div>
            </React.Fragment>
        )
    };
};

export default (MyPanel);