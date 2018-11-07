import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { getMonthDays } from '../../utils/date'
import { mapDataToDaysRates, mapDataToActiveDays } from '../../utils/data'
import RatesCheckMarks from './RatesCheckMarks'

export default class CalendarContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            days: [],
            activeDays: {},
            units: []
        }
    }

    componentWillMount(){
        if(this.props.calendarData.units.length > 0 && Object.keys(this.props.rates.allRates).length > 0){
            //this.setDateToState(this.props.calendarData,this.props.rates.allRates)
            this.setState({ allRates: this.props.rates.allRates, units: this.props.calendarData.units })
        }

    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarData.units !== this.props.calendarData.units ) {
            this.getRatesAll(nextProps.calendarData.units);
        }

        if( nextProps.rates.allRates !== this.props.rates.allRates ) {
            this.setState({ allRates: nextProps.rates.allRates, units: nextProps.calendarData.units })
        }

        if( nextProps.rates.activeDays !== this.props.rates.activeDays ) {
            this.setState({ activeDays: nextProps.rates.activeDays })
        }
    }

    getRatesAll(units){
        this.props.getAllRates(units);
    }

    setDateToState(data, rates, id){
        let date = moment(data.date);
        let days = getMonthDays(date, -2, 28, this.props.calendarData.hotel);
        if(Object.keys(this.state.activeDays).length > 0 && this.state.activeDays.unitId === id){
            days = mapDataToActiveDays(days, this.state.activeDays);
        }
        let daysArr = mapDataToDaysRates(days, id, rates);

        return daysArr;
    }

    renderFields(id){
        let days =  this.setDateToState(this.props.calendarData, this.state.allRates, id);
        return days.map((day, key) => {
            let unit ;
            if(day.isEndWeek && day.type !== 'Special'){
                unit = day.endWeek;
            }else{
                (day.type === 'Special') ?  unit = day.special :  unit = day.midWeek;
            }
            let data = {unit, type: day.type, discount:day.discount, isEndWeek: day.isEndWeek, activeDay: day.activeDay
            }
            return (
                <Table.Cell key={key} onClick={(e) => this.props.openSidebarRates(day, id, e, this.props.calendarData.date)}>
                   <RatesCheckMarks unit={data} />
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
                {this.renderUnits(this.props.type)}
            </Table.Body>

        );
    }
}

