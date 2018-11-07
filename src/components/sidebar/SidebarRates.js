import React, { Component } from 'react';
import SelectUnits from '../../containers/SelectUnits';
import { Accordion, Icon } from 'semantic-ui-react';

import StandardRates from '../../containers/StandardRates';
import Discount from '../../containers/Discount';
import AddSpecialRate from '../../containers/AddSpecialRates';
import moment from 'moment';
import _ from 'lodash';

export default class SidebarRates extends Component{
    constructor(props){
        super(props);

        this.state = {
            unit: {},
            activeIndex: '',
            activeSpecial: '',
            midWeek: 0,
            endWeek: 0,
            discount: 0,
            specialRates: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(  nextProps.calendarPane.ratesSidebarOpen !== this.props.calendarPane.ratesSidebarOpen) {
            let data = nextProps.calendarPane.ratesSidebarOpen;
            this.setState({
              midWeek: data.unit.midWeek ? data.unit.midWeek.rateValue : '',
              endWeek: data.unit.endWeek ? data.unit.endWeek.rateValue: '',
              discount: data.unit.discount,
              unit: data.unit,
              specialRates: nextProps.rates.allRates[data.id].list})
        }

        if( nextProps.rates.selectedUnit !== this.props.rates.selectedUnit ) {
            let unitId = nextProps.rates.selectedUnit;
            let data = nextProps.rates.allRates[unitId];
            this.setState({
              midWeek: data.midWeek ? data.midWeek.rateValue : '',
              endWeek: data.endWeek ? data.endWeek.rateValue : '',
              discount: data.discount,
              unit: data,
                specialRates: nextProps.rates.allRates[unitId].list})
        }


        if( nextProps.rates.allRates !== this.props.rates.allRates && (nextProps.calendarPane.ratesSidebarOpen.id || nextProps.rates.selectedUnit) ) {
            let unitId = nextProps.rates.selectedUnit ? nextProps.rates.selectedUnit : nextProps.calendarPane.ratesSidebarOpen.id ;
            let data = nextProps.rates.allRates[unitId];
            this.setState({
              midWeek: data.midWeek ? data.midWeek.rateValue : '',
              endWeek: data.endWeek ? data.endWeek.rateValue : '',
              discount: data.discount,
              unit: data,
                specialRates: nextProps.rates.allRates[unitId].list})
        }

    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = this.state.activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    handleSpecial = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = this.state.activeSpecial === index ? -1 : index

        this.setState({ activeSpecial: newIndex })
        this.props.accordionOpen();
    }

    renderAddSpecialRates(){
        return this.state.specialRates.map((value, key) => {
            return (
                <div key={key}>
                    <Accordion.Title active={this.state.activeSpecial === key+1} index={key+1} onClick={this.handleSpecial}>
                        <div className="accordion-item">
                            <p>{_.replace(value.dateFrom, new RegExp("-","g"),"/")} - {_.replace(value.dateTo, new RegExp("-","g"),"/")}
                            <span>({value.title.length > 12 ? value.title.substring(0,12) : value.title} / {moment(value.dateTo).diff(moment(value.dateFrom), 'days')} nights)</span>
                            </p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content  active={this.state.activeSpecial === key+1}>
                        <AddSpecialRate accordUnitIndex={key} specialRate={value}/>
                    </Accordion.Content>
                </div>


            )
        })
    }

    render() {
        return (
            <div>
                <div className="sidebar-header">Rates</div>
                <SelectUnits />
                <Accordion className="accordion-list"  vertical="true">
                    <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                        <div className="accordion-item">
                            <p>Standart rates<span>({this.state.midWeek} ILS/{this.state.endWeek} ILS)</span></p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 0} content={<StandardRates/>} />

                    <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
                        <div className="accordion-item">
                            <p>2 and more nights discount<span>({this.state.discount}%)</span></p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 1} content={<Discount />} />

                    <hr/>
                </Accordion>

                <Accordion className="accordion-list"  vertical="true">
                    {this.renderAddSpecialRates()}
                    <Accordion.Title active={this.state.activeSpecial === 0} index={0} onClick={this.handleSpecial}>
                        <div className="accordion-item special-rate">
                            <p>add special rate</p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeSpecial === 0} content={<AddSpecialRate/>} />
                </Accordion>
            </div>
        )
    }
}