import { FETCH_MESSAGES, SEND_MESSAGE, SET_LOADING } from '../actions/types';

const initialState = {
    messages: [{ id: 1, sender: 'bot', receiver: 'User', message: 'Hej, mitt namn är Aida! Vad söker du vård för?' }],
    numMsgs: 1,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_MESSAGES:
            return {
                ...state,
                items: action.payload
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case SEND_MESSAGE:
            let num = state.numMsgs;
            return {
                ...state,
                numMsgs: state.numMsgs + 2,
                loading: false,
                messages: [...state.messages, { ...action.userMsg, id: num + 1 }, { ...action.botMsg, id: num + 2 }]
            };
        default:
            return state;
    }
}