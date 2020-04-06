import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendStart } from '../../actions/messageActions';
import './Home.css';
import {navigate, Link} from "@reach/router"
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { MdSearch } from "react-icons/md";
import searchTerms from './searchTerms';
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";

const values = [{
    name: "Jag har huvudvärk",
},
{
    name: "Jag har ont i halsen",
},
{
    name: "Jag har hosta och feber",

}];

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
      <span className="name"><MdSearch/> 
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
    <IoIosSearch className="searchIcon" /><input {...inputProps} /> <Link className="voiceIcon" aria-label="Röststyrning" to="/aida/"><MdKeyboardVoice/></Link>
  </div>
);

const renderSuggestionsContainer = ({ containerProps, children, query }) => (
     <div {...containerProps}>
      <span className="hidden"> Hej, vad söker du vård för?</span>
      {children}
         
   
     
    </div>
);

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            value: '',
            suggestions: []
        };
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onChange = (event, { newValue }) => {
        this.setState({
        value: newValue
        });
    };

   onKeyDown(event) {
       //On Enter submit form
    if (event.key === 'Enter' && this.state.value) {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = this.state.value;
        const rasaMsg = { sender, receiver, message};
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/aida/chat')
    }
  }
  
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
        navigate('/aida/chat')
  };

    sendValues = (el) => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = el.target.value;
        const rasaMsg = { sender, receiver, message };
        this.props.sendStart(sender, receiver, rasaMsg);
        navigate('/aida/chat')
        
    };

    render() {
        const { value, suggestions } = this.state;

         // Autosuggest will pass through all these props to the input.
    
        const inputProps = {
            placeholder: 'Hej, vad söker du vård för?',
            value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
        };

        
        return (
            <React.Fragment>
           
                <div className="container-home">
                 <h1 className="site-logo"> 
                    <Link to="/aida" itemProp="url"> 
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

                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    renderSuggestionsContainer={renderSuggestionsContainer}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderInputComponent={renderInputComponent}
                  />


                  <div className="exampleCases">
                    <p className='intro'>Vanliga ärenden</p>
                        <div className='cardDisplay'>
                            {values.map((value) => (
                                    <React.Fragment key={value.name}>
                                        <button className="exampleBtn" onClick={this.sendValues} value={value.name} type="submit">{value.name}</button>
                                    </React.Fragment>
                                ))}  
                        </div>
                      <Link to="/aida/exempel" className="intro"  aria-label="Visa fler"><p>Visa fler..</p></Link>
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