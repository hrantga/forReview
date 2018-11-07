import React, { Component } from 'react';
import { Button, Form, Input, Icon, Select } from 'semantic-ui-react';
import Picker from '../SidebarCalendarRange';
import { FormErrors } from '../main/FormErrors';
import _ from 'lodash';
import moment from 'moment';

const SHOW_TIME = true;
const options = [
    { key: '1', text: '1', value: '1' },
    { key: '2', text: '2', value: '2' },
    { key: '3', text: '3', value: '3' },
    { key: '4', text: '4', value: '4' },
    { key: '5', text: '5', value: '5' }

]

export default class Periodic extends Component {
    constructor(props){
        super(props);

        this.state = {
            days: [
              {'day': 'sun', 'active': false},
              {'day': 'mon', 'active': false},
              {'day': 'tue', 'active': false},
              {'day': 'wed', 'active': false},
              {'day': 'thu', 'active': false},
              {'day': 'fri', 'active': false},
              {'day': 'sat', 'active': false},
            ],
            fromDate: null,
            toDate: null,
            unitId: '',
            title: '',
            defValue: 1,
            minimumStay: 1,
            formErrors: { requiredFields: [] , fromDate: '', toDate: '', chooseDays: ''},
            toDateValid: false,
            fromDateValid: false,
            diff: ''
        }
        this.baseState = this.state;
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit ) {
            this.props.getPeriodicMinimumStay(nextProps.rates.selectedUnit);
            this.baseState.days = [
                {'day': 'sun', 'active': false},
                {'day': 'mon', 'active': false},
                {'day': 'tue', 'active': false},
                {'day': 'wed', 'active': false},
                {'day': 'thu', 'active': false},
                {'day': 'fri', 'active': false},
                {'day': 'sat', 'active': false},
            ]
            this.setState(this.baseState);
            this.setState({unitId: nextProps.rates.selectedUnit});
        }

