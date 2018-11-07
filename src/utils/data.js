import moment from 'moment'


export const mapDataToDays = (days, unitDay, id, user) => {
  let index;
  const indexFromStart = days.findIndex(day => moment(unitDay.checkIn).format('YYYY/MM/DD') === day.date);
  const indexFromEnd = days.findIndex(day => moment(unitDay.checkOut).format('YYYY/MM/DD') === day.date);
  if (indexFromStart === -1) {
      if(indexFromEnd === -1){
          return;
      }else {
        index = 0;
      }

  }else {
      index = indexFromStart;
  }
    var diff;
    var Reslength;
  if(indexFromStart !== -1){
       diff = moment(unitDay.checkOut).diff(unitDay.checkIn, 'days');
      if(index + diff > days.length){
          Reslength = diff - (index + diff - days.length);
      }else {
          Reslength = (index + diff === days.length) ? diff+1 : diff;
      }
  }else{
       diff = moment(unitDay.checkOut).diff(moment(days[index].date), 'days');
      if( diff > days.length){
          Reslength = diff - ( diff - days.length);
      }else {
          Reslength =  diff;
      }
  }


  days[index].reservationId = user.reservationId;
  days[index].groupReservation = user.units.length > 1;
  if(days[index].drawEnd !== true) days[index].userStart = user;
  days[index].drawStart = indexFromStart === -1 ? false : true;
  days[index].drawMid = (indexFromStart === -1 && diff !== 0) ? true : false;
  days[index].drawEnd = (indexFromStart === -1 && diff === 0) ? true : days[index].drawEnd ? true : false;
  days[index].isReserved = true;
  days[index].price = user.totalPrice;
  days[index].diff = diff;
  days[index].drawLen = Reslength;
  days[index].id = id;
  days[index].firstName = user.firstName;
  days[index].lastName = user.lastName;
  days[index].phone = user.phone;
  days[index].totalUnits = user.totalUnits;
  days[index].totalGuests = user.totalGuests;
  days[index].confirmedOffline = user.guestDetails.source === "direct";
  days[index].checkIn = moment(unitDay.checkIn).format('YYYY/MM/DD');
  days[index].checkOut = moment(unitDay.checkOut).format('YYYY/MM/DD');

      reservationStatus(index);



  for (var i = 1; i <= Reslength && (index + i) < days.length; i++) {
    if(Reslength === i){
      days[index+i].drawEnd = true;
        if(days[index].drawStart !== true) days[index].userEnd = user;

    }else {
      days[index+i].drawMid = true;

    }
      days[index+i].groupReservation = user.units.length > 1;
    days[index+i].user = user;
    days[index+i].reservationId = user.reservationId;
    days[index+i].isReserved = true;
    days[index+i].reservationId = user.reservationId;
    days[index+i].id = id;
    days[index+i].price = user.totalPrice;
    days[index+i].firstName = user.firstName;
    days[index+i].lastName = user.lastName;
    days[index+i].phone = user.phone;
    days[index+i].totalUnits = user.totalUnits;
    days[index+i].totalGuests = user.totalGuests;
    days[index+i].confirmedOffline = user.guestDetails.source === "direct";
    days[index+i].inHouse = days[index].inHouse;
    days[index+i].checkOutStatus = days[index].checkOutStatus;
    days[index+i].checkIn = moment(unitDay.checkIn).format('YYYY/MM/DD');
    days[index+i].checkOut = moment(unitDay.checkOut).format('YYYY/MM/DD');
  }

  function reservationStatus(index) {
      if(moment().diff(moment(unitDay.checkIn), 'days') >= 0){
          days[index].inHouse = true;
      }else {
          days[index].inHouse = false;
      }
      let checkOut = moment(unitDay.checkOut).format('YYYY/MM/DD');
      if(moment(checkOut).diff(moment(), 'days') < 0){
          days[index].checkOutStatus = true;
      }else{
        days[index].checkOutStatus = false;
      }
  }

}
export const mapDataToDaysClosedMain = (days, id, closed) => {
  let closedDays = closed[id];

    closedDays.forEach(function (value) {
        let index;
        const indexFromStart = days.findIndex(day => moment(value.dateFrom).format('YYYY/MM/DD') === day.date);
        const indexFromEnd = days.findIndex(day => moment(value.dateTo).format('YYYY/MM/DD') === day.date);

        if (indexFromStart === -1) {
            if(indexFromEnd === -1){
                return;
            }else {
                index = 0;
            }

        }else {
            index = indexFromStart;
        }
        var diff;
        var Reslength;
        var divided = false;
        if(indexFromStart !== -1){
            diff = moment(value.dateTo).diff(value.dateFrom, 'days');
            if(index + diff > days.length){
                Reslength = diff - (index + diff - days.length);
            }else {
                if(moment(days[days.length-1].date).diff(value.dateTo, 'days') < 0){
                    Reslength = moment(days[days.length-1].date).diff(value.dateFrom, 'days');
                    divided = true;
                }else {
                    Reslength = diff;
                }
            }
        }else{
            diff = moment(value.dateTo).diff(moment(days[index].date), 'days');
            if( diff > days.length){
                Reslength = days.length;
            }else {
                Reslength =  diff;
            }
        }

        days[index].closedStart = indexFromStart === -1 ? false : true;
        days[index].closedMid = (indexFromStart === -1 && diff !== 0) ? true : false;
        days[index].closedEnd = (indexFromStart === -1 && diff === 0) ? true : days[index].closedEnd ? true : false;
        days[index].isClosed = true;
        days[index].diff = diff;
        days[index].drawLen = Reslength;
        days[index].id = id;

        for (var i = 1; i <= Reslength && (index + i) < days.length; i++) {
            if(Reslength === i && !divided){
                days[index+i].closedEnd = true;
            }else {
                days[index+i].closedMid = true;
            }
            days[index+i].isClosed = true;
            days[index+i].id = id;
        }

    })



    return days;

}

