import { SEND_MESSAGE, SET_LOADING, BOTURL } from './types';
import axios from 'axios';

export const setLoading = () => dispatch => {
    dispatch({
        type: SET_LOADING,
        payload: null
    });
};

export const sendStart = (sender, receiver, msgData) => dispatch => {

     dispatch({
        type: SET_LOADING,
        payload: null
    });

   let message = "/restart"
   let msgDataRestart = {sender, receiver, message}

    axios.post(BOTURL, msgDataRestart)
      .then(res => {

    if (msgData.message === "") {
        return;
    }
    axios.post(BOTURL, msgData)
        .then(res => {
            if (res.data.length !== 0){
            let msgText = "";
            let msgButtons = "";
            let msgCustom = "";
            let botMsg = "";

            res.data.map((newMsg) => {
                if (newMsg.text){
                    msgText = msgText + newMsg.text + '\n';
                    return msgText;
                }
                return msgText;  
            });

            res.data.map((newButtons) => {
                msgButtons = newButtons.buttons;
                return msgButtons;
            });

             res.data.map((customType) => {
                msgCustom = customType.custom;
                return msgCustom;
            });
            let userMsg = {sender: msgData.sender, receiver: 'bot', message: msgData.message};

            if (msgButtons) {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText, buttons: msgButtons};
            }  else if (msgCustom) {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText, custom: msgCustom};
            } else {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText};
            }
             dispatch({
                type: SEND_MESSAGE,
                userMsg: userMsg,
                botMsg: botMsg
            });
            }
            else{
                    dispatch({
                    type: SEND_MESSAGE,
                });
            }

        })
        .catch(err => console.log(err));
 
          
      })
      .catch(err => console.log(err));
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
    axios.post(BOTURL, msgData)
        .then(res => {
            if (res.data.length !== 0){
            let msgText = "";
            let msgButtons = "";
            let msgCustom = "";
            let botMsg = "";

            res.data.map((newMsg) => {
                if (newMsg.text){
                    msgText = msgText + newMsg.text + '\n';
                    return msgText;
                }
                return msgText;  
            });

            res.data.map((newButtons) => {
                msgButtons = newButtons.buttons;
                return msgButtons;
            });

             res.data.map((customType) => {
                msgCustom = customType.custom;
                return msgCustom;
            });
            let userMsg = {sender: msgData.sender, receiver: 'bot', message: msgData.message};

            if (msgButtons) {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText, buttons: msgButtons};
            }  else if (msgCustom) {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText, custom: msgCustom};
            } else {
                botMsg = {sender: 'bot', receiver: msgData.sender, message: msgText};
            }
             dispatch({
                type: SEND_MESSAGE,
                userMsg: userMsg,
                botMsg: botMsg
            });
            }
            else{
                    dispatch({
                    type: SEND_MESSAGE,
                });
            }

        })
        .catch(err => console.log(err));
};

export const sendBack = (msgData) => dispatch => {

    axios.post(BOTURL, msgData)
        .catch(err => console.log(err));
};

