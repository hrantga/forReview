import React, { Component } from 'react';
import { Popup, List, Icon } from 'semantic-ui-react';
import classNames from 'classnames';
import moment from 'moment';


export default class ClosedCheckMarks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unit: {},
            discount: '',
            type: ''
        }
    }

    getClasses(unit) {
        return classNames({
            'icon-center': unit.iconPosition,
            'one-day': unit.drawLength === 2,
            'icon-side': !unit.iconPosition,
            'checkmark-start': unit.drawStart,
            'checkmark-mid': unit.drawMid,
            'checkmark-end': unit.drawEnd,
            'checkmark-start-end': unit.drawStart && unit.drawEnd,
            'is-closed': unit.type === 'closed',
            'rates-popup': true,
            'active-day': unit.activeDay,
        })
    }



    renderUnitRatesPopup(unit){
        return (
            <List className="popup-unit-info">
                <List.Item><p>Closed</p></List.Item>
                <List.Item><span>Title:</span> <span className="unit-data">{unit.title}</span></List.Item>
                <List.Item><span>Date-from/to:</span> {moment(unit.dateFrom).format('YYYY/MM/DD')}-{moment(unit.dateTo).format('YYYY/MM/DD')}</List.Item>
            </List>
        )
    }

    calendarCheckMarks(){
        let unit = this.props.unit;
        let classList = this.getClasses(unit);
        if(unit.closed){

            if(unit.drawEnd && unit.drawStart){
                let  start = {...unit};
                let  end = {...unit};

                start.drawEnd = false;
                end.drawStart = false;

                let startClasses = this.getClasses(start);
                let endClasses = this.getClasses(end);
                if(this.props.unit.icon){
                    return(
                        <div>
                            <Popup  trigger={<div className={endClasses}></div>}  className="free" flowing hoverable>
                                {this.renderUnitRatesPopup(unit.closed)}
                            </Popup>
                            <Popup  trigger={<div className={startClasses}><Icon name="lock"/></div>}  className="free" flowing hoverable>
                                {this.renderUnitRatesPopup(unit.startInfo)}
                            </Popup>
                        </div>
                    )
                }else {
                    return (
                        <div>
                            <Popup  trigger={<div className={endClasses}></div>}  className="free" flowing hoverable>
                                {this.renderUnitRatesPopup(unit.closed)}
                            </Popup>
                            <Popup  trigger={<div className={startClasses}></div>}  className="free" flowing hoverable>
                                {this.renderUnitRatesPopup(unit.startInfo)}
                            </Popup>
                        </div>
                    )
                }

            }

            if(this.props.unit.icon){
                return (
                    <Popup  trigger={<div className={classList}><Icon name="lock"/></div>}  className="free" flowing hoverable>
                        {this.renderUnitRatesPopup(unit.closed)}
                    </Popup>
                )
            }else {
                return (
                    <Popup  trigger={<div className={classList}></div>}  className="free" flowing hoverable>
                        {this.renderUnitRatesPopup(unit.closed)}
                    </Popup>
                )
            }

        }else{
            return(
                    <div className={classList}></div>
                )

        }


    }

    render() {
        return (
            this.calendarCheckMarks()
        );
    }
}
