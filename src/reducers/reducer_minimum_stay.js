import { FETCH_MINIMUM_STAY, FETCH_PERIODIC_MINIMUM_STAY, FETCH_SPECIAL_MINIMUM_STAY } from '../actions/minimum_stay_action';
const initState= {
    minimumStay: {},
    periodicMinimumStay: {},
    specialMinimumStay: {},

}

export default function (state = initState, action) {
    switch  (action.type){
        case FETCH_MINIMUM_STAY:
            return {...state, minimumStay: action.payload}
        case FETCH_PERIODIC_MINIMUM_STAY:
            return {...state, periodicMinimumStay: action.payload}
        case FETCH_SPECIAL_MINIMUM_STAY:
            return {...state, specialMinimumStay: action.payload}
        default:
            return state;
    }
}

