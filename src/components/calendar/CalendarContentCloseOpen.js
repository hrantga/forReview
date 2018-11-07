import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { getMonthDays } from '../../utils/date'
import { mapDataToDaysClosed } from '../../utils/data'
import ClosedCheckMarks from './ClosedCheckMarks'

export default class CalendarContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      days: [],
      units: [],
      closeOpen: []
    }
  }

  componentWillMount(){
      if(this.props.calendarData.units.length > 0 && Object.keys(this.props.closedUnits.allClosed).length === 0){
          this.getCloseOpenAll(this.props.calendarData.units);
      }
      if(this.props.calendarData.units.length > 0 && Object.keys(this.props.closedUnits.allClosed).length > 0){
          this.setState({ units: this.props.calendarData.units, closeOpen: this.props.closedUnits.allClosed })
      }
  }

  componentWillReceiveProps(nextProps) {
      if( nextProps.calendarData.units !== this.props.calendarData.units ) {
          this.getCloseOpenAll(nextProps.calendarData.units);
      }
      if( nextProps.closedUnits.allClosed !== this.props.closedUnits.allClosed) {
          this.setState({ units: nextProps.calendarData.units, closeOpen: nextProps.closedUnits.allClosed })
      }
  }

  getCloseOpenAll(units){
     this.props.getAllClosed(units);
  }

  setDateToState(data, closeOpen, id){
    let date = moment(data.date);
    let days = getMonthDays(date, -2, 28, this.props.calendarData.hotel);
    let daysArr = mapDataToDaysClosed(days, id, closeOpen);

    return daysArr;
  }

    openSideBar(day, id, e, date){
        if(day.isClosed) {
            if(day.closedEnd && day.closedStart || day.closedStart || day.closedMid){
                return
            }
        }
        //this.props.resetAllDate();
        this.props.openClosedSidebar(day, id, e, date);
    }

  renderFields(id){
    let days =  this.setDateToState(this.props.calendarData, this.state.closeOpen, id);
    return days.map((day, key) => {
      return (
        <Table.Cell className={(day.isEndWeek ? "end-week": "")} key={key} onClick={(e) => this.openSideBar(day, id, e, this.props.calendarData.date)}>
          <ClosedCheckMarks unit={day} />
        </Table.Cell>
      )
    })

  }

  renderUnits() {
    return this.state.units.map((unit) => {
      return (
        <Table.Row key={unit.id}>
          <Table.Cell className="calendar-first-clm"><span className="first-col-type">({unit.type})</span> {unit.name}</Table.Cell>
          {this.renderFields(unit.id)}
        </Table.Row>
      )
    })
  }

  render() {
    return (
      <Table.Body className="units-rows">
          {this.renderUnits()}
      </Table.Body>

    );
  }
}

