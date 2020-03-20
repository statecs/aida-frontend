import React, { Component, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messageActions';
import SelectableCard from './selectableCard/SelectableCard';
import './ValueSelection.css';
import Button from 'react-bootstrap/Button';
import useInitialFocus from '../hooks/useInitialFocus';

    //const mainRef = useRef(null);
     //useInitialFocus(mainRef);

let values = [{
    name: "Jag har huvudvärk",
},
{
    name: "Jag har ont i halsen",
},
{
    name: "Jag har hosta och feber",

}];

var maxValuesAllowed = 1;

class ValueSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenVals: [],
            value: '',
            numChosen: 0
        };
         //useInitialFocus(this.exampleRef);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    selectVal = (valName) => {
        let currentVals = this.state.chosenVals;
        let currentNum = this.state.numChosen;

        // Check if we are selecting or deselecting
        let isDeselect = this.state.chosenVals.includes(valName);

        if (isDeselect) {
            // Delete the entry from the array
            let newValsList = [...currentVals];
            let idx = newValsList.indexOf(valName);
            if (idx !== -1) {
                newValsList.splice(idx, 1);
                currentNum = currentNum - 1;
                this.setState({chosenVals: newValsList, numChosen: currentNum});
            }
        }
        else {
            if (currentNum === maxValuesAllowed) {
                let newValsList = [...currentVals, valName];
                newValsList.shift();
                this.setState({ chosenVals: newValsList });
            }
            else {
                let newValsList = [...currentVals, valName];
                currentNum = currentNum + 1;
                this.setState({ chosenVals: newValsList, numChosen: currentNum });
            }
        }
    };

    sendValues = () => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = this.state.chosenVals.join(', ');
        const rasaMsg = { sender, receiver, message };
        //Send message to rasa and get chatbot response
        this.props.sendMessage(rasaMsg);
    };

    sendFormValues = () => {
        let sender = this.props.user;
        let receiver = 'bot';
        let message = this.state.value;
        const rasaMsg = { sender, receiver, message };
        //Send message to rasa and get chatbot response
        this.props.sendMessage(rasaMsg);
    };

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <form action="" onSubmit={this.handleSubmit}>
                        <div data-widget="accessible-autocomplete">
                            
                            <input tabIndex="-1" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Hej, Vad söker du vård för?" id="search" />
                            <button onClick={this.sendFormValues} type="submit" id="submit">Sök</button>
                        </div>
                    </form>
                    <h3 className='intro' >Vanliga ärenden</h3>
                    <div className='cardDisplay'>
                        {values.map((value) => (
                            <div key={value.name}>
                                <SelectableCard isSelected={this.state.chosenVals.includes(value.name)} onClick={this.selectVal} title={value.name}/>
                            </div>
                        ))}
                    </div>
                    <Button disabled={this.state.numChosen !== maxValuesAllowed} onClick={this.sendValues} className="valSubmitBtn">Sök</Button>

                    <Button target='_blank' rel="noopener noreferrer" href="https://forms.gle/72kUUsRsk48VRuNUA">Ge feedback</Button>
                </div>

            </React.Fragment>
        )
    };
};

ValueSelection.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    user: state.sessionID.sessionID // Get unique session id to use for user each time page is loaded.
})

export default connect(mapStateToProps, { sendMessage })(ValueSelection);