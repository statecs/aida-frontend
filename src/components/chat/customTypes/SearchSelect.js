import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage, sendStart } from '../../../actions/messageActions';
import {Link} from "@reach/router"
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { MdKeyboardVoice } from "react-icons/md";
import { AiOutlineEnter } from "react-icons/ai";
import './SearchSelect.css';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shouldRenderSuggestions() {
  return true;
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
  <div className={'suggestion-content-search'}>
      <span className="name">
        {
          parts.map((part, index) => {
            const className = part.highlight ? "highlight" : null;

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
    </div>
)
}


class SearchSelect extends Component {

 constructor(props) {
        super(props);
        this.state = {
            value: '',
            error: false, 
            suggestions: [],
        };


this.onKeyDown = this.onKeyDown.bind(this);

    }


 supportsMediaDevices = () => {
        return navigator.mediaDevices;
    }

getSuggestions = value => {

  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return this.props.msg.custom.options.filter(language => regex.test(language.name));
}


renderInputComponent = inputProps => (
  <div className="inputSearchContainer">
   <input {...inputProps} />   <div className="voiceIcon">
                            {this.supportsMediaDevices() && 
                                <Link aria-label="Röststyrning" to="/assistent/"><MdKeyboardVoice/></Link>
                                }</div> 
   
                                 <button onClick={() => this.sendSearch()} className="searchIcon" aria-label="Nästa fråga">  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                                
                               
  </div>
);


   // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };f

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

    onSuggestionSelected = (event, { suggestionValue }) => {
      if (!event.key === 'Enter' || !event.key){
        let sender = this.props.user;
        let receiver = 'bot';
        let message = suggestionValue;
        const rasaMsg = { sender, receiver, message };
        this.props.sendMessage(rasaMsg);
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
        this.props.sendMessage(rasaMsg);
   }
 }

    sendSearch = () => {
    if (this.state.value){
            let sender = this.props.user;
            let receiver = 'bot';
            let message = this.state.value;
            const rasaMsg = { sender, receiver, message };
            this.props.sendMessage(rasaMsg);
      }
      else {
          this.setState({ error: true });
      }
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
        this.props.sendMessage(rasaMsg);
    }
  }
  
       
 

    render() {
       const { value, suggestions } = this.state;

         // Autosuggest will pass through all these props to the input.
    
        const inputProps = {
            placeholder: 'Skriv ett svar...',
            value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
            autoFocus: true, 
            className:"textArea search-input",

        };

  	 
        return (
         <React.Fragment>

{this.state.error &&

            <div className="form__field form__field--page-error form__field--boxed" tabindex="-1" role="alert" id="page-error-message">
            <p>Du har missat att svara på frågan.</p>

       
            </div>
    }
    
  <div className="inputSearchContainer">



   <Autosuggest
        autoFocus
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderInputComponent={this.renderInputComponent}
                    ref={this.storeInputReference}
                    shouldRenderSuggestions={shouldRenderSuggestions}
                  />

              


</div>


  </React.Fragment>
      )
    }
}

SearchSelect.propTypes = {
    messages: PropTypes.array.isRequired,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func
};


const mapStateToProps = state => ({
    user: state.sessionID.sessionID,
    messages: state.messages.messages,
    loading: state.messages.loading
})

export default connect(mapStateToProps, { sendMessage, sendStart })(SearchSelect);