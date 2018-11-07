import _ from 'lodash';
import RatesService from '../services/RatesService'

export const FETCH_STANDARD_RATES = 'FETCH_STANDARD_RATES';
export const FETCH_SPECIAL_RATES = 'FETCH_SPECIAL_RATES';
export const FETCH_DISCOUNT = 'FETCH_DISCOUNT';
export const FETCH_ALL_RATES = 'FETCH_ALL_RATES';
export const FETCH_UNIT_RATES = 'FETCH_UNIT_RATES';
export const FETCH_UNIT_SELECTED = 'FETCH_UNIT_SELECTED';
export const UPDATE_STANDARD_RATES = 'UPDATE_STANDARD_RATES';
export const UPDATE_DISCOUNT = 'UPDATE_DISCOUNT';
export const CREATE_SPECIAL_RATES = 'CREATE_SPECIAL_RATES';
export const UPDATE_SPECIAL_RATES = 'UPDATE_SPECIAL_RATES';
export const DELETE_SPECIAL_RATES = 'DELETE_SPECIAL_RATES';
export const FETCH_ACTIVE_DAYS = 'FETCH_ACTIVE_DAYS';
export const FETCH_ACCORDION_OPEN = 'FETCH_ACCORDION_OPEN';
export const CREATE_SPECIAL_RATES_ERROR = 'CREATE_SPECIAL_RATES_ERROR';

const service = new  RatesService();

export async function getAllRates(units){
    let promises = [];
    let data = {};
    promises =  units.map(function (value) {
        return Promise.all([
            service.getUnitStandardRate(value.id),
            service.getUnitSpecialRate(value.id),
            service.getUnitDiscount(value.id, '2MoreNightsDiscount'),
        ])
    });

    data = await Promise.all(promises)
    let newData = {};

    data.forEach(function (value, index) {
        let mergeArr = _.merge(value[0].data.data, value[1].data.data, value[2].data.data);
        newData[units[index].id] = mergeArr;
    });

    return {
        type: FETCH_ALL_RATES,
        payload: newData
    }

}

export async function getUnitRates(unitId){
    let data = {};

    data = await Promise.all([
        service.getUnitStandardRate(unitId),
        service.getUnitSpecialRate(unitId),
        service.getUnitDiscount(unitId, '2MoreNightsDiscount'),
    ])

    let newData = {};
    let mergeArr = _.merge(data[0].data.data, data[1].data.data, data[2].data.data);
    newData[unitId] = mergeArr;

    return {
        type: FETCH_UNIT_RATES,
        payload: newData
    }

}

export function getStandardRates(unitId){
    return service.getUnitStandardRate(unitId)
        .then((res) => {
            let data = {};
            data[unitId] = res;
            return {
                type: FETCH_STANDARD_RATES,
                payload: data
            }
        })
        .catch((error) => {
            return {
                type: FETCH_STANDARD_RATES,
                payload: error
            }
        })
}

export function getUnitDiscount(unitId,type){
    return service.getUnitDiscount(unitId,type)
        .then((res) => {
            let data = {};
            data[unitId] = res;
            return {
                type: FETCH_DISCOUNT,
                payload: data
            }
        })
        .catch((error) => {
            return {
                type: FETCH_DISCOUNT,
                payload: error
            }
        })
}

export function getSpecialRates(unitId){
    return service.getUnitSpecialRate(unitId)
        .then((res) => {
            let data = {};
            data[unitId] = res;
            return {
                type: FETCH_SPECIAL_RATES,
                payload: data
            }
        })
        .catch((error) => {
            return {
                type: FETCH_SPECIAL_RATES,
                payload: error
            }
        })
}

export function selectedRatesSidebar(unitId){
            return {
                type: FETCH_UNIT_SELECTED,
                payload: unitId
            }
}

export function updateStandardRates(unitId, rates){
    let data = {
        'data': rates
    }
    let rate = {
        'id': unitId,
        'data': rates
    };
    return service.updateStandardRates(unitId, data)
        .then((res) => {
            return {
                type: UPDATE_STANDARD_RATES,
                payload: rate
            }
        })
        .catch((error) => {
            return {
                type: UPDATE_STANDARD_RATES,
                payload: error
            }
        })
}

export function updateDiscount(unitId, disc){
    let data = {
        'data': {
            'discount': disc
        }
    }
    let discount = {
        'id': unitId,
        'data': disc
    };
    return service.updateDiscount(unitId, data)
        .then((res) => {
            return {
                type: UPDATE_DISCOUNT,
                payload: discount
            }
        })
        .catch((error) => {
            return {
                type: UPDATE_DISCOUNT,
                payload: error
            }
        })
}

export function createSpecialRates(unitId, rates){
    let data = {
        'data': rates
    }

    return service.createSpecialRates(unitId, data)
        .then((res) => {
            return service.getUnitSpecialRate(unitId)
                .then((res) => {
                    let rate = {
                     'id': unitId,
                     'data': res.data.data.list
                     };
                    return {
                        type: CREATE_SPECIAL_RATES,
                        payload: rate
                    }
                })
                .catch((error) => {
                    return {
                        type: FETCH_SPECIAL_RATES,
                        payload: error
                    }
                })
            /*return {
                type: CREATE_SPECIAL_RATES,
                payload: rate
            }*/
        })
        .catch((error) => {
            return {
                type: CREATE_SPECIAL_RATES_ERROR,
                payload: error.response.data.data.message
            }
        })
}

export function updateSpecialRates(id, unitId, rates){
    let data = {
        'data': rates
    }

    let rate = { id, unitId, 'data': rates}

    return service.updateSpecialRates(id, unitId, data)
        .then((res) => {
            return {
                type: UPDATE_SPECIAL_RATES,
                payload: rate
            }
        })
        .catch((error) => {
            return {
                type: UPDATE_SPECIAL_RATES,
                payload: error
            }
        })
}

export function deleteSpecialRates(unitId, id){
    let rate = {unitId, id};

    return service.deleteSpecialRates(unitId, id)
        .then((res) => {
            return {
                type: DELETE_SPECIAL_RATES,
                payload: rate
            }
        })
        .catch((error) => {
            return {
                type: DELETE_SPECIAL_RATES,
                payload: error
            }
        })
}

export function selectedActiveDays(unitId, data){
    let diff = data.diff;
    let checkIn = data.checkIn;
    let checkOut = data.checkOut;

    if(!data.checkOut){
        diff = 1
    }
    if(!data.checkIn){
        diff = 1;
        checkIn = data.checkOut
    }

    let active = {unitId, checkIn, checkOut, diff};
            return {
                type: FETCH_ACTIVE_DAYS,
                payload: active
            }

}

export function accordionOpen(){
            return {
                type: FETCH_ACCORDION_OPEN,
                payload: true
            }

}