import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import classNames from 'classnames'

import {getMonthDays} from '../../utils/date'
import CalendarControlers from '../../containers/CalendarControls';
import CalendarContent from '../../containers/CalendarContent';
import CalendarContentRates from '../../containers/CalendarContentRates';
import CalendarContentCloseOpen from '../../containers/CalendarContentCloseOpen';

class Calendar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showingDays: [],
            currentDay: '',
            currentMonth: '',
            currentYear: ''
        }
    }

    componentWillMount(){
        this.props.getHotel();
        this.props.getUnits();

    }

    componentDidMount(){
        if (Object.keys(this.props.calendarData.hotel).length > 0 ){
            this.setDateToState(this.props.calendarData);
        }
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarData.hotel !== this.props.calendarData.hotel ) {
            this.setDateToState(nextProps.calendarData);
        }
        if( nextProps.calendarData.date !== this.props.calendarData.date ) {
            this.setDateToState(nextProps.calendarData);
        }

    }

    setDateToState(data){
        let date = moment(data.date);
        let days = getMonthDays(date, -2, 28, data.hotel);

        this.setState({
            showingDays: days,
            currentDay:  date.format('D'),
            currentMonth:  date.format('MMMM'),
            currentYear:  date.format('YYYY')
        });
    }
    getClasses(value) {
        return classNames({
            'active-date': value.day === this.state.currentDay,
            'end-week': value.isEndWeek

        })
    }
    renderDays(){
        return this.state.showingDays.map((value, key) => {
            return (
                <Table.HeaderCell key={key} active={(this.state.currentDay === value.day)} className={this.getClasses(value)}>
                    <div></div>
                    <span className="short-mounth">{value.month}</span>
                    <br/>
                    <span className="day-number">{value.day}</span>
                    <br/>
                    <span className="short-week">{value.weekDay}</span>
                </Table.HeaderCell>

            )
        })
    }

    renderMandY(){
        return (
            <Table.HeaderCell key={this.state.currentMonth} rowSpan='2' className="calendar-first-clm">{this.state.currentMonth} {this.state.currentYear}</Table.HeaderCell>
        )
    }

    getContentByPane(type) {
        switch (type) {
            case'close-open':
                return CalendarContent;
            case'rates':
            case'stay':
            case'open':
                return CalendarContentRates;
            default:
                return CalendarContent;
        }
    }

    render() {
        const CalendarComponentByType = this.getContentByPane(this.props.panesType);
        const showLegend = this.props.calendarPane.activeIndex === 0 || this.props.calendarPane.activeIndex === 4 || this.props.calendarPane.activeIndex === 5 || this.props.calendarPane.activeIndex === 3
        return (
            <div className="calendar-wrap">
                <CalendarControlers />
                <Table celled structured>
                    <Table.Header>
                        <Table.Row className="calendar-days">
                            {this.renderMandY()}
                            {this.renderDays()}
                        </Table.Row>
                    </Table.Header>
                    <CalendarComponentByType type={this.props.panesType} days={this.state.showingDays} />
                    <Table.Footer fullWidth className={Object.keys(this.props.calendarData.hotel).length > 0 && showLegend ? '' :'hide-legend'}>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>
                                <div className="calendar-legend">
                                    <div className="legend"><div className="checked-out-cicle"></div><span>Checked out</span></div>
                                    <div className="legend"><div className="in-house-cicle"></div><span>In House</span></div>
                                    <div className="legend"><div className="confirm-on-cicle"></div><span>Confirmed reservation(offline)</span></div>
                                    <div className="legend"><div className="confirm-off-cicle"></div><span>Confirmed reservation(online)</span></div>
                                    <div className="legend"><div className="group-cicle"><div></div><div></div><div></div></div><span>Group reservation</span></div>
                                    <div className="legend"><div className="closed-cicle"></div><span>Closed room</span></div>
                                </div>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        );
    }
}

export default Calendar;
