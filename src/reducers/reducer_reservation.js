import { ADD_UNIT, CLEAR_UNIT, UPDATE_UNIT, GUEST_DETAILS, PAYMENT_DETAILS, REMOVE_UNIT, FETCH_PRICE, RESET_ALL, REMOVE_RESERVED_UNIT } from '../actions/reservation_actions';
const reservation= {
    units: [],
    guestDetails: [],
    paymentDetails: {},
    priceData: {}
}
export default function (state = reservation, action) {
    switch  (action.type){
        case UPDATE_UNIT:
            state.units[action.payload.index] = {
                ...state.units[action.payload.index],
                ...action.payload.unit
            }
            return {
                ...state
            }
        case REMOVE_UNIT:
            let units = [...state.units];
            units.splice(action.payload, 1);

            return {...state, units: units}
        case REMOVE_RESERVED_UNIT:
            return {...state, units: action.payload}
      case RESET_ALL:
          return {...state, guestDetails: {}, paymentDetails: {}, units: []}
        case ADD_UNIT:
            return {...state,  units: state.units.concat(action.payload.unit)}
        case CLEAR_UNIT:
            return {...state,  units: action.payload}
        case GUEST_DETAILS:
            return {...state, guestDetails: {...action.payload}}
        case PAYMENT_DETAILS:
            return {...state, paymentDetails: {...action.payload}}
        case FETCH_PRICE:
            return {...state, priceData: {...action.payload}}
        default:
            return state;
    }
}

