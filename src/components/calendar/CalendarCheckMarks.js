import React, { Component } from 'react';
import { Popup, List } from 'semantic-ui-react';
import classNames from 'classnames';
import { checkDateSatus, checkUserStart, checkUnitDraw } from '../../utils/data';
import moment from 'moment';
import {endMonth} from '../../utils/date';



export default class CalendarCheckMarks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            days: [],
            unitId: '',
            cellId: '',
            unit: {},
            type: '',
            discount: ''
        }
    }

    componentWillMount(){
        let unit;

        if(this.props.unit.isEndWeek && this.props.unit.type !== 'Special'){
            unit = this.props.unit.endWeek;
        }else{
            (this.props.unit.type === 'Special') ?  unit = this.props.unit.special :  unit = this.props.unit.midWeek;
        }

        this.setState({ unit, type: this.props.unit.type, discount: this.props.unit.discount, cellId:  this.props.cellid, unitId: this.props.unit.id })
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.unit !== nextProps.unit){
            let unit;

            if(this.props.unit.isEndWeek && this.props.unit.type !== 'Special'){
                unit = this.props.unit.endWeek;
            }else{
                (this.props.unit.type === 'Special') ?  unit = this.props.unit.special :  unit = this.props.unit.midWeek;
            }

            this.setState({ unit, type: this.props.unit.type, discount: this.props.unit.discount, cellId:  this.props.cellid, unitId: this.props.unit.id })
        }
    }


    getClasses(unit) {
         if(unit.isClosed){
         return classNames({
         'checkmark-start': unit.closedStart && !unit.closedEnd,
         'short-version': unit.drawLen <= 3,
         'checkmark-mid': unit.closedMid,
         'checkmark-end': !unit.closedStart && unit.closedEnd,
         'checkmark-start-end': unit.closedStart && unit.closedEnd,
         'is-closed': unit.isClosed,
         'busy-fileds': true,
          'group-reservation': unit.groupReservation,
          'divided': unit.drawLen < unit.diff || unit.devided,


         })
         }
        return classNames({
            'checkmark-start': unit.drawStart && !unit.drawEnd,
            'short-version': unit.drawLen <= 3,
            'divided': unit.drawLen < unit.diff || unit.devided,
            'checkmark-mid': unit.drawMid,
            'checkmark-end': !unit.drawStart && unit.drawEnd && !unit.drawMid,
            'checkmark-start-end': unit.drawStart && unit.drawEnd,
            'is-locked': unit.isLocked,
            'is-special-rate': unit.isSpecialRate,
            'is-reserved': unit.isReserved,
            'is-offline': unit.confirmedOffline,
            'is-weekend': unit.isWeekend  ,
            'in-house': unit.inHouse,
            'check-out': unit.checkOutStatus,
            'busy-fileds': true,
            'group-reservation-offline': unit.groupReservation && unit.confirmedOffline,
            'group-reservation-online': unit.groupReservation && !unit.confirmedOffline,

        })
    }

    renderReservedPopup(unit){
        return (
            <List className="popup-unit-info">
                <List.Item><p>Unit Name</p></List.Item>
                <List.Item><span>Check-in/out:</span> {unit.checkIn}-{unit.checkOut}</List.Item>
                <List.Item><span>Name:</span> {unit.firstName} {unit.lastName}</List.Item>
                <List.Item><span>Phone:</span> {unit.phone}</List.Item>
                <List.Item><span>Total units:</span> {unit.totalUnits}</List.Item>
                <List.Item><span>Total Guests:</span> {unit.totalGuests}</List.Item>
                <List.Item></List.Item>
                <List.Item className="unit-total-price"><span>Total price:</span> ₪{unit.price}</List.Item>
            </List>
        )
    }

    renderReservedPopupSameFiled(unit, user){
        return (
            <List className="popup-unit-info">
                <List.Item><p>Unit Name</p></List.Item>
                <List.Item><span>Check-in/out:</span> {unit.checkIn}-{unit.checkOut}</List.Item>
                <List.Item><span>Name:</span> {user.firstName} {user.lastName}</List.Item>
                <List.Item><span>Phone:</span> {user.guestDetails.phone}</List.Item>
                <List.Item><span>Total units:</span> {user.totalUnits}</List.Item>
                <List.Item><span>Total Guests:</span> {user.totalGuests}</List.Item>
                <List.Item></List.Item>
                <List.Item className="unit-total-price"><span>Total price:</span> ₪{unit.price}</List.Item>
            </List>
        )
    }
    renderFreeUnitPopup(unit){
        if (!this.state.unit) {
            return;
        }
        return (
            <List className="popup-unit-info">
                <List.Item><p>{this.state.type} rates</p></List.Item>
                <List.Item><span>Standart(2):</span> <span className="unit-data">₪{this.state.unit.rateValue}</span></List.Item>
                <List.Item><span>Single:</span> <span className="unit-data">₪{this.state.unit.singleRateValue}</span></List.Item>
                <List.Item>Extras:</List.Item>
                <List.Item><span>Adults</span> <span className="unit-data">₪{this.state.unit.extraAdult}</span></List.Item>
                <List.Item><span>Children(ages 2-12)</span> <span className="unit-data">₪{this.state.unit.extraChild}</span></List.Item>
                <List.Item><span>Babies(under 2)</span> <span className="unit-data">₪{this.state.unit.extraBaby}</span></List.Item>
                <List.Item></List.Item>
                <List.Item className="unit-total-price"><span>2 and more nights <br/> discount</span> <span className="unit-data">{this.state.discount}%</span></List.Item>
            </List>
        )
    }

    getPopupClasses(unit) {
        return classNames({
            'in-house': unit.inHouse && !unit.checkOutStatus,
            'check-out': unit.checkOutStatus,
            'offline-reservation': unit.confirmedOffline && !unit.checkOutStatus && !unit.inHouse,
        })
    }

    renderReserved(unit, liClasses, divStyle) {
        if(unit.groupReservation && unit.drawStart){
            let x ;
            if(unit.drawLen !== unit.diff){
                let date = moment(this.props.calendarData.date);
                let end = endMonth(date, 27);
                unit = checkUnitDraw(unit, unit.id, end)
                x= 50;
            }else{
                x = 0;
            }
            divStyle = {width: `${100*unit.drawLen+2-x}%`};
        }else{
            divStyle ={}
        }
        let popupClasses = this.getPopupClasses(unit);
        if(unit.drawEnd && !unit.drawStart && !unit.drawMid) {
            return (
                <div className={liClasses} onClick={(e) => this.props.openSidebarCalendar(unit, this.props.cellid, e, this.props.calendarData.date, true)}><i className={(unit.confirmedOffline) ? "icon phone" : "icon wifi"}></i></div>
            )
        }else if(unit.drawEnd && unit.drawStart && unit.user){
            let currentUnit = unit.user.units.filter((res) => (unit.id === res.id*1))
            let sameUnit = false;
            unit.user.units.forEach(function (value) {
                if(value.id*1 === unit.id ){
                    if(unit.day == moment(value.checkOut).format('D')) {
                        sameUnit =true;
                    }
                }
            })
            let name, unitPrevios;
            if(sameUnit && unit.user){
                unitPrevios = checkDateSatus(currentUnit[0], unit);
            }
            let previosClasses = this.getClasses(unitPrevios);
            let startUnit = {...unit};
            if(startUnit.userStart){
                startUnit  =  checkDateSatus(startUnit.userStart, currentUnit[0]);
                if(startUnit.groupReservation){
                    let date = moment(this.props.calendarData.date);
                    let end = endMonth(date, 27);
                    sameUnit = checkUnitDraw(startUnit, unit.id, end)
                    let x = sameUnit.devided ? 50 : 0;
                    startUnit.devided = sameUnit.devided;
                    divStyle = {width: `${100*sameUnit.drawLen+2-x}%`};
                }else{
                    divStyle ={}
                }
            }

            liClasses = this.getClasses(startUnit);
            let popupStartClasses = this.getPopupClasses(startUnit);

            if(startUnit.drawLen > 3) {
                name = startUnit.firstName;
            }else {
                name = startUnit.firstName.charAt(0);
            }

            return (
                <div>
                    <div className={'checkmark-end ' + previosClasses} onClick={(e) => this.props.openSidebarCalendar(unitPrevios, this.props.cellid, e, this.props.calendarData.date, true)}><i className={(unitPrevios.confirmedOffline) ? "icon phone" : "icon wifi"}></i></div>
                    <div className={'checkmark-start ' + liClasses} style={divStyle} onClick={(e) => this.props.openSidebarCalendar(startUnit, this.props.cellid, e, this.props.calendarData.date, true)}>
                        <h4 className="client-name">{name}</h4>
                        <span className="price">₪{startUnit.price}</span>
                    </div>
                </div>

            )
        }

        if(unit.drawStart && !unit.drawEnd) {
            let name;
            if(unit.drawLen > 3) {
                name = unit.firstName
            }else {
                name = unit.firstName ? unit.firstName.charAt(0) : '';
            }
            return (
                <div className={liClasses} style={divStyle}>
                <h4 className="client-name">{name}</h4>
                <span className="price">₪{unit.price}</span>
            </div>
            )

        }

        return (
            <div className={liClasses}  style={divStyle}></div>
        )
    }

    calendarCheckMarks(unit){
        if(this.state.cellId === unit.id){
            let liClasses = this.getClasses(unit);
            let divStyle;
            if(unit.isLocked || unit.isWeekend){
                return ( <div className={liClasses}></div> )
            }

            if(unit.isClosed){
                if(unit.closedStart){
                    let x = unit.drawLen !== unit.diff ? 50 : 0;
                    divStyle = {width: `${100*unit.drawLen+2-x}%`};
                }else{
                    divStyle ={}
                }

                if((unit.closedStart && unit.closedEnd) || (unit.drawStart && unit.closedEnd) || (unit.closedStart && unit.drawEnd) ){
                    let unitStart = {...unit};
                    let unitEnd = {...unit};
                    unitStart.closedEnd = false;
                    unitEnd.closedStart = false;
                    let startClasses = this.getClasses(unitStart);
                    let endClasses = this.getClasses(unitEnd);
                    if(unit.drawStart && !unit.drawEnd){
                        let  name;
                        let day = unit.userStart ? unit.userStart : unit.user;
                        let startUnit  =  checkUserStart(day, unit);
                        liClasses = this.getClasses(startUnit);
                        if(startUnit.drawLen > 3) {
                            name = startUnit.firstName;
                        }else {
                            name = startUnit.firstName.charAt(0);
                        }
                        if(unit.groupReservation && unit.drawStart){
                            let x = unit.drawLen !== unit.diff ? 50 : 0;
                            divStyle = {width: `${100*unit.drawLen+2-x}%`};
                        }else{
                            divStyle ={}
                        }
                        return (
                            <div>
                                <div className={endClasses}></div>
                                <div className={'checkmark-start ' + liClasses} style={divStyle} onClick={(e) => this.props.openSidebarCalendar(startUnit, this.props.cellid, e, this.props.calendarData.date, true)}>
                                    <h4 className="client-name">{name}</h4>
                                    <span className="price">₪{startUnit.price}</span>
                                </div>
                            </div>
                        )
                    }

                    if(unit.drawEnd && unit.user){
                        let unitPrevios;
                        let endUnit  =  unit.user;
                        endUnit.isReserved = unit.isReserved
                        endUnit.inHouse = unit.inHouse
                        endUnit.checkOutStatus = unit.checkOutStatus
                        endUnit.confirmedOffline = unit.confirmedOffline
                        let previosClasses = this.getClasses(endUnit);
                        let startUnit = {...unit};
                        if(startUnit.userStart){
                            startUnit  =  checkUserStart(startUnit.userStart, unit);
                            if(startUnit.groupReservation){
                                let x = unit.drawLen !== unit.diff ? 50 : 0;
                                divStyle = {width: `${100*unit.drawLen+2-x}%`};
                            }else{
                                divStyle ={}
                            }
                        }
                        return (
                            <div>
                                <div className={'checkmark-end ' + previosClasses} onClick={(e) => this.props.openSidebarCalendar(startUnit, this.props.cellid, e, this.props.calendarData.date, true)}><i className={(unit.user.confirmedOffline) ? "icon phone" : "icon wifi"}></i></div>
                                <div className={startClasses} style={divStyle}>{unit.closedStart ? (unit.drawLen >= 2  ? 'Room Closed' : ''): ''}</div>
                            </div>
                        )
                    }

                    return (
                        <div>
                            <div className={endClasses}></div>
                            <div className={startClasses} style={divStyle}>{unit.closedStart ? (unit.drawLen >= 2  ? 'Room Closed' : ''): ''}</div>
                        </div>
                    )
                }

                return ( <div className={liClasses} style={divStyle}>{unit.closedStart ? (unit.drawLen > 2  ? 'Room Closed' : ''): ''}</div> )
            }

            if(unit.isSpecialRate){
                return ( <div className={liClasses}></div> )
            }

            if(unit.isReserved){
                return this.renderReserved(unit, liClasses, divStyle);
            }
        }



        return (
            <div className={"rates-popup "+(this.props.unit.isEndWeek ? "end-week": "")} ></div>
        )

    }

    render() {
        return (
            this.calendarCheckMarks(this.props.unit)

        );
    }
}
