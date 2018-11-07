import axios from 'axios';
import {Units, UnitsFromTo} from '../reducers/data';
import {ROOT_URL, hotelId, headerSettings} from '../data/data'

let testing = true;

export default class CalendarService {

    getUnits() {
       testing = false;
       let url = `${ROOT_URL}/hotels/${hotelId}/units`;
       let units =  this.makeRequest(url, 'GET', Units, headerSettings);

       return units;
    }

    getHotel() {
       testing = false;
       let url = `${ROOT_URL}/hotels/${hotelId}`;
       let hotel =  this.makeRequest(url, 'GET', Units, headerSettings);

       return hotel;
    }

    calculatePrice(unitId, data) {
       testing = false;
       let url = `${ROOT_URL}/calculateOrderPrice/hotels/${hotelId}/units/${unitId}/from/${data.from}/to/${data.to}/adults/${data.adults}/children/${data.children}/babies/${data.babies}`;
       let price =  this.makeRequest(url, 'GET', Units, headerSettings);

       return price;
    }

    getUnitsFromTo(fromDate, toDate) {
       testing = false;
       let  from = fromDate.split('/').join('-');
       let to = toDate.split('/').join('-');
       let url = `${ROOT_URL}/hotels/${hotelId}/calendar/from/${from}/to/${to}`;
       let units =  this.makeRequest(url, 'GET', UnitsFromTo, headerSettings);

       return units;

    }

  getReservations(fromDate, toDate) {
       testing = false;
       let  from = fromDate.split('/').join('-');
       let to = toDate.split('/').join('-');
       let url = `${ROOT_URL}/hotels/${hotelId}/reservations/from/${from}/to/${to}`;
       let units =  this.makeRequest(url, 'GET', UnitsFromTo, headerSettings);

       return units;
    }

    getReservationById(id) {
       testing = false;
       let url = `${ROOT_URL}/hotels/${hotelId}/reservations/${id}`;
       let unit =  this.makeRequest(url, 'GET', UnitsFromTo, headerSettings);

       return unit;
    }

    cancelReservation(id) {
       testing = false;
       let url = `${ROOT_URL}/hotels/${hotelId}/cancelReservations/${id}`;
       let unit =  this.makeRequest(url, 'POST', UnitsFromTo, headerSettings);

       return unit;
    }

    lockUnit(unitId, fromDate, toDate) {
       testing = false;
       let from = fromDate.split('/').join('-');
       let to = toDate.split('/').join('-');
       let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/calendar/from/${from}/to/${to}/lock`;
       let units =  this.makeRequest(url, 'POST', UnitsFromTo, headerSettings);

       return units;
    }

    createReservation(data) {
       testing = false;
       let url = `${ROOT_URL}/hotels/${hotelId}/reservations`;
       let units =  this.makeRequest(url, 'POST', UnitsFromTo, headerSettings, data);

       return units;
    }

    updateReservation(data, id) {
       testing = false;
       let url = `${ROOT_URL}/hotels/${hotelId}/reservations/${id}`;
       let units =  this.makeRequest(url, 'POST', UnitsFromTo, headerSettings, data);

       return units;
    }

    makeRequest(url, option, mockData, header, data) {
        if (!testing) {
          let options = {};
          if(!data){
            options = {
              method: option,
              headers: header,
              url,
            };
          }else {
            options = {
              method: option,
              headers: header,
              url,
              data
            };
          }
            return axios(options)
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(mockData), 1500)
        });
    }
}