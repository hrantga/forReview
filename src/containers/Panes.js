import React, { Component } from 'react';
import { connect } from "react-redux";
import Calendar from './Calendar';
import { Tab } from 'semantic-ui-react';
import moment from 'moment';

import { switchPane } from '../actions/active_pane_action';
import { selectToday } from "../actions/calendar_actions";



const panes = [
    { menuItem: 'Calendar', render: () => <Tab.Pane><Calendar panesType="calendar" startMonth="-2" endMonth="28"/></Tab.Pane> },
    { menuItem: 'Rates', render: () => <Tab.Pane><Calendar panesType="rates" startMonth="-2" endMonth="28"/></Tab.Pane> },
    { menuItem: 'Minimum stay', render: () => <Tab.Pane><Calendar panesType="calendar" startMonth="-2" endMonth="28"/></Tab.Pane> },
    { menuItem: 'Close/Open units', render: () => <Tab.Pane><Calendar panesType="close-open" startMonth="-2" endMonth="28"/></Tab.Pane> },
]

class Panes extends Component{
    state = { activeIndex: 0 };

    componentWillMount(){
        this.props.calendarData.activeIndex = this.state.activeIndex;
    }
    componentWillReceiveProps(nextProps) {
        if(  nextProps.calendarPane.activeIndex !== this.props.calendarPane.activeIndex && nextProps.calendarPane.activeIndex < 4) {
            this.setState({ activeIndex: nextProps.calendarPane.activeIndex})
        }
    }



    handleTabChange = (e, { activeIndex }) => {
        if(Object.keys(this.props.calendarData.hotel).length > 0 ){
            let date = moment().format('YYYY/MM/DD');

            this.setState({ activeIndex });
            this.props.switchPane(activeIndex);
            this.props.selectToday(date);
        }
    }

    render(){
        const { activeIndex } = this.state
        return(
            <Tab menu={{ secondary: true, pointing: true }} activeIndex={activeIndex} panes={panes} onTabChange={this.handleTabChange}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        calendarPane: state.calendarPane
    };
}


export default connect(mapStateToProps, { switchPane, selectToday })(Panes);