export const checkDateSatus = (day, currentUnit) => {
    if(!currentUnit.user){
        day.isReserved = true;
        day.groupReservation = day.units.length > 1;
        day.confirmedOffline = day.guestDetails.source === "direct"
        day.inHouse = currentUnit.inHouse;
        day.checkOutStatus = currentUnit.checkOutStatus;
        day.price = day.totalPrice;
        return day;
    }
    day.isReserved = true;
    day.groupReservation = currentUnit.user.units.length > 1;

    day.confirmedOffline = currentUnit.user.guestDetails.source === "direct";
    if(currentUnit.user) {
        day.reservationId = currentUnit.user.reservationId;
    }

    if(moment().diff(moment(day.checkIn), 'days') >= 0){
        day.inHouse = true;
    }else {
        day.inHouse = false;
    }
    let checkOut = moment(day.checkOut).format('YYYY/MM/DD');
    if(moment(checkOut).diff(moment(), 'days') < 0){
        day.checkOutStatus = true;
    }else{
        day.checkOutStatus = false;
    }

    return day;
}
export const checkUnitDraw = (user, id, end) => {
    let diff, drawLen;
    if(user.drawStart && !user.drawEnd){

        if(moment(end).diff(moment(user.checkOut), 'days') < 0){
            drawLen = moment(end).diff(moment(user.checkIn), 'days');
            user.drawLen = drawLen+1;
            user.devided = true;
            user.diff = diff;
        }else {
            user.drawLen = diff;
        }
        return user;
    }
    if(user.units){
        user.units.forEach(function (val) {
            if(val.id*1 === id){
                diff = moment(val.checkOut).diff(moment(val.checkIn), 'days');

                if(moment(end).diff(moment(val.checkOut), 'days') < 0){
                    drawLen = moment(end).diff(moment(val.checkIn), 'days');
                    user.drawLen = drawLen+1;
                    user.devided = true;
                    user.diff = diff;
                }else {
                    user.drawLen = diff;
                }
            }
        })
    }


    return user;
}
export const checkUserStart = (user, current) => {
    if(!user){
        return current
    }
    user.isReserved = true;
    user.groupReservation = user.units.length > 1;
    user.confirmedOffline =  user.guestDetails.source === "direct";
    user.reservationId = user.reservationId;

    user.units.forEach(function (val) {
        if(val.id === current.id){
            user.checkIn = val.checkIn;
            user.checkOut = val.checkOut;
            user.price = val.price;
        }
    })

    if(moment().diff(moment(user.checkIn), 'days') >= 0){
        user.inHouse = true;
    }else {
        user.inHouse = false;
    }
    let checkOut = moment(user.checkOut).format('YYYY/MM/DD');
    if(moment(checkOut).diff(moment(), 'days') < 0){
        user.checkOutStatus = true;
    }else{
        user.checkOutStatus = false;
    }

    return user;
}

export const mapDataToDaysRates = (days, unitId, rates) => {
    const equalIdRate = rates[unitId];
    if(!equalIdRate){
      return days;
    }

  for(let j = 0; j < days.length; j++){

      days[j]['discount'] = equalIdRate.discount;
      days[j]['endWeek'] = equalIdRate.endWeek;
      days[j]['midWeek'] = equalIdRate.midWeek;
      if(days[j].isEndWeek){
        days[j]['type'] = 'End week';
      }else{
        days[j]['type'] = 'Midweek';
      }

  }

    for(let i = 0; i < equalIdRate.list.length; i++ ) {
      let start = moment(equalIdRate.list[i].dateFrom);
      let end = moment(equalIdRate.list[i].dateTo);
      let diff = end.diff(start, 'days')+1;
      if (diff < 0) {
        const temp = end;
        end = start;
        start = temp;
        diff = Math.abs(diff);
      }

      start = moment(start).format('YYYY/MM/DD');
      end = moment(end).format('YYYY/MM/DD');

        let index = days.findIndex(day => start === day.date);
        const indexEnd = days.findIndex(day => end === day.date);
        let activeLength;
        if(index === -1){
            if(indexEnd === -1){

            }else {
                index = 0;
                activeLength = indexEnd+1;

                for(let j = 0; j < activeLength; j++){
                    days[index + j]['special'] = equalIdRate.list[i];
                    days[index + j]['type'] = 'Special';
                }
            }

        }else{
            if(index + diff > days.length){
                activeLength = diff - (index + diff - days.length);
            }else {
                activeLength =  diff;
            }

            for(let j = 0; j < activeLength; j++){
                days[index + j]['special'] = equalIdRate.list[i];
                days[index + j]['type'] = 'Special';
            }
        }
    }
    return days;

}

