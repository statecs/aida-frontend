import React, { useRef, useEffect } from 'react';
import './App.css';
import { Provider } from 'react-redux';

import PopupForm from './components/dialogues/PopupForm';
import ChatPanel from './components/chat/ChatPanel';
import MyPanel from './components/page/MyPanel';
import Home from './components/home/Home';
import { TiHome } from "react-icons/ti";
import { IoIosChatbubbles } from "react-icons/io";

import store from './store';
import { Router, Link } from "@reach/router"
import {Layout, Main} from 'cauldron-react'

let hasTransitioned = false // avoid focusing on the first render

const HidePopup = localStorageKey => {
  const [show, setShow] = React.useState(
    localStorage.getItem(localStorageKey) || true
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, show);
  });
  return [JSON.parse(show), setShow];
};

const App = () => {
 const [show, setShow] = HidePopup(
    'showPopup'
  );

  var closePopupForm = () => setShow(false);   


 const mainRef = useRef()
  // remove tabindex on blur of main so we don't
  // get excess focus rings when the user clicks
  // anywhere inside of the main content
  const onMainBlur = () => {
    if (!mainRef.current) {
      return
    }
    mainRef.current.removeEventListener('blur', onMainBlur)
    mainRef.current.removeAttribute('tabindex')
  }
  const focusMain = () => {
    
    // avoid messing with focus on a real page load
    if (!hasTransitioned) {
      hasTransitioned = true
      return
    }

    if (!mainRef.current) {
      return
    }

    mainRef.current.tabIndex = -1
    mainRef.current.focus()
    mainRef.current.addEventListener('blur', onMainBlur)
  }

  useEffect(() => {
    if (!mainRef.current) {
      return
    }

    mainRef.current.addEventListener('blur', onMainBlur)
  })

    return (
     <React.Fragment>
      <Provider store={store}>
      <PopupForm show={show} handleClose={closePopupForm}/>
  
 
        <nav className="dqpl-skip-container">
          <a href="#content" className="dqpl-skip-link">Hoppa till sidans innehåll
          </a>
        </nav>
      
      
         <div className="navContainer">
            <Link to="/aida" className="icons"  aria-label="Start">
              <TiHome />

            </Link>
    
        
            <Link to="/aida/arenden" className="icons chatIcon" aria-label="Mina ärenden">
              <IoIosChatbubbles/>
            </Link>
      
      </div>
        <Layout>
          <Main
            aria-labelledby="main-heading"
            id="content"
          >
          
          <Router>
            <Home path="/aida" render={() => {focusMain()}} />
            <ChatPanel path="/aida/chat" render={() => {focusMain()}} />
            <MyPanel path="/aida/arenden" render={() => {focusMain()}} />
          </Router>
        
          </Main>
          </Layout>
           
        </Provider>
        </React.Fragment>
     
    );
}

export default App;
