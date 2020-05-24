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

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shouldRenderSuggestions() {
  return true;
}

function supportsMediaDevices() {
  return navigator.mediaDevices;
}

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return searchTerms.filter(language => regex.test(language.name));
}

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
      if (event.key === 'Enter' && this.state.value){
      let sender = this.props.user;
        let receiver = 'bot';
        let message = this.state.value;
        const rasaMsg = { sender, receiver, message};
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat#1')
    }
  }
  

renderInputComponent = inputProps => (
  <div className="inputSearchContainer">

 <label
     className={this.state.value ? "field-active" : ""}
     >
       Hej! Vad har du för symtom?
     </label>

    <IoIosSearch onClick={() => this.sendSearchValues()} className="searchIcon" /><input {...inputProps} /> {supportsMediaDevices() && <Link className="voiceIcon" aria-label="Röststyrning" to="/assistent/"><MdKeyboardVoice/></Link>}
  </div>
);


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
      if (!event.key === 'Enter' || !event.key){
        let sender = this.props.user;
        let receiver = 'bot';
        let message = suggestionValue;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat#step1')
      }
       
  };

   storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

 sendSearchValues = () => {
   if (this.state.value){
        let sender = this.props.user;
        let receiver = 'bot';
        let message = this.state.value;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat#step1')
   }
       
        
    };

    sendValues = (el) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = el.target.value;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/chat#step1')
        
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
            placeholder: 'Hej! Vad har du för symtom?',
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
                    ariaLabel="Hej! Vad har du för symtom?"
                    shouldRenderSuggestions={shouldRenderSuggestions}
                  />
                  <button onClick={() => this.sendSearchValues()}className="searchModalIcon" tabIndex="0" aria-label="Sök"><IoIosSearch className="searchIcon"/></button> 

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
                        <span itemProp="logo" itemType="http://schema.org/ImageObject"> 
<svg width="129px" height="129px" viewBox="0 0 129 129" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Prototype" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group-5" transform="translate(2.000000, 2.000000)">
            <path d="M62.5,125 C88.9624634,125 111.583793,108.554151 120.700804,85.3256359 C123.476078,78.2547358 125,70.5553335 125,62.5 C125,27.9822031 97.0177969,0 62.5,0 C27.9822031,0 0,27.9822031 0,62.5 C0,97.0177969 27.9822031,125 62.5,125 Z" id="Oval" stroke="#3875A8" stroke-width="4"></path>
            <circle id="Oval" fill="#3875A8" cx="47.5" cy="67.5" r="5.5"></circle>
            <circle id="Oval" fill="#3875A8" cx="61.5" cy="67.5" r="5.5"></circle>
            <circle id="Oval" fill="#3875A8" cx="75.5" cy="67.5" r="5.5"></circle>
            <path d="M25,96.0416306 L25,47.0416306 C25.24856,33.722196 36.1221285,23 49.5,23 C62.8778715,23 73.75144,33.722196 73.995799,47.0416817 L74,47.0416306 C87.3199008,47.2906634 98.0416306,58.1640499 98.0416306,71.5416306 C98.0416306,84.9192112 87.3199008,95.7925977 74.0008177,96.0374136 L74,96.0416306 L25,96.0416306 Z" id="Combined-Shape" stroke="#3875A8" stroke-width="4" transform="translate(61.520815, 59.520815) rotate(315.000000) translate(-61.520815, -59.520815) "></path>
        </g>
    </g>
</svg>
                    
                                            
                    </span> 
                    <p className="logoText">Symtomguiden</p>
                    </Link>
                    
                </h1> 


  <Media query={{ maxWidth: 599 }}>
          {matches =>
            matches ? (

          <div className="inputSearchContainer">
           <IoIosSearch className="searchIcon" />
            <input onChange={() => this.togglePopup()} onClick={() => this.togglePopup()} type="text" className="react-autosuggest__input" placeholder="Hej! Vad har du för symtom?" value={this.state.value} />
              
              {supportsMediaDevices() &&
              <Link className="voiceIcon" aria-label="Röststyrning" to="/assistent/">
              <MdKeyboardVoice/>
                  
                </Link>
            }
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
                    renderInputComponent={this.renderInputComponent}
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