import { FETCH_MESSAGES, SEND_MESSAGE, SET_LOADING } from './types';
import axios from 'axios';


export const setLoading = () => dispatch => {
    dispatch({
        type: SET_LOADING,
        payload: null
    });
};

export const sendMessage = (msgData) => dispatch => {
    // Actually posts to http://localhost:5005/webhooks... but we used ngrok to make it accessible via website
    dispatch({
        type: SET_LOADING,
        payload: null
    });
    if (msgData.message === "") {
        return;
    }
    axios.post('http://localhost/webhooks/rest/webhook', msgData)
        .then(res => {
            let msgText = "";
            let msgButtons = "";
            let botMsg = "";

            res.data.map((newMsg) => {
                msgText = msgText + newMsg.text + '\n';
                return msgText;
            });

            res.data.map((newButtons) => {
                msgButtons = newButtons.buttons;
                return msgButtons;
            });

            let userMsg = {sender: msgData.sender, receiver: 'bot', message: msgData.message};

            if (msgButtons) {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText, buttons: msgButtons};
            }  else {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText};
            }

            dispatch({
                type: SEND_MESSAGE,
                userMsg: userMsg,
                botMsg: botMsg
            });
        })
        .catch(err => console.log(err));
};