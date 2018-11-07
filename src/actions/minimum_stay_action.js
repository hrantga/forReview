import MinimumStayService from '../services/MinimumStayService';

export const FETCH_MINIMUM_STAY = 'FETCH_MINIMUM_STAY';
export const FETCH_MINIMUM_STAY_ERROR = 'FETCH_MINIMUM_STAY_ERROR';
export const MIN_STAY_ERROR = 'MIN_STAY_ERROR';
export const FETCH_PERIODIC_MINIMUM_STAY = 'FETCH_PERIODIC_MINIMUM_STAY';
export const UPDATE_PERIODIC_MINIMUM_STAY = 'UPDATE_PERIODIC_MINIMUM_STAY';
export const FETCH_SPECIAL_MINIMUM_STAY = 'FETCH_SPECIAL_MINIMUM_STAY';

const service = new  MinimumStayService();


export function getUnitMinimumStay(id, day){
    return service.getUnitMinimumStay(id)
        .then((res) => {
            let periodic = Object.keys(res.data.data).length > 0 ? res.data.data : res.data;
            return service.getUnitSpecialMinimumStay(id)
                .then((res) => {
                    let data = {periodic, 'special': res.data.data.list, 'date': day.date}
                    if(Object.keys(periodic).length === 0 && res.data.data.total === 0){
                        data = {};
                    }
                    return {
                        type: FETCH_MINIMUM_STAY,
                        payload: data
                    }
                })
                .catch((error) => {
                    return {
                        type: FETCH_MINIMUM_STAY_ERROR,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: FETCH_MINIMUM_STAY_ERROR,
                payload: error
            }
        })
}

export function getPeriodicMinimumStay(id){
    return service.getUnitMinimumStay(id)
        .then((res) => {
            return {
                type: FETCH_PERIODIC_MINIMUM_STAY,
                payload: res.data.data
            }
        })
        .catch((error) => {
            return {
                type: MIN_STAY_ERROR,
                payload: error
            }
        })
}

export function getSpecialMinimumStay(id){
    return service.getUnitSpecialMinimumStay(id)
        .then((res) => {
            return {
                type: FETCH_SPECIAL_MINIMUM_STAY,
                payload: res.data.data
            }
        })
        .catch((error) => {
            return {
                type: MIN_STAY_ERROR,
                payload: error
            }
        })
}


export function updatePeriodicMinimumStay(id, unit){

    let data = {
        "data": {
            "dateFrom": unit.From,
            "dateTo": unit.To,
            "minimumStayValue": unit.minimumStay,
            "affectedDays": unit.chooseDays
        }
    }

    return service.updatePeriodicMinimumStay(id, data)
        .then((res) => {
              return {
             type: UPDATE_PERIODIC_MINIMUM_STAY,
             payload: res.data.data
             }
        })
        .catch((error) => {
            return {
                type: MIN_STAY_ERROR,
                payload: error
            }
        })
}

export function createSpecialMinimumStay(id, unit){
   let data = {
       "data": {
           "title": unit.title,
           "dateFrom": unit.From,
           "dateTo": unit.To,
           "minimumStayValue": unit.minimumStay
       }
   }

    return service.createSpecialMinimumStay(id, data)
        .then((res) => {
            return service.getUnitSpecialMinimumStay(id)
                .then((res) => {
                    return {
                        type: FETCH_SPECIAL_MINIMUM_STAY,
                        payload: res.data.data
                    }
                })
                .catch((error) => {
                    return {
                        type: MIN_STAY_ERROR,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: MIN_STAY_ERROR,
                payload: error
            }
        })
}

export function updateSpecialMinimumStay(id, unit, specialId){
    let data = {
        "data": {
            "title": unit.title,
            "dateFrom": unit.From,
            "dateTo": unit.To,
            "minimumStayValue": unit.minimumStay
        }
    }

    return service.updateSpecialMinimumStay(id, data, specialId)
        .then((res) => {
            return service.getUnitSpecialMinimumStay(id)
                .then((res) => {
                    return {
                        type: FETCH_SPECIAL_MINIMUM_STAY,
                        payload: res.data.data
                    }
                })
                .catch((error) => {
                    return {
                        type: MIN_STAY_ERROR,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: MIN_STAY_ERROR,
                payload: error
            }
        })
}

export function deleteSpecialMinimumStay(id, specialId){

    return service.deleteSpecialMinimumStay(id, specialId)
        .then((res) => {
            return service.getUnitSpecialMinimumStay(id)
                .then((res) => {
                    return {
                        type: FETCH_SPECIAL_MINIMUM_STAY,
                        payload: res.data.data
                    }
                })
                .catch((error) => {
                    return {
                        type: MIN_STAY_ERROR,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: MIN_STAY_ERROR,
                payload: error
            }
        })
}