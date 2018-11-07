import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { getDays } from '../../utils/date'
import { mapDataToDays, mapDataToDaysRates, mapDataToDaysClosedMain } from '../../utils/data'
import CalendarCheckMarks from '../../containers/CalendarCheckMarks'

export default class CalendarContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            days: [],
            rates: [],
            allRates: [],
            units: [],
            closed: {}
        }
    }

    componentDidMount(){
        if( Object.keys(this.props.rates.allRates).length > 0 && Object.keys(this.props.closedUnits.allClosed).length > 0) {
            this.setState({ allRates: this.props.rates.allRates, units: this.props.calendarData.units, closed: this.props.closedUnits.allClosed })
        }
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarData.units !== this.props.calendarData.units ) {
            this.getRatesAll(nextProps.calendarData.units);
        }
        if( nextProps.rates.allRates !== this.props.rates.allRates && Object.keys(this.props.closedUnits.allClosed).length > 0) {
            this.setState({ allRates: nextProps.rates.allRates, units: nextProps.calendarData.units, closed: nextProps.closedUnits.allClosed  })
        }
        if(nextProps.calendarData.reservations !== this.props.calendarData.reservations && Object.keys(this.props.rates.allRates).length > 0 && Object.keys(this.props.closedUnits.allClosed).length > 0){
          this.setState({allRates: nextProps.rates.allRates, units: nextProps.calendarData.units, closed: nextProps.closedUnits.allClosed })
        }

        if(nextProps.closedUnits.allClosed !== this.props.closedUnits.allClosed && Object.keys(this.props.rates.allRates).length > 0){
          this.setState({allRates: nextProps.rates.allRates, units: nextProps.calendarData.units, closed: nextProps.closedUnits.allClosed })
        }
    }

    getRatesAll(units){
        this.props.getAllRates(units);
        this.props.getAllClosed(units);
    }

    setDateToState(data, rates, id){
        let date = moment(data.date);
        let days = getDays(date, -2, 28, this.props.calendarData.hotel);
        let units = data.reservations;

      units.forEach(function (unit) {
          if(unit.units){
              let value = unit.units.filter(function (val) {
                  if(val.id*1 === id){
                      return val;
                  }
              });

              if(value) {
                  value.forEach(function (unitDay) {
                      mapDataToDays(days, unitDay, id, unit)
                  })
              }
          }

      })


        let daysArr = mapDataToDaysRates(days, id, rates);
        daysArr = mapDataToDaysClosedMain(daysArr, id, this.state.closed);

        return daysArr;
    }

    openSideBar(day, id, e, date){
        if(day.isClosed) {
            if(day.closedEnd && day.closedStart || day.closedStart || day.closedMid){
                return
            }
        }

        this.props.resetAllDate();
        if(this.props.calendarPane.activeIndex === 3 && !day.isReserved){
            this.props.openClosedSidebar(day, id, e, date);
        }else {
            this.props.openSidebarCalendar(day, id, e, date);
            this.props.getUnitMinimumStay(id, day);
        }
        this.props.selectToday(day.date);
    }

    renderFields(id){
       let days =  this.setDateToState(this.props.calendarData, this.state.allRates, id);
       //console.log(days)
        return days.map((day, key) => {
            return (
              <Table.Cell key={key} className={(day.isEndWeek ? "end-week": "")} onClick={(e) => this.openSideBar(day, id, e, this.props.calendarData.date)}>
                  <CalendarCheckMarks cellid={id} unit={day} />
              </Table.Cell>
            )
        })

    }

    renderUnits() {
        return this.state.units.map((unit) => {
            return (
                <Table.Row key={unit.id}>
                    <Table.Cell className="calendar-first-clm"><span className="first-col-type">({unit.type})</span> {unit.name}</Table.Cell>
                    { (Object.keys(this.state.allRates).length > 0) ? this.renderFields(unit.id) : null}
                </Table.Row>
            )
        })
    }

    render() {
        return (
            <Table.Body className="units-rows">
                {this.renderUnits(this.props.type)}
            </Table.Body>

        );
    }
}

