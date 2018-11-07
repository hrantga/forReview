import React, { Component } from 'react';
import SelectUnits from '../../containers/SelectUnits';
import { Accordion, Icon } from 'semantic-ui-react';
import moment from 'moment';

import Duration from '../../containers/Duration';
import AddSpecialOpenClose from './closeopen/AddSpecialOpenClose';

export default class SidebarCloseOpen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            unit: {},
            activeIndex: '',
            activeIndexLast: '',
            closed: [],
            unitId: ''
        }
    }
    componentWillMount(){

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.calendarPane.openClosedSidebar !== this.props.calendarPane.openClosedSidebar && Object.keys(this.props.closedUnits.allClosed).length > 0) {
            let closed = nextProps.closedUnits.allClosed[nextProps.calendarPane.openClosedSidebar.id];
            this.setState({ closed, unitId: nextProps.calendarPane.openClosedSidebar.id});
        }

        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit && Object.keys(this.props.closedUnits.allClosed).length > 0) {
            let closed = this.props.closedUnits.allClosed[nextProps.rates.selectedUnit];

            this.setState({closed, unitId: nextProps.rates.selectedUnit});
        }
        if( nextProps.closedUnits.allClosed !== this.props.closedUnits.allClosed &&  Object.keys(this.props.calendarPane.openClosedSidebar).length > 0) {
            this.setState({ closed: nextProps.closedUnits.allClosed[nextProps.calendarPane.openClosedSidebar.id], unitId: nextProps.calendarPane.openClosedSidebar.id })
        }
    }
        handleClick = (e, titleProps) => {
            const {index} = titleProps
            const newIndex = this.state.activeIndex === index ? -1 : index

            this.setState({activeIndex: newIndex,activeIndexLast: ''})
        }


    renderClosedUnitList(){
            return this.state.closed.map((value, key) => {
                return (
                    <div key={key}>
                        <Accordion.Title active={this.state.activeIndex === key+2} index={key+2} onClick={this.handleClick}>
                            <div className="accordion-item">
                                <p><Icon name='lock'/>  <span>{moment(value.dateFrom).format('YYYY/MM/DD')} - {moment(value.dateTo).format('YYYY/MM/DD')}</span> <span>({value.title} / {moment(value.dateTo).diff(moment(value.dateFrom), 'days')} nights) </span></p>
                                <Icon name='angle down' />
                            </div>
                        </Accordion.Title>
                        <Accordion.Content  active={this.state.activeIndex === key+2}>
                            <Duration closedUnitId={this.state.unitId} accordUnitIndex={key} accordClosedUnit={value}/>
                        </Accordion.Content>
                    </div>


                )
            })
    }

    renderClosedUnit(){
            return (
                <div>
                    <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
                        <div className="accordion-item">
                            <p><Icon name='lock'/> Close Unit</p>
                            <Icon name='angle down'/>
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 1} content={<Duration/>}/>
                </div>
            )
    }

        render()
        {
            return (
                <div>
                    <div className="sidebar-header">Close/Open units</div>
                    <SelectUnits />

                    <Accordion className="accordion-list closed-list" vertical="true">
                        {this.renderClosedUnitList()}
                        {this.state.closed.length === 0 && this.renderClosedUnit()}
                        <hr/>
                        <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                        <div className="accordion-item">
                            <p><Icon name='lock'/> Close Unit</p>
                            <Icon name='angle down'/>
                        </div>
                    </Accordion.Title>
                        <Accordion.Content active={this.state.activeIndex === 0} content={<Duration/>}/>
                    </Accordion>
                </div>
            )
        }
    }
