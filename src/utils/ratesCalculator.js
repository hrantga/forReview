import moment from 'moment';

export const calculateTotalPrice = (unit) => {
    let result = 0
   unit.forEach(function (value) {
       result += 1*value.price;
    });

     return result;
}