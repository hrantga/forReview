import { FETCH_HOTEL, FETCH_YEAR, FETCH_MONTH, FETCH_TODAY, FETCH_WEEK, FETCH_UNITS, FETCH_UNITS_FROM_TO, ADD_RESERVATION, FETCH_RESERVATIONS, FROM_TO_BUSY, FETCH_PICKER } from '../actions/calendar_actions';
import _ from 'lodash';
import moment from 'moment';

const testData = {
    date: moment(),
    pikerDate: moment(),
    hotel: {},
    units: [],
    unitsFromTo: {},
    reservations: {},
    fromToBusy: false
}

export default function (state = testData, action) {
    switch  (action.type){
        case FETCH_HOTEL:
            return {...state, hotel:action.payload}
        case FETCH_UNITS:
            return {...state, units: [ ...action.payload.list]}
        case ADD_RESERVATION:
            let data = state.unitsFromTo.concat(action.payload)
            let result = _.chain(data)
                .groupBy(function (e) {
                    return e.id;
                })
                .map(function (group) {
                    return _.reduce(group, function (current, next) {
                        return {
                            id: next.id,
                            name: next.name,
                            days: current.days.concat(next.days)
                        };
                    });
                })
                .value();
            return {...state, unitsFromTo: [ ...result]}
        case FETCH_UNITS_FROM_TO:
            return {...state, unitsFromTo: action.payload.units}
        case FROM_TO_BUSY:
            return {...state, fromToBusy: action.payload}
        case FETCH_RESERVATIONS:
            return {...state, reservations: action.payload}
        case FETCH_YEAR:
            return {...state, date: action.payload}
        case FETCH_TODAY:
            return {...state, date: action.payload}
        case FETCH_MONTH:
            return {...state, date: action.payload}
        case FETCH_WEEK:
            return {...state, date: action.payload}
        case FETCH_PICKER:
            return {...state, pickerDate: action.payload}
        default:
            return state;
    }
}

