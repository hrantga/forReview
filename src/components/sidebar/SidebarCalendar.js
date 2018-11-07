import React, { Component } from 'react';

//import CheckedOut from './main/CheckedOut';
//import Confirmed from './main/Confirmed';
//import InHouse from './main/InHouse';
import NewReservation from '../../containers/NewReservation';

export default class SidebarCalendar extends Component{
    constructor(props){
        super(props);

        this.state = {
            unit: {},
            activeIndex: '',
            midWeek: 0,
            endWeek: 0,
            discount: 0
        }
    }

    componentWillMount(){
        if(this.props.calendarPane.calendarSidebarOpen > 0){
            this.setState({ unit: this.props.calendarPane.calendarSidebarOpen })
        }

    }

    componentWillReceiveProps(nextProps) {
        if(  nextProps.calendarPane.calendarSidebarOpen !== this.props.calendarPane.calendarSidebarOpen && Object.keys(nextProps.calendarPane.calendarSidebarOpen).length > 0) {
            let data = nextProps.calendarPane.calendarSidebarOpen;
          this.setState({
            midWeek: data.midWeek ? data.midWeek.rateValue : 0,
            endWeek: data.endWeek ? data.endWeek.rateValue : 0,
            discount: data.discount ? data.discount : 0,
            unit: data})
        }
        /*if(  nextProps.calendarPane.calendarSidebarOpen !== this.props.calendarPane.calendarSidebarOpen) {
            let data = nextProps.calendarPane.calendarSidebarOpen.unit;
            this.setState({midWeek: data.midWeek.rateValue, endWeek: data.endWeek.rateValue, discount: data.discount, unit: data})
        }*/
    }

    getSidebarByType(unit) {
        /*if(unit.isReserved){
            return Confirmed;
        }*/

        return NewReservation;

    }

    render() {
        const SidebarComponentByType = this.getSidebarByType(this.state.unit);
        return (
            <div>
                <SidebarComponentByType calendar={this.state.unit}/>
            </div>
        )
    }
}