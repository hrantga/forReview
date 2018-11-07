import ClosedService from '../services/CloseOpenService'

export const FETCH_CLOSED_ALL = 'FETCH_CLOSED_ALL';
export const FETCH_SPECIAL_RATES = 'FETCH_SPECIAL_RATES';
export const FETCH_DISCOUNT = 'FETCH_DISCOUNT';
export const FETCH_ALL_RATES = 'FETCH_ALL_RATES';
export const CREATE_CLOSED_UNITS = 'CREATE_CLOSED_UNITS';
export const FETCH_CLOSED_UNITS = 'FETCH_CLOSED_UNITS';
export const UPDATE_CLOSED_UNITS = 'UPDATE_CLOSED_UNITS';
export const REMOVE_CLOSED_UNITS = 'REMOVE_CLOSED_UNITS';


const service = new  ClosedService();

export async function getAllClosed(units){
    let promises = [];
    let data = {};
    units.forEach(function (value) {
        promises.push(service.getClosedUnits(value.id))
    });

    data = await Promise.all(promises)
    let newData = {};

    data.forEach(function (value, index) {
        newData[units[index].id] = value.data.data.list;
    });

    return {
        type: FETCH_CLOSED_ALL,
        payload: newData
    }

}

export function createClosedUnits(unitId, units){
    let data = {
        'data': {
            "title": units.title,
            "dateFrom": units.From,
            "dateTo": units.To
        }
    }

    return service.createClosedUnits(unitId, data)
        .then((res) => {
           return service.getClosedUnits(unitId)
                .then((res) => {
                    let closed = {
                        'id': unitId,
                        'data': res.data.data
                    };
                    return {
                        type: FETCH_CLOSED_UNITS,
                        payload: closed
                    }
                })
                .catch((error) => {
                    return {
                        type: FETCH_CLOSED_UNITS,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: CREATE_CLOSED_UNITS,
                payload: error
            }
        })
}

export function updateClosedUnit(unitId, units, id){
    let data = {
        'data': {
            "title": units.title,
            "dateFrom": units.From,
            "dateTo": units.To
        }
    }

    return service.updateClosedUnit(unitId, data, id)
        .then((res) => {
           return service.getClosedUnits(unitId)
                .then((res) => {
                    let closed = {
                        'id': unitId,
                        'data': res.data.data
                    };
                    return {
                        type: FETCH_CLOSED_UNITS,
                        payload: closed
                    }
                })
                .catch((error) => {
                    return {
                        type: FETCH_CLOSED_UNITS,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: UPDATE_CLOSED_UNITS,
                payload: error
            }
        })
}

export function removeClosedUnit(unitId, id){

    return service.deleteClosedUnit(unitId, id)
        .then((res) => {
           return service.getClosedUnits(unitId)
                .then((res) => {
                    let closed = {
                        'id': unitId,
                        'data': res.data.data
                    };
                    return {
                        type: FETCH_CLOSED_UNITS,
                        payload: closed
                    }
                })
                .catch((error) => {
                    return {
                        type: FETCH_CLOSED_UNITS,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: REMOVE_CLOSED_UNITS,
                payload: error
            }
        })
}
