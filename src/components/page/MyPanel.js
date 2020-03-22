import React, { Component } from 'react';
import './MyPanel.css';
import { Link } from "@reach/router"


class MyPanel extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h3 className='intro'>Mina ärenden</h3>
                    <Link href="#content" to="/aida/chat" aria-label="Gå till chatt" >
                            Gå till chatt
                    </Link>
                </div>
            </React.Fragment>
        )
    };
};

export default (MyPanel);