import _ from 'lodash';
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const getDays = (unitDate, start, end, hotel) => {
  const days = [];
    let endWeekDay ;
  for(let i = start; i < end; i++){
      let date = unitDate.clone().add(i, 'day').format('YYYY/MM/DD');
      let day = unitDate.clone().add(i, 'day').format('D');
      let weekDay = unitDate.clone().add(i, 'day').format('ddd');
      const value = hotel.endWeekDays.find((endDay) => (weekDay.toUpperCase() === endDay));
      (value) ? endWeekDay = true : endWeekDay = false;
    days.push({ day , date, 'isEndWeek': endWeekDay })
  }
  return days;
}

export const getMonthDays = (date, start, end , hotel) => {
  const days = [];
  let endWeekDay ;
  for(let i = start; i < end; i++){
      let day = date.clone().add(i, 'day').format('D');
      let month = date.clone().add(i, 'day').format('MMM');
      let weekDay = date.clone().add(i, 'day').format('ddd');
      let fullDate = date.clone().add(i, 'day').format('YYYY/MM/DD')
      const value = hotel.endWeekDays.find((endDay) => (weekDay.toUpperCase() === endDay));
      (value) ? endWeekDay = true : endWeekDay = false;
      days.push({'day': day, 'month': month, 'weekDay': weekDay, 'isEndWeek': endWeekDay, 'date': fullDate})
  }
  return days;
}

export const startMonth = (date, to) => {
  const start = date.clone().add(to, 'day').format('YYYY/MM/DD');
  return start;
}

export const endMonth = (date, from) => {
  const end = date.clone().add(from, 'day').format('YYYY/MM/DD');
  return end;
}

export const getWeekDays = (hotel) => {
      let result = {};
      let endDays = '';
      let midDays = '';
      let midDaysArr = _.difference(weekDays, hotel.endWeekDays);

    midDaysArr = midDaysArr.map(toLower)
    midDays = midDaysArr.join(", ");
    let endDaysArr = hotel.endWeekDays.map(toLower)
    endDays = endDaysArr.join(", ");

    result =  {midDays, endDays}

    function toLower(x){
        return x.toLowerCase();
    }

    return result;
}