        if( nextProps.minimumStay.periodicMinimumStay  !== this.props.minimumStay.periodicMinimumStay && Object.keys(nextProps.minimumStay.periodicMinimumStay).length > 0) {
            let periodic = nextProps.minimumStay.periodicMinimumStay;
            let  days = [...this.state.days];
            days.forEach(function (val) {
               let active =  periodic.affectedDays.find((day) => val.day.toUpperCase() === day )
                if(active) {
                   val.active = true;
                }else {
                    val.active = false;
                }
            });
            this.setState({fromDate: moment(periodic.dateFrom), toDate: moment(periodic.dateTo), minimumStay: periodic.minimumStayValue, days});
        }

    }
    onChange = (field, value) => {
        this.props.selectPicker(value);
        this.setState({[field]: value}, () => { this.validateField(field, value) });
        
        if(this.state.fromDate && field === "toDate"){
            let diff = value.diff(this.state.fromDate, 'days');
            this.setState({ diff })
        }
        
        if(this.state.toDate && field === "fromDate"){
            let diff = this.state.toDate.diff(value, 'days');
            this.setState({ diff })
        }
    }
    
    handleUserInput = (e, { name , value}) => {
        this.setState({[name]:  value}, () => { this.validateField(name, value) });
    }
    
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let fromDateValid = this.state.fromDateValid;
        let toDateValid = this.state.toDateValid;
        
        switch(fieldName) {
            case 'From':
                if(!value){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }else {
                    let fromDateValid = moment(value, 'YYYY/MM/DD').diff(moment(), 'days');
                    if(fromDateValid < 0){
                        fromDateValid = null;
                        fieldValidationErrors.fromDate = ' your date not valid';
                    }else {
                        fieldValidationErrors.fromDate = '';
                        
                    }
                    
                }
                break;
            case 'To':
                if(!value){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }else {
                    let toDateValid = moment(value, 'YYYY/MM/DD').diff(moment(), 'days');
                    if (toDateValid < 0) {
                        toDateValid = null;
                        fieldValidationErrors.toDate = ' your date not valid';
                    } else {
                        fieldValidationErrors.toDate = '';
                        
                    }
                }
                break;
            case 'minimumStay':
                if(!value){
                    fieldValidationErrors.requiredFields.push('Minimum Stay');
                }
                break;
            case 'chooseDays':
                if(!value){
                    fieldValidationErrors.requiredFields.push('Choose days');
                }
                break;
            case 'unitId':
                if(!value){
                    fieldValidationErrors.requiredFields.push('Select Unit');
                }
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors, fromDateValid: fromDateValid, toDateValid: toDateValid}, this.validateForm);
    }
    
    validateForm() {
        this.setState({formValid: this.state.fromDate &&  this.state.toDate &&  this.state.minimumStay && this.state.unitId});
    }
    
    disabledEndDate = (toDate) => {
        if (!toDate) {
            return false;
        }
        const fromDate = this.state.fromDate;
        if (!fromDate) {
            return false;
        }
        return SHOW_TIME ? toDate.isBefore(fromDate) :
            toDate.diff(fromDate, 'days') <= 0;
    }
    
    disabledStartDate = (fromDate) => {
        if (!fromDate) {
            return false;
        }
        const toDate = this.state.toDate;
        if (!toDate) {
            return false;
        }
        return SHOW_TIME ? toDate.isBefore(fromDate) :
            toDate.diff(fromDate, 'days') <= 0;
    }
    
    submit = (e, titleProps) => {
      let chooseDays = this.state.days.filter( days => days.active === true );
      let affectedDays = [];
      chooseDays.forEach(days => affectedDays.push(days.day.toUpperCase()));

      let unit = {
            From: moment(this.state.fromDate).format('YYYY-MM-DD'),
            To: moment(this.state.toDate).format('YYYY-MM-DD'),
            unitId: this.state.unitId,
            minimumStay: this.state.minimumStay,
            chooseDays: affectedDays
        }
        
        if(this.state.formValid && chooseDays){
            unit['title'] = this.state.title;
            this.props.updatePeriodicMinimumStay(this.state.unitId, unit);
        } else {
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({ formErrors });
            let that = this;
            _.forOwn(unit, function(value, key) {
                that.validateField(key, value);
            } );
        }
        
    }

  handleWeekDay(index){
        let days = this.state.days;
        days[index].active = !days[index].active;
        this.setState({ days })
  }

  renderWeekDays(){
    return this.state.days.map((value, key) => {
      return (
        <div key={key} onClick={() => this.handleWeekDay(key)} className={'week-days-periodic ' + (value.active ? 'periodic-active' : '')}>
          {value.day}
        </div>


      )
    })
  }

    render() {
        return (
            <Form size="mini">
                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form.Field required>
                  <label>Choose days</label>
                  <div className='week-days'>
                    {this.renderWeekDays()}
                  </div>
                </Form.Field>

                <Form.Field control={Input} name="title" onChange={this.handleUserInput} label='Title' placeholder=''/>
                <Form.Group widths='equal'>
                    <Form.Field width="6" required>
                        <label>From</label>
                        <Picker
                            disabledDate={this.disabledStartDate}
                            value={this.state.fromDate}
                            onChange={this.onChange.bind(this, 'fromDate')}
                        />
                    </Form.Field>
                    <Form.Field width="6" required>
                        <label>To</label>
                        <Picker
                            disabledDate={this.disabledEndDate}
                            value={this.state.toDate}
                            onChange={this.onChange.bind(this, 'toDate')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group >
                    <Form.Field width="6" value={this.state.minimumStay} label="Minimum stay" name="minimumStay"  control={Select}  options={options} onChange={this.handleUserInput} required/>
                </Form.Group>
                <hr/>
                <Form.Group inline>
                    <label className="displayed-date">Standard rates will be displayed in the calendar from 14/1/2018 to 18 months ahead.</label>
                </Form.Group>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="4" className="close-btn" control={Button} onClick={this.submit.bind(this)}>Set</Form.Field>
                    <Form.Field width="4" className="clear-btn">Delete</Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

