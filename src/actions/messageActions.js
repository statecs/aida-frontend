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
    axios.post('http://localhost/webhooks/rest/webhook', msgData)
        .then(res => {
            let msgText = "";
            res.data.map((newMsg) => {
                msgText = msgText + newMsg.text + '\n';
                return msgText;
            });
            let userMsg = {sender: msgData.sender, receiver: 'Bot', message: msgData.message};
            let botMsg = {sender: 'Bot', receiver: msgData.sender, message: msgText};

            dispatch({
                type: SEND_MESSAGE,
                userMsg: userMsg,
                botMsg: botMsg
            });
        })
        .catch(err => console.log(err));
};