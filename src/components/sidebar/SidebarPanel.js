import React, { Component } from 'react';
import { Sidebar, Segment, Button, Icon, Tab } from 'semantic-ui-react';
import Panes from '../../containers/Panes';
import classNames from 'classnames'


import SidebarCalendar from '../../containers/SidebarCalendar';
import SidebarRates from '../../containers/SidebarRates';
import SidebarMinStay from '../../containers/SidebarMinStay';
import SidebarClosedOpen from '../../containers/SidebarClosedOpen';
import GuestDetails from '../../containers/GuestDetails';
import PaymentDetails from '../../containers/PaymentDetails';


const panes = [
    {  render: () => <Tab.Pane><SidebarCalendar /></Tab.Pane> },
    {  render: () => <Tab.Pane><SidebarRates /></Tab.Pane> },
    {  render: () => <Tab.Pane><SidebarMinStay /></Tab.Pane> },
    {  render: () => <Tab.Pane><SidebarClosedOpen /></Tab.Pane> },
    {  render: () => <Tab.Pane><GuestDetails /></Tab.Pane> },
    {  render: () => <Tab.Pane><PaymentDetails /></Tab.Pane> },
]

class SidebarPanel extends Component {
    state = { visible: false, activeIndex: 0 ,ratesSidebarOpen: {}, moveLeft: false }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarPane.activeIndex !== this.props.calendarPane.activeIndex ) {
            let visible = false;
            if(nextProps.calendarPane.activeIndex === 4 || nextProps.calendarPane.activeIndex === 5 || this.props.calendarPane.activeIndex === 4 || this.props.calendarPane.activeIndex === 5){
                visible = true;
            }
            this.setState({activeIndex: nextProps.calendarPane.activeIndex, visible})
        }

        if(nextProps.calendarPane.ratesSidebarOpen !== this.props.calendarPane.ratesSidebarOpen && Object.keys(nextProps.calendarPane.ratesSidebarOpen).length > 0){
            this.setState({ visible: true, ratesSidebarOpen: nextProps.calendarPane.ratesSidebarOpen, moveLeft: nextProps.calendarPane.ratesSidebarOpen.unit.moveLeft });
        }

        if(nextProps.calendarPane.calendarSidebarOpen !== this.props.calendarPane.calendarSidebarOpen && Object.keys(nextProps.calendarPane.calendarSidebarOpen).length > 0){
            this.setState({ visible: true, ratesSidebarOpen: nextProps.calendarPane.calendarSidebarOpen, moveLeft: nextProps.calendarPane.calendarSidebarOpen.unit.moveLeft });
        }

        if(nextProps.calendarPane.openClosedSidebar !== this.props.calendarPane.openClosedSidebar && Object.keys(nextProps.calendarPane.openClosedSidebar).length > 0){
            this.setState({ visible: true});
        }

        if(nextProps.calendarPane.openSidebar !== this.props.calendarPane.openSidebar && nextProps.calendarPane.openSidebar){
            this.setState({ visible: true});
        }

        if(nextProps.calendarPane.close && Object.keys(nextProps.calendarPane.calendarSidebarOpen).length === 0 ){
            this.setState({ visible: false});
            this.props.closedSet();
        }
    }

    toggleVisibility = () => {
        this.setState({visible: !this.state.visible})
        this.props.openSidebarReset();
    }

    getClasses() {
        return classNames({
            'sidebar-btn': true,
            'sidebar-open': this.state.visible ,

        })
    }


    render() {
        let liClasses = this.getClasses();
        return (
            <div>
                <Button onClick={this.toggleVisibility} icon className={liClasses}><Icon className={this.state.visible ? 'open': 'close'} name={'caret '+(this.state.visible ? 'right': 'left')} /></Button>
                <Sidebar.Pushable as={Segment}>
                    {<Sidebar className="calendar-sidebar " animation='overlay' width='very wide' direction="right" visible={this.state.visible} icon='labeled' vertical="true" inverted="true">
                        <Tab panes={panes} activeIndex={this.state.activeIndex} />
                    </Sidebar>}
                    <Sidebar.Pusher>
                        <Segment basic>
                            <Panes />
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

export default SidebarPanel;