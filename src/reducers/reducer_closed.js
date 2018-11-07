import { FETCH_CLOSED_ALL, FETCH_CLOSED_UNITS } from '../actions/close_open_action';

const initRate = {
    allClosed: {},
}

export default function (state = initRate, action) {
    switch  (action.type){
        case FETCH_CLOSED_ALL:
            return {...state,   allClosed: {...action.payload} }
        case FETCH_CLOSED_UNITS:
            let data = state.allClosed;
            data[action.payload.id] = action.payload.data.list
            return {...state,   allClosed: {...data} }
        default:
            return state;
    }
}