export const mapDataToDaysClosed = (days, unitId, closed) => {
    const equalIdClosed = closed[unitId];
    if(!equalIdClosed || equalIdClosed.length === 0){
      return days;
    }

  for(let j = 0; j < days.length; j++){

      if(days[j].isEndWeek){
        days[j]['type'] = 'End week';
      }else{
        days[j]['type'] = 'Midweek';
      }

  }

    for(let i = 0; i < equalIdClosed.length; i++ ) {
      let start = moment(equalIdClosed[i].dateFrom);
      let end = moment(equalIdClosed[i].dateTo);
      let diff = end.diff(start, 'days')+1;
      if (diff < 0) {
        const temp = end;
        end = start;
        start = temp;
        diff = Math.abs(diff);
      }

      start = moment(start).format('YYYY/MM/DD');
      end = moment(end).format('YYYY/MM/DD');

        let index = days.findIndex(day => start === day.date);
        const indexEnd = days.findIndex(day => end === day.date);
        let activeLength;
        let iconPosition;
        if(index === -1){
            if(indexEnd === -1){

            }else {
                index = 0;
                activeLength = indexEnd+1;

                for(let j = 0; j < activeLength; j++){
                    if(j === 0 && index) {
                        days[index + j].drawStart = true;
                    }
                    if(j === activeLength-1){
                        days[index + j].drawEnd = true;
                    }else{
                        days[index + j].drawMid = true;
                    }
                    days[index + j]['closed'] = equalIdClosed[i];
                    days[index + j]['type'] = 'closed';
                }
            }

        }else{
            if(index + diff > days.length){
                activeLength = diff - (index + diff - days.length);

            }else {
                activeLength =  diff;
            }
            iconPosition = Math.ceil(activeLength/2)-1;
            days[index].drawLength = activeLength;

            for(let j = 0; j < activeLength; j++){
                if(j === iconPosition) {
                    days[index + j].icon = true;
                    days[index + j].iconPosition = activeLength%2 === 1;
                }

                if(j === 0) {
                    if(days[index + j].drawEnd){
                        days[index + j]['startInfo'] = equalIdClosed[i];
                    } else {
                        days[index + j]['closed'] = equalIdClosed[i];
                    }
                    days[index + j].drawStart = true;
                }else{
                    if(j === activeLength-1) {
                        if(diff-1 > j){
                            days[index + j].drawMid = true;
                        }else {
                            days[index + j].drawEnd = true;
                        }
                        days[index + j]['closed'] = equalIdClosed[i];
                    }else{
                        days[index + j].drawMid = true;
                        days[index + j]['closed'] = equalIdClosed[i];
                    }
                }

                
                days[index + j]['type'] = 'closed';
            }
        }
    }
    return days;

}


export const checkMinimumStay = (data) => {
    let minimumStay,minimumStaySpecial;
    let periodicFrom = moment(data.minimumStay.periodic.dateFrom);
    let periodicTo = moment(data.minimumStay.periodic.dateTo);
    let currentDate = moment(data.minimumStay.date);
    let weekDay = currentDate.clone().format('ddd').toUpperCase();

    if(currentDate.diff(periodicFrom, 'days') >= 0 && periodicTo.diff(periodicFrom, 'days') >= 0){
        let equal = data.minimumStay.periodic.affectedDays.find((day) => day === weekDay);
        if(equal) minimumStay = data.minimumStay.periodic.minimumStayValue;
    }

    minimumStaySpecial = data.minimumStay.special.find(function (value) {
         periodicFrom = moment(value.dateFrom);
         periodicTo = moment(value.dateTo);

        if(currentDate.diff(periodicFrom, 'days') >= 0 && periodicTo.diff(currentDate, 'days') >= 0){
            return value.minimumStayValue;
        }
    });

    if(minimumStaySpecial) minimumStay = minimumStaySpecial.minimumStayValue;

    return minimumStay;
}

export const mapDataToActiveDays = (days, data) => {
    let index = days.findIndex(day => moment(data.checkIn).format('YYYY/MM/DD') === day.date);
    const indexEnd = days.findIndex(day => moment(data.checkOut).format('YYYY/MM/DD') === day.date);
    let activeLength;
    if(index === -1){
        if(indexEnd === -1){
            return days;
        }else {
            index = 0;
            activeLength = indexEnd+1;
        }

    }else{
        if(index + data.diff > days.length){
            activeLength = data.diff - (index + data.diff - days.length);
        }else {
            activeLength =  data.diff;
        }
    }

    for(let i = 0; i < activeLength; i++){
        days[index + i].activeDay = true;
    }

    return days;
}