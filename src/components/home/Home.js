import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendStart } from '../../actions/messageActions';
import './Home.css';
import {navigate, Link} from "@reach/router"
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { MdArrowBack } from "react-icons/md";
import searchTerms from '../../actions/searchTerms';
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import Feedback from './Feedback';
import Modal from 'react-bootstrap/Modal';
import Media from 'react-media';

function supportsMediaDevices() {
  return navigator.mediaDevices;
}

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : searchTerms.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Render suggestions.
const renderSuggestion = (suggestion, { query, suggestionValue }) => {
 
const suggestionText = `${suggestion.name}`;
  const matches = match(suggestionText, query);
  const parts = parse(suggestionText, matches);

return(
  <div className={'suggestion-content'}>
      <span className="name"><IoIosSearch  className="searchInputIcon"/> 
        {
          parts.map((part, index) => {
            const className = part.highlight ? null : 'highlight';

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
    </div>
)
}


const renderInputComponent = inputProps => (
  <div className="inputSearchContainer">
    <IoIosSearch className="searchIcon" /><input {...inputProps} /> {supportsMediaDevices() && <Link className="voiceIcon" aria-label="Röststyrning" to="/assistent/"><MdKeyboardVoice/></Link>}
  </div>
);

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            value: '',
            suggestions: [],
            active: false,
            shuffledTerms: [],
            searchModal: false
        };
        this.onKeyDown = this.onKeyDown.bind(this);

        this.shuffledTerms = this.shuffleArray();
        
    }

 shuffleArray() {
      let i = searchTerms.length - 1;
      for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = searchTerms[i];
        searchTerms[i] = searchTerms[j];
        searchTerms[j] = temp;
      }

      return searchTerms;
    }

    componentDidMount() {

     this.setState({
        shuffledTerms : this.shuffledTerms
    })

    this.intervalId = setInterval(() => {
      this.shuffledTerms = this.shuffleArray();

     this.setState({
        shuffledTerms : this.shuffledTerms
        })

  }, 7000);


  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

    onChange = (event, { newValue }) => {
        this.setState({
        value: newValue
        });
    };

   onKeyDown(event) {
       //On Enter submit form
    if (!event) {
      if(this.state.value){
            let sender = this.props.user;
            let receiver = 'bot';
            let message = this.state.value;
            const rasaMsg = { sender, receiver, message};
            this.props.sendStart(sender, receiver, rasaMsg);
            navigate('/chat')
      }
      
    } else if (event.key === 'Enter' && this.state.value){
      let sender = this.props.user;
        let receiver = 'bot';
        let message = this.state.value;
        const rasaMsg = { sender, receiver, message};
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat')
    }
  }
  

renderInputMobileComponent = inputProps => (
  <React.Fragment>
  <div className="inputSearchContainer">
   <input {...inputProps} />
  </div>
  </React.Fragment>
);

   // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

    onSuggestionSelected = (event, { suggestionValue }) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = suggestionValue;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat')
  };

   storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };
    sendValues = (el) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = el.target.value;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat')
        
    };

   togglePopup() {
          if (this.state.searchModal){
              this.setState({
                  searchModal : false
              })

               setTimeout(() => {
              this.input.blur();
          }, 1);

          } else{
            
            setTimeout(() => {
              this.input.focus();
          }, 1);
    
              this.setState({
                  searchModal : true
              })
          }
          
        }
    render() {
        const { value, suggestions } = this.state;

         // Autosuggest will pass through all these props to the input.
    
        const inputProps = {
            placeholder: 'Hej! Vad söker du?',
            value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
            autoFocus: true
        };

        return (
            <React.Fragment>
                
      <Media query={{ maxWidth: 599 }}>
              {matches =>
                matches ? (
                  <Modal
                  className="searchModal"
                  size="lg"
                  show={this.state.searchModal}
                  autoFocus={false}
                  onHide={() => this.togglePopup()}
                  aria-labelledby="example-modal-sizes-title-sm"
          >
          <Modal.Body>

         <button className="backIcon" tabIndex="0" aria-label="Tillbaka" onClick={() => this.togglePopup()}><MdArrowBack className="searchIcon"/></button> 
   
        <Autosuggest
        autoFocus
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderInputComponent={this.renderInputMobileComponent}
                    ref={this.storeInputReference}
                    alwaysRenderSuggestions={true}
                  />
                  <button className="searchModalIcon" tabIndex="0" aria-label="Sök" onClick={() => this.onKeyDown()}><IoIosSearch className="searchIcon"/></button> 

</Modal.Body>
      </Modal>

            ) : (
              <span/>
            )
          }
        </Media>
            <Feedback />
                <div className="container-home">
                 <h1 className="site-logo"> 
                    <Link to="/" itemProp="url"> 
                        <span itemProp="logo" itemType="http://schema.org/ImageObject" aria-label="Symptomkollen"> 
                    <svg width="120px" height="120px" viewBox="0 0 129 129" version="1.1">
                        <g id="Prototype" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Second-screen" transform="translate(-224.000000, -184.000000)">
                                <g id="Group-5" transform="translate(226.000000, 186.000000)">
                                    <circle id="Oval" stroke="#979797" strokeWidth="4" cx="62.5" cy="62.5" r="62.5"></circle>
                                    <circle id="Oval" fill="#979797" cx="47.5" cy="67.5" r="5.5"></circle>
                                    <circle id="Oval" fill="#979797" cx="61.5" cy="67.5" r="5.5"></circle>
                                    <circle id="Oval" fill="#979797" cx="75.5" cy="67.5" r="5.5"></circle>
                                    <path d="M25,96.0416306 L25,47.0416306 C25.24856,33.722196 36.1221285,23 49.5,23 C62.8778715,23 73.75144,33.722196 73.995799,47.0416817 L74,47.0416306 C87.3199008,47.2906634 98.0416306,58.1640499 98.0416306,71.5416306 C98.0416306,84.9192112 87.3199008,95.7925977 74.0008177,96.0374136 L74,96.0416306 L25,96.0416306 Z" id="Combined-Shape" stroke="#979797" strokeWidth="4" transform="translate(61.520815, 59.520815) rotate(315.000000) translate(-61.520815, -59.520815) "></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                                            
                    </span> 
                    </Link>
                </h1> 


  <Media query={{ maxWidth: 599 }}>
          {matches =>
            matches ? (

          <div class="inputSearchContainer">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="searchIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
              <input onChange={() => this.togglePopup()} onClick={() => this.togglePopup()}  type="text" class="react-autosuggest__input" placeholder="Hej! Vad söker du?" value={this.state.value} />
              
              <a class="voiceIcon" aria-label="Röststyrning" href="/assistent/">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
                  </svg>
                </a>
          </div>

            ) : (
              <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderInputComponent={renderInputComponent}
                  />
            )
          }
        </Media>


                  <div className="exampleCases">
                    <p className='intro'>Vanliga ärenden</p>
                        <div className='cardDisplay'>
                               {this.state.shuffledTerms.slice(0, 3).map((value) => (
                               <React.Fragment key={value.name}>
                                  <button className="exampleBtn" onClick={this.sendValues} value={value.name} type="submit">{value.name}</button>
                                 </React.Fragment>
                               ))}
                        </div>
                      <Link to="/exempel" className="intro"  aria-label="Visa fler"><p>Visa fler..</p></Link>
                  </div>
              </div>

            </React.Fragment>
        )
    };
};

Home.propTypes = {
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendStart })(Home);