import axios from 'axios';
import { UnitRateStandard, UnitDiscount, Specialrates } from '../reducers/data';
import {ROOT_URL, hotelId, headerSettings} from '../data/data'

let testing = true;


export default class RatesService {

    getUnitStandardRate(unitsId) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitsId}/standard_rates`;
        let rates =  this.makeRequest(url, 'get', UnitRateStandard, headerSettings);

        return rates;
    }

    updateStandardRates(unitId, data) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/standard_rates`;
        let rates =  this.makeRequest(url, 'post', UnitRateStandard, headerSettings, data);

        return rates;
    }
    getUnitDiscount(unitsId, discountType) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitsId}/discounts/${discountType}`;
        let discount =  this.makeRequest(url, 'get', UnitDiscount, headerSettings);

        return discount;
    }

    updateDiscount(unitId, data) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/discounts/2MoreNightsDiscount`;
        let rates =  this.makeRequest(url, 'post', UnitRateStandard, headerSettings, data);

        return rates;
    }

    getUnitSpecialRate(unitsId) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitsId}/special_rates`;
        let rates =  this.makeRequest(url, 'get', Specialrates, headerSettings);

        return rates;
    }

    createSpecialRates(unitId, data) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/special_rates`;
        let rates =  this.makeRequest(url, 'post', UnitRateStandard, headerSettings, data);

        return rates;
    }

    updateSpecialRates(id, unitId, data) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/special_rates/${id}`;
        let rates =  this.makeRequest(url, 'post', UnitRateStandard, headerSettings, data);

        return rates;
    }

    deleteSpecialRates(unitId, id) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/special_rates/${id}`;
        let rates =  this.makeRequest(url, 'delete', UnitRateStandard, headerSettings);

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