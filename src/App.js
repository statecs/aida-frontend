import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';

import PopupForm from './components/dialogues/PopupForm';
import ChatPanel from './components/chat/ChatPanel';

import store from './store';
import ValueSelection from './components/valueSelection/ValueSelection';

class App extends Component {
  state = {
    showPopupForm: false,
    showValueSelect: true
  };

  closePopupForm = () => {
    this.setState({ showPopupForm: false });
  };

  exitValueSelect = () => {
    this.setState({ showValueSelect: false });
  };

  render() {
    let content;
    if (this.state.showValueSelect===false) {
      content = <ChatPanel />;
    }
    else {
      content = <ValueSelection exitValueSelect={this.exitValueSelect} />;
    }
    return (
      <Provider store={store}>
        <div>
          <header className="App-header">

          </header>
          <PopupForm show={this.state.showPopupForm} handleClose={this.closePopupForm} />
          {content}
        </div>
      </Provider>
    );
  }
}

export default App;
