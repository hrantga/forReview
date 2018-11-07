import CalendarService from '../services/CalendarService';
import moment from 'moment';

export const ADD_UNIT = 'ADD_UNIT';
export const UPDATE_UNIT = 'UPDATE_UNIT';
export const REMOVE_UNIT = 'REMOVE_UNIT';
export const PAYMENT_DETAILS = 'PAYMENT_DETAILS';
export const GUEST_DETAILS = 'GUEST_DETAILS';
export const CLEAR_UNIT = 'CLEAR_UNIT';
export const FETCH_PRICE = 'FETCH_PRICE';
export const FETCH_PRICE_ERROR = 'FETCH_PRICE_ERROR';
export const RESET_ALL = 'RESET_ALL';
export const REMOVE_RESERVED_UNIT = 'REMOVE_RESERVED_UNIT';

const service = new  CalendarService();

export function addUnit(units, unit, index){
    unit.checkIn =  moment(unit.checkIn._d).format('YYYY/MM/DD');
    unit.checkOut =  moment(unit.checkOut._d).format('YYYY/MM/DD');
    let  data = {
        'index': units.length,
         'unit': unit
    };
    return {
        type: ADD_UNIT,
        payload: data
    }
}

export function calculatePrice(unitId, data){

    return service.calculatePrice(unitId, data)
        .then((res) => {
            return {
                type: FETCH_PRICE,
                payload: res.data.data
            }
        })
        .catch((error) => {
            return {
                type: FETCH_PRICE_ERROR,
                payload: error
            }
        })
}

export function clearUnis(){
    let data = [];
    return {
        type: CLEAR_UNIT,
        payload: data
    }
}

export function updateUnit(unit,index){
    unit.checkIn =  moment(unit.checkIn._d).format('YYYY/MM/DD');
    unit.checkOut =  moment(unit.checkOut._d).format('YYYY/MM/DD');
    let  data = {
        'index': index,
         'unit': unit
    };
    return {
        type: UPDATE_UNIT,
        payload: data
    }
}

export function removeUnit(index){
    return {
        type: REMOVE_UNIT,
        payload: index
    }
}

export function removeReservedUnit(index, data, units){
    units.forEach(function (value) {
        data.unit.units.push(value);
    })
    data.unit.units.splice(index, 1);
    return {
        type: REMOVE_RESERVED_UNIT,
        payload: data
    }
}

export function guestDetails(data){
    return {
        type: GUEST_DETAILS,
        payload: data
    }
}
export function paymentDetails(data){
    return {
        type: PAYMENT_DETAILS,
        payload: data
    }
}

export function resetAllDate(){
    return {
        type: RESET_ALL,
        payload: ''
    }
}
