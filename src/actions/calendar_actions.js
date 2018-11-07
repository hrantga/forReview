import CalendarService from '../services/CalendarService';
import moment from 'moment';

export const FETCH_HOTEL = 'FETCH_HOTEL';
export const FETCH_UNITS = 'FETCH_UNITS';
export const FETCH_UNITS_FROM_TO = 'FETCH_UNITS_FROM_TO';
export const FETCH_YEAR = 'FETCH_YEAR';
export const FETCH_MONTH = 'FETCH_MONTH';
export const FETCH_WEEK = 'FETCH_WEEK';
export const FETCH_TODAY = 'FETCH_TODAY';
export const ADD_RESERVATION = 'ADD_RESERVATION';
export const FETCH_RESERVATIONS = 'FETCH_RESERVATIONS';
export const FROM_TO_BUSY = 'FROM_TO_BUSY';
export const FETCH_CALENDAR_ERROR = 'FETCH_CALENDAR_ERROR';
export const FETCH_PICKER = 'FETCH_PICKER';
export const CANCEL_RESERVATIONS = 'CANCEL_RESERVATIONS';

const service = new  CalendarService();

export async function addReservation(units, guest, payment, start, end, discount ){

   let unitArr = units.map(function (value) {
       return {
         "id": value.id,
         "checkIn": moment(value.checkIn).format('YYYY-MM-DD'),
         "checkOut": moment(value.checkOut).format('YYYY-MM-DD'),
         "price": value.price,
         "adults": value.countAdults,
         "children": value.countChildren,
         "babies": value.countBabies
       }
   })

    let data = {
      "data": {
        "user": {
          "firstName": guest.firstName,
          "lastName": guest.lastName,
          "email": guest.email,
          "phone": guest.phone,
          "aditionalPhone": guest.additionalPhone,
          "country": guest.country,
          "source": guest.source,
          "specialRequirements": guest.textArea
        },
        "payment": {
          "cardholder": payment.cardholderName,
          "cardNumber": payment.creditCardNumber,
          "expirationDate": payment.expirationDate,
          "cvv": payment.cvv
        },
        "units": unitArr,
        discount
      }
    }
  return service.createReservation(data)
    .then((res) => {
      return service.getReservations(start, end)
        .then((res) => {
          return {
            type: FETCH_RESERVATIONS,
            payload: res.data.data
          }
        })
        .catch((error) => {
          return {
            type: FETCH_RESERVATIONS,
            payload: error
          }
        })
    })
    .catch((error) => {
      return {
        type: FETCH_UNITS,
        payload: error
      }
    })
}

export async function updateReservation(units, guest, payment, start, end, id, discount){

   let unitArr = units.map(function (value) {
       return {
         "id": value.id,
         "checkIn": moment(value.checkIn).format('YYYY-MM-DD'),
         "checkOut": moment(value.checkOut).format('YYYY-MM-DD'),
         "price": value.price,
         "adults": value.countAdults,
         "children": value.countChildren,
         "babies": value.countBabies
       }
   })

    let data = {
      "data": {
        "user": {
          "firstName": guest.firstName,
          "lastName": guest.lastName ? guest.lastName : guest.secondName,
          "email": guest.email,
          "phone": guest.phone ? guest.phone : guest.userPhone,
          "aditionalPhone": guest.additionalPhone ? guest.additionalPhone : guest.aditionalPhone,
          "country": guest.country,
          "source": guest.source,
          "specialRequirements": guest.textArea ? guest.textArea : guest.specialRequirements
        },
        "payment": {
          "cardholder": payment.cardholderName,
          "cardNumber": payment.creditCardNumber,
          "expirationDate": payment.expirationDate,
          "cvv": payment.cvv
        },
        "units": unitArr,
          discount
      }
    }
  return service.updateReservation(data, id)
    .then((res) => {
      return service.getReservations(start, end)
        .then((res) => {
          return {
            type: FETCH_RESERVATIONS,
            payload: res.data.data
          }
        })
        .catch((error) => {
          return {
            type: FETCH_RESERVATIONS,
            payload: error
          }
        })
    })
    .catch((error) => {
      return {
        type: FETCH_UNITS,
        payload: error
      }
    })
}

export async function cancelReservation(id, start, end){

    return service.cancelReservation(id)
        .then((res) => {
            return service.getReservations(start, end)
                .then((res) => {
                    return {
                        type: FETCH_RESERVATIONS,
                        payload: res.data.data
                    }
                })
                .catch((error) => {
                    return {
                        type: FETCH_RESERVATIONS,
                        payload: error
                    }
                })
        })
        .catch((error) => {
            return {
                type: CANCEL_RESERVATIONS,
                payload: error
            }
        })


}

export function getUnits(){

   return service.getUnits()
       .then((res) => {
           return {
               type: FETCH_UNITS,
               payload: res.data.data
           }
       })
       .catch((error) => {
           return {
               type: FETCH_UNITS,
               payload: error
           }
       })

}

export function getHotel(){

   return service.getHotel()
       .then((res) => {
           return {
               type: FETCH_HOTEL,
               payload: res.data.data
           }
       })
       .catch((error) => {
           return {
               type: FETCH_HOTEL,
               payload: error
           }
       })

}

export function getUnitsFromTo(start, end){
    return service.getUnitsFromTo(start, end)
        .then((res) => {
            return {
                type: FETCH_UNITS_FROM_TO,
                payload: res.data.data
            }
        })
        .catch((error) => {
            return {
                type: FETCH_UNITS_FROM_TO,
                payload: error
            }
        })
}

export function getReservations(start, end){
    return service.getReservations(start, end)
        .then((res) => {
            return {
                type: FETCH_RESERVATIONS,
                payload: res.data.data
            }
        })
        .catch((error) => {
            return {
                type: FETCH_RESERVATIONS,
                payload: error
            }
        })
}

export function selectYear(year){
   const date = `${year}/01/01`;
    return {
        type: FETCH_YEAR,
        payload: date
    }
}

export function selectMonth(date){
    return {
        type: FETCH_MONTH,
        payload: date
    }
}

export function selectWeek(date){
    return {
        type: FETCH_WEEK,
        payload: date
    }
}

export function selectToday(date){
    return {
        type: FETCH_TODAY,
        payload: date
    }
}

export function selectPicker(date){
    return {
        type: FETCH_PICKER,
        payload: date
    }
}