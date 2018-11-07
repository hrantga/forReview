import React, { Component } from 'react';
import { Popup, List } from 'semantic-ui-react';
import classNames from 'classnames';


export default class RatesCheckMarks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unit: {},
            discount: '',
            type: ''
        }
    }

    componentWillMount(){
       /* let unit;

        if(this.props.unit.isEndWeek){
            unit = this.props.unit.endWeek;
        }else{
            (this.props.unit.type === 'Special') ?  unit = this.props.unit.special :  unit = this.props.unit.midWeek;
        }

        this.setState({ unit, type: this.props.unit.type, discount: this.props.unit.discount })*/
    }

    getClasses(unit) {
        return classNames({
            'rates-popup': true,
            'end-week': unit.isEndWeek,
            'active-day': unit.activeDay,
        })
    }



    renderUnitRatesPopup(){
        return (
            <List className="popup-unit-info">
                <List.Item><p>{this.props.unit.unit && this.props.unit.type} rates</p></List.Item>
                <List.Item><span>Standart(2):</span> <span className="unit-data">₪{this.props.unit.unit && this.props.unit.unit.rateValue}</span></List.Item>
                <List.Item><span>Single:</span> <span className="unit-data">₪{this.props.unit.unit && this.props.unit.unit.singleRateValue}</span></List.Item>
                <List.Item>Extras:</List.Item>
                <List.Item><span>Adults</span> <span className="unit-data">₪{this.props.unit.unit && this.props.unit.unit.extraAdult}</span></List.Item>
                <List.Item><span>Children(ages 2-12)</span> <span className="unit-data">₪{this.props.unit.unit && this.props.unit.unit.extraChild}</span></List.Item>
                <List.Item><span>Babies(under 2)</span> <span className="unit-data">₪{this.props.unit.unit && this.props.unit.unit.extraBaby}</span></List.Item>
                <List.Item></List.Item>
                <List.Item className="unit-total-price"><span>2 and more nights <br/> discount</span> <span className="unit-data">{this.props.unit.discount}%</span></List.Item>
            </List>
        )
    }

    calendarCheckMarks(){
        let classList = this.getClasses(this.props.unit);
        return (
            <Popup  trigger={<div className={classList}><span>{this.props.unit.unit ? this.props.unit.unit.rateValue : ''}</span></div>}  className="free" flowing hoverable>
                {this.renderUnitRatesPopup()}
            </Popup>
        )
    }

    render() {
        return (
            this.calendarCheckMarks()
        );
    }
}
