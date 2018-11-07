import axios from 'axios';
import { UnitRateStandard } from '../reducers/data';
import {ROOT_URL, hotelId, headerSettings} from '../data/data'

let testing = true;


export default class CloseOpenServiceService {

    getClosedUnits(unitsId) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitsId}/closed_units`;
        let unit =  this.makeRequest(url, 'get', UnitRateStandard, headerSettings);

        return unit;
    }

    updateClosedUnit(unitId, data, id) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/closed_units/${id}`;
        let unit =  this.makeRequest(url, 'post', UnitRateStandard, headerSettings, data);

        return unit;
    }

    createClosedUnits(unitId, data) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/closed_units`;
        let unit =  this.makeRequest(url, 'post', UnitRateStandard, headerSettings, data);

        return unit;
    }

    deleteClosedUnit(unitId, id) {
        testing = false;
        let url = `${ROOT_URL}/hotels/${hotelId}/units/${unitId}/closed_units/${id}`;
        let unit =  this.makeRequest(url, 'delete', UnitRateStandard, headerSettings);

        return unit;
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