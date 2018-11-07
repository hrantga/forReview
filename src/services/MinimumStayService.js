import axios from 'axios';
import {Units} from '../reducers/data';
import {ROOT_URL, hotelId, headerSettings} from '../data/data'

let testing = true;

export default class MinimumStayService {


    getUnitMinimumStay(id) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${id}/periodic_minimum_stays`;
        let unit =  this.makeRequest(url, 'GET', Units, headerSettings);

        return unit;
    }

    getUnitSpecialMinimumStay(id) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${id}/special_minimum_stays`;
        let unit =  this.makeRequest(url, 'GET', Units, headerSettings);

        return unit;
    }

    updatePeriodicMinimumStay(id, data){
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${id}/periodic_minimum_stays`;
        let periodic =  this.makeRequest(url, 'post', Units, headerSettings, data);

        return periodic;
    }

    createSpecialMinimumStay(id, data){
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${id}/special_minimum_stays`;
        let special =  this.makeRequest(url, 'post', Units, headerSettings, data);

        return special;
    }

    updateSpecialMinimumStay(id, data, specialId){
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${id}/special_minimum_stays/${specialId}`;
        let special =  this.makeRequest(url, 'post', Units, headerSettings, data);

        return special;
    }

    deleteSpecialMinimumStay(id, specialId) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${id}/special_minimum_stays/${specialId}`;
        let rates =  this.makeRequest(url, 'delete', Units, headerSettings);

        return rates;
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