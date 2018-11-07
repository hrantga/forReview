import React, { Component } from 'react';
import SelectUnits from '../../containers/SelectUnits';
import { Accordion, Icon } from 'semantic-ui-react';
import moment from "moment";
import _ from "lodash";

import Periodic from '../../containers/Periodic';
import AddSpecialMinStay from '../../containers/AddSpecialMinStay';

export default class SidebarMinStay extends Component{
    constructor(props){
        super(props);

        this.state = {
            unit: {},
            activeIndex: '',
            activeSpecial: '',
            specialMinStay: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(  nextProps.minimumStay.specialMinimumStay !== this.props.minimumStay.specialMinimumStay) {
            this.setState({specialMinStay: nextProps.minimumStay.specialMinimumStay.list});
        }
        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit ) {
            this.props.getSpecialMinimumStay(nextProps.rates.selectedUnit);
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
    }

    renderAddSpecial(){
        return this.state.specialMinStay.map((value, key) => {
            return (
                <div key={key}>
                    <Accordion.Title active={this.state.activeSpecial === key+1} index={key+1} onClick={this.handleSpecial}>
                        <div className="accordion-item special-rate">
                            <p>{_.replace(value.dateFrom, new RegExp("-","g"),"/")} - {_.replace(value.dateTo, new RegExp("-","g"),"/")}<span>({value.title} / {moment(value.dateTo).diff(moment(value.dateFrom), 'days')} nights)</span></p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeSpecial === key+1} content={<AddSpecialMinStay minStaySpecial={value}/>} />
                </div>


            )
        })
    }

    render() {
        return (
            <div>
                <div className="sidebar-header">Minimum stay</div>
                <SelectUnits />
                <Accordion className="accordion-list"  vertical="true">
                    <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                        <div className="accordion-item">
                            <p>Periodic</p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 0} content={<Periodic/>} />
                </Accordion>
                <Accordion className="accordion-list min-stay-special"  vertical="true">
                    <hr/>
                    {this.renderAddSpecial()}
                    <Accordion.Title active={this.state.activeSpecial === 0} index={0} onClick={this.handleSpecial}>
                        <div className="accordion-item special-rate">
                            <p>add special </p>
                            <Icon name='angle down' />
                        </div>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeSpecial === 0} content={<AddSpecialMinStay/>} />
                </Accordion>
            </div>
        )
    }
}