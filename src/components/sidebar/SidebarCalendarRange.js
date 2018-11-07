import React, { Component } from 'react';
import { connect } from "react-redux";

import { Input } from 'semantic-ui-react'

import 'rc-calendar/assets/index.css';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';
const now = moment();
//now.locale('en-gb').utcOffset(0);

function getFormat(time) {
    return time ? format : 'YYYY-MM-DD';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');
const timePickerElement = <TimePickerPanel />;
const SHOW_TIME = true;

class Picker extends Component {
    state = {
        showTime: SHOW_TIME,
        disabled: false,
        nowDate: now
    };

    componentWillMount() {
        if( this.props.calendarData.pickerDate ) {
            this.setState({nowDate: this.props.calendarData.pickerDate});
        }
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarData.pickerDate !== this.props.calendarData.pickerDate ) {
            this.setState({nowDate: nextProps.calendarData.pickerDate});
        }
        if( nextProps.calendarData.activeIndex !== this.props.calendarData.activeIndex ) {
            this.setState({nowDate: now });
        }
    }

    render() {
        const props = this.props;
        const calendar = (<Calendar
            locale={enUS}
            defaultValue={this.state.nowDate}
            timePicker={props.showTime ? timePickerElement : null}
            disabledDate={props.disabledDate}
        />);
        return (<DatePicker
            animation="slide-up"
            disabled={props.disabled}
            calendar={calendar}
            value={props.value}
            onChange={props.onChange}
        >
            {
                ({ value }) => {
                    return (
                        <span>
                 <Input
                     placeholder="dd/mm/yyyy"
                     disabled={props.disabled}
                     readOnly
                     value={(value && value.format(getFormat(props.showTime))) || ''} icon='calendar' iconPosition='left'  />
                </span>
                    );
                }
            }
        </DatePicker>);
    }
}


function mapStateToProps(state) {
    return {
        calendarData: state.calendarData
    };
}


export default connect(mapStateToProps)(Picker);