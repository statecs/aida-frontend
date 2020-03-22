import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';

import PopupForm from './components/dialogues/PopupForm';
import ChatPanel from './components/chat/ChatPanel';
import MyPanel from './components/page/MyPanel';
import Home from './components/home/Home';

import store from './store';
import { Router, Link } from "@reach/router"
import {Layout, Main, MenuItem, TopBar, SkipLink, Button} from 'cauldron-react'

let hasTransitioned = false // avoid focusing on the first render

const App = () => {

const [show, setShow] = useState(true);
const closePopupForm = () => setShow(false);

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
  
      <SkipLink skipText="Hoppa till" target={'#content'} targetText="Sidans innehåll" />     
      
       <Link to="/aida" tabIndex={-1} aria-label="Start"><Button>
              Start
            </Button></Link>
          <Link to="/aida/arenden" tabIndex={-1} aria-label="Mina ärenden" ><Button>
              Mina ärenden
            </Button></Link>
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
