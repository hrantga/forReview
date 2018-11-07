import { FETCH_DISCOUNT, FETCH_ACTIVE_DAYS, FETCH_SPECIAL_RATES, FETCH_STANDARD_RATES, FETCH_ALL_RATES, FETCH_UNIT_RATES, FETCH_UNIT_SELECTED, UPDATE_STANDARD_RATES,CREATE_SPECIAL_RATES_ERROR, UPDATE_DISCOUNT, CREATE_SPECIAL_RATES, DELETE_SPECIAL_RATES, UPDATE_SPECIAL_RATES, FETCH_ACCORDION_OPEN } from '../actions/rates_action';

const initRate = {
    standardRates:[],
    discount: [],
    specialRates: [],
    specialRatesError: '',
    allRates: {},
    unitRates: [],
    selectedUnit: undefined,
    activeDays: {},
    accordionOpen: false
}

export default function (state = initRate, action) {
    switch  (action.type){
        case FETCH_ALL_RATES:
            return {...state,   allRates: {...action.payload}, specialRatesError: '' }
        case FETCH_ACTIVE_DAYS:
            return {...state,   activeDays: {...action.payload} }
        case FETCH_ACCORDION_OPEN:
            return {...state,   accordionOpen: action.payload }
        case FETCH_UNIT_RATES:
            return {...state,   unitRates: {...action.payload} }
        case FETCH_STANDARD_RATES:
            return {...state,   standardRates: state.standardRates.concat(action.payload) }
        case FETCH_SPECIAL_RATES:
            return {...state, specialRates: state.specialRates.concat(action.payload), specialRatesError: '' }
        case FETCH_DISCOUNT:
            return {...state, discount: state.discount.concat(action.payload) }
        case FETCH_UNIT_SELECTED:
            return {...state, selectedUnit: action.payload }
        case UPDATE_STANDARD_RATES:
           let newRates =  {...state.allRates};
            newRates[action.payload.id].endWeek = action.payload.data.endWeek;
            newRates[action.payload.id].midWeek = action.payload.data.midWeek;
            return {...state, allRates: {...newRates} }
        case UPDATE_DISCOUNT:
           let newDisc =  {...state.allRates};
            newDisc[action.payload.id].discount = action.payload.data;
            return {...state, allRates: {...newDisc} }
        case CREATE_SPECIAL_RATES:
           let newSpecial =  {...state.allRates};
           newSpecial[action.payload.id].list = action.payload.data
           return {...state, allRates: {...newSpecial}, activeDays: {} }
        case CREATE_SPECIAL_RATES_ERROR:
           return {...state, specialRatesError: action.payload }
        case UPDATE_SPECIAL_RATES:
            let newSpecialUpdate =  {...state.allRates};
            let listUpdate = newSpecialUpdate[action.payload.unitId].list.map(function (value) {
                if(value.id === action.payload.id){
                    value = action.payload.data;
                }
                return value;
            })
            newSpecialUpdate[action.payload.unitId].list = listUpdate ;
            return {...state, allRates: {...newSpecialUpdate}, activeDays: {}, specialRatesError: '' }
        case DELETE_SPECIAL_RATES:
           let newSpecialDelete =  {...state.allRates};
           let listDelete = newSpecialDelete[action.payload.unitId].list.filter(special => special.id !== action.payload.id);
           newSpecialDelete[action.payload.unitId].list = listDelete ;
           return {...state, allRates: {...newSpecialDelete} }
        default:
            return state;
    }
}

