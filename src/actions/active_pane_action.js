import CalendarService from '../services/CalendarService';
import MinimumStayService from '../services/MinimumStayService';
import moment from 'moment';

export const SWITCH_PANE = 'SWITCH_PANE';
export const OPEN_RATES_SIDEBAR = 'OPEN_RATES_SIDEBAR';
export const OPEN_CALENDAR_SIDEBAR = 'OPEN_CALENDAR_SIDEBAR';
export const OPEN_CALENDAR_SIDEBAR_ERROR = 'OPEN_CALENDAR_SIDEBAR_ERROR';
export const OPEN_CLOSED_SIDEBAR = 'OPEN_CLOSED_SIDEBAR';
export const RESET_SIDEBAR = 'RESET_SIDEBAR';
export const RESET_CLOSED = 'RESET_CLOSED';
export const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
export const OPEN_SIDEBAR_RESET = 'OPEN_SIDEBAR_RESET';

const sideBarWidth = 510;
const service = new  CalendarService();
const minimumStayService = new  MinimumStayService();

export function switchPane(active){
    return {
        type: SWITCH_PANE,
        payload: active
    }
}

export function openSidebar(){
    return {
        type: OPEN_SIDEBAR,
        payload: true
    }
}

export function openSidebarReset(){
    return {
        type: OPEN_SIDEBAR_RESET,
        payload: false
    }
}

export function resetCalendarSidebarOpen(){
    let close = true
    return {
        type: RESET_SIDEBAR,
        payload: close
    }
}

export function closedSet(){
    let close = false
    return {
        type: RESET_CLOSED,
        payload: close
    }
}

export function openSidebarRates(unit, id, e, currentDate){
    const scrinWidth = document.documentElement.clientWidth;
    const  posX = e.nativeEvent.clientX;
    let moveDays;

    if(posX + sideBarWidth > scrinWidth){
        moveDays = moment(unit.date).diff(currentDate, 'days');
    }

    let data = {
        id,
        unit,
        moveDays,
        reqTime: (new Date()).getTime()
    }

    return {
        type: OPEN_RATES_SIDEBAR,
        payload: data
    }
}


export function openSidebarCalendar(unit, id, e, currentDate, reserved){
    e.stopPropagation();
    const scrinWidth = document.documentElement.clientWidth;
    const  posX = e.nativeEvent.clientX;
    let moveDays;
    let status = 'free';

    if(unit.isReserved && !unit.drawEnd) status = 'reserved';
    if(unit.inHouse && !unit.drawEnd) status = 'inHouse';
    if(unit.checkOutStatus && !unit.drawEnd)  status = 'CheckedOut';

    if(reserved || (unit.drawEnd && unit.drawStart)){
        if(unit.isReserved) status = 'reserved';
        if(unit.inHouse) status = 'inHouse';
        if(unit.checkOutStatus)  status = 'CheckedOut';
    }

    /*if(posX + sideBarWidth > scrinWidth){
        let date = unit.date ? unit.date : unit.checkOut;
        moveDays = moment(date).diff(currentDate, 'days');
    }*/

    if(unit.isReserved  && status !== 'free'){
        return service.getReservationById(unit.reservationId)
            .then((res) => {
                let data = {
                    id,
                    unit: res.data.data,
                    moveDays,
                    status,
                    reservationId: unit.reservationId,
                    reqTime: (new Date()).getTime()
                }
                return {
                    type: OPEN_CALENDAR_SIDEBAR,
                    payload: data
                }
            })
            .catch((error) => {
                return {
                    type: OPEN_CALENDAR_SIDEBAR_ERROR,
                    payload: error
                }
            })
    }else{
        let data = {
            id,
            unit: unit,
            moveDays,
            status,
            reqTime: (new Date()).getTime()
        }
        return {
            type: OPEN_CALENDAR_SIDEBAR,
            payload: data
        }
    }


}

export function openClosedSidebar(unit, id, e, currentDate){
    e.stopPropagation();
    const scrinWidth = document.documentElement.clientWidth;
    const  posX = e.nativeEvent.clientX;
    let moveDays;
    let status = 'free';



    if(posX + sideBarWidth > scrinWidth){
        moveDays = moment(unit.date).diff(currentDate, 'days');
    }

    let data = {
       'date': unit.date,
        moveDays,
        id
    }

    return {
            type: OPEN_CLOSED_SIDEBAR,
            payload: data
        }


}