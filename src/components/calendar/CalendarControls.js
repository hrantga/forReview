import React, { Component } from 'react';
import { Dropdown, Button, Icon  } from 'semantic-ui-react';
import moment from 'moment';
import {startMonth, endMonth} from '../../utils/date';
import CalendarNotification from '../../containers/CalendarNotification';

class CalendarControlers extends Component{

    constructor(props) {
        super(props);

        this.state = {
            dropDownYears: [],
            monthsList: [],
            currentDate: '',
            currentDay: '',
            currentMonth: '',
            currentYear: '',
            startDate: '',
            endDate: '',
            outOffDateMore: false,
            outOffDateLess: false,
            monthShow: 12,
            unit: '',
            rates: '',
            index: ''

        }
    }

    componentDidMount(){
        this.setDateToState(this.props.calendarData.date)
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarData.date !== this.props.calendarData.date ) {
            this.setDateToState(nextProps.calendarData.date);
        }

        if(nextProps.calendarPane.openClosedSidebar.moveDays !== this.props.calendarPane.openClosedSidebar.moveDays) {
            this.moveDays(nextProps.calendarPane.openClosedSidebar.moveDays);
        }
          if(nextProps.calendarPane.ratesSidebarOpen.moveDays !== this.props.calendarPane.ratesSidebarOpen.moveDays) {
            this.moveDays(nextProps.calendarPane.ratesSidebarOpen.moveDays);
        }

        if( nextProps.rates.allRates !== this.props.rates.allRates ) {
            let rates = 0
            for (var key in nextProps.rates.allRates) {
                if (nextProps.rates.allRates[key].list.length > 0 || nextProps.rates.allRates[key].endWeek || nextProps.rates.allRates[key].midWeek) {
                    rates++;
                }
            }

            if(rates === 0 && this.props.calendarPane.activeIndex === 0){
                this.props.switchPane(1);
                return;
            }
            this.setState({
                units: this.props.calendarData.units.length,
                rates,
                index: this.props.calendarPane.activeIndex
            })
        }

        if( nextProps.calendarPane.activeIndex !== this.props.calendarPane.activeIndex ) {
            let rates = 0
            for (var key in nextProps.rates.allRates) {
                if (nextProps.rates.allRates[key].list.length > 0 || nextProps.rates.allRates[key].endWeek || nextProps.rates.allRates[key].midWeek) {
                    rates++;
                }
            }
            this.props.selectPicker(moment())
            if(rates === 0 && nextProps.calendarPane.activeIndex === 0){
                this.props.switchPane(1);
                return;
            }
            this.setState({
                units: this.props.calendarData.units.length,
                rates,
                index: nextProps.calendarPane.activeIndex
            })
        }

    }

    setDateToState(data){
        let date = moment(data);
        let years = [], months = [];
        let startDate = startMonth(date, -2);
        let endDate = endMonth(date, 28);
        let startYear = date.format('YYYY')-2;
        let maxDate = date.diff(moment(),'month');
        let yearsLength = Math.ceil(moment().add(18,'month').diff(date,'month')/12)+2;
        let monthLength = date.diff(moment(),'month') + 12;
        let monthShow = this.state.monthShow;
        if(date.diff(moment(),'month') > 0 && date.format('YYYY')*1 !== this.state.currentYear){
            console.log(moment().format('M'));
            console.log(monthLength-12+ moment().format('M')*1);
            monthShow = monthLength > 18 && date.format('YYYY') !== moment().format('YYYY') ? (monthLength-12 + moment().format('M')*1) : 12;
        }else if(date.format('YYYY') === moment().format('YYYY') || date.diff(moment(),'year') < 0) {
            monthShow = 12;
        }
        let outOffDateMore = maxDate >= 18 ;
        let outOffDateLess = maxDate <= -18 ;
        months =  Array.apply(0, Array(monthShow)).map(function(_,i){return moment().month(i).format('MMM')})

        for(let i=0;i<yearsLength;i++){
            years.push({key: i,value: startYear+i,text: startYear+i})
        }




        this.setState({
            currentDay:  date.format('D'),
            currentMonth:  date.format('MMM'),
            currentYear:  1*date.format('YYYY'),
            dropDownYears: years,
            currentDate: date,
            monthsList: months,
            startDate: startDate,
            endDate: endDate,
            outOffDateMore,
            outOffDateLess,
            monthShow
        }, this.getCalendar);
    }

    renderMonths(){
        return this.state.monthsList.map((month) => {
            return (
                <Button onClick={() => this.selectMonth(month)}  className="months"key={month} active={(month === this.state.currentMonth)} >{month}</Button>
            )
        })
    }

    getCalendar() {
      this.props.getReservations(this.state.startDate, this.state.endDate);
    }

    onChangeYear = (e, {name, value}) => {
        if(this.props.calendarData.units.length === 0) return;
        this.setState({currentYear:  value, currentMonth: 'Jan'});
        this.props.selectYear(value);

    }

    selectMonth (month){
        if(this.props.calendarData.units.length === 0) return;
        this.setState({currentMonth: month});
        this.props.selectMonth(`${this.state.currentYear}/${moment().month(month).format('MM')}/01`);
    }

    selectToday (){
        if(this.props.calendarData.units.length === 0) return;
        let date = moment().format('YYYY/MM/DD');
        this.setDateToState(date);
        this.props.selectToday(date);
    }

    selectWeek (move){
        if(this.props.calendarData.units.length === 0) return;
        let nextWeekDate = '';
        const offset = move === 'inc' ? 7 : -7;
        nextWeekDate = this.state.currentDate.clone().add(offset, 'day').format('YYYY/MM/DD');
        this.props.selectWeek(nextWeekDate);
    }

    moveDays(days){
        if(this.props.calendarData.units.length === 0) return;
        let nextWeekDate = '';
        nextWeekDate = this.state.currentDate.clone().add(days, 'day').format('YYYY/MM/DD');
        this.props.selectWeek(nextWeekDate);
    }

    renderNotifications(){
        if(this.state.units !== this.state.rates && this.state.units ){
            return (
                <CalendarNotification index={this.state.index} ratesCount={this.state.rates}/>
            )
        }
    }

    render(){
        return(
            <div>
                {this.state.rates >= 0 && this.renderNotifications()}
                <Dropdown className="year-swith" name="year" onChange={this.onChangeYear} floating  selection options={this.state.dropDownYears} value={this.state.currentYear} icon="angle down"/>
                {this.renderMonths()}
                <Button onClick={() => this.selectToday()} className="months today">Today</Button>
                <div className="switch-week">
                    <Button onClick={() => this.selectWeek('dec')} disabled={this.state.outOffDateLess}><Icon name='angle left' /></Button>
                    <span>7</span>
                    <Button onClick={() => this.selectWeek('inc')} disabled={this.state.outOffDateMore}><Icon  name='angle right' /></Button>
                </div>
            </div>
        )
    }
}

export default CalendarControlers;
