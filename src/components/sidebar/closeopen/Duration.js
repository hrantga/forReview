import React, { Component } from 'react';
import { Button, Form, Input, Icon, Checkbox } from 'semantic-ui-react';
import Picker from '../SidebarCalendarRange'
import { FormErrors } from '../main/FormErrors';
import _ from 'lodash';
import moment from 'moment';

const SHOW_TIME = true;

export default class Duration extends Component {
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
            index: '',
            chooseCheck: '',
            closedId: '',
            minimumStay: null,
            formErrors: { requiredFields: [] , fromDate: '', toDate: ''},
            toDateValid: false,
            fromDateValid: false,
            diff: '',
            updated: false
        }

        this.baseState = this.state;
    }

    componentWillMount(){
          if(this.props.accordClosedUnit){
              this.setState({
                  unitId: this.props.closedUnitId,
                  fromDate: moment(this.props.accordClosedUnit.dateFrom),
                  toDate: moment(this.props.accordClosedUnit.dateTo),
                  title: this.props.accordClosedUnit.title,
                  diff: moment(this.props.accordClosedUnit.dateTo).diff(moment(this.props.accordClosedUnit.dateFrom), 'days'),
                  updated: true,
                  index: this.props.accordUnitIndex,
                  closedId: this.props.accordClosedUnit.id
              })
          }
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit ) {
            this.setState({unitId: nextProps.rates.selectedUnit,  formErrors: { requiredFields: [] , fromDate: '', toDate: ''}});
        }
            if( nextProps.calendarPane.openClosedSidebar !== this.props.calendarPane.openClosedSidebar) {
                this.setState({
                    unitId: nextProps.calendarPane.openClosedSidebar.id,
                    fromDate: moment(nextProps.calendarPane.openClosedSidebar.date),
                    toDate: moment(nextProps.calendarPane.openClosedSidebar.date).add(1,'day'),
                    unitId: nextProps.calendarPane.openClosedSidebar.id,
                    diff: 1,
                    formErrors: { requiredFields: [] , fromDate: '', toDate: ''}
                })
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

    handleCheckbox = (name, value ) => {
        this.setState({[name]:  !value});
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
            case 'unitId':
                if(!value){
                    fieldValidationErrors.requiredFields.push('Select Unit');
                }
                break;
            case 'title':
                if(!value){
                    fieldValidationErrors.requiredFields.push('Title');
                }
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors, fromDateValid: fromDateValid, toDateValid: toDateValid}, this.validateForm);
    }
    
    validateForm() {
        this.setState({formValid: this.state.fromDate &&  this.state.toDate && this.state.unitId});
    }
    
    disabledEndDate = (toDate) => {
        if (!toDate) {
            return false;
        }
        const fromDate = this.state.fromDate.clone().add(1, 'day');
        if (!fromDate) {
            return false;
        }
        return SHOW_TIME ? toDate.isBefore(fromDate) : toDate.diff(fromDate, 'days') <= 0;
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
        let unit = {
            From: this.state.fromDate ? moment(this.state.fromDate).format('YYYY-MM-DD') : '',
            To: this.state.toDate ? moment(this.state.toDate).format('YYYY-MM-DD') : '',
            unitId: this.state.unitId,
            title: this.state.title
        }
        
        if(this.state.formValid){
            let chooseDays = this.state.days.filter( days => days.active === true );
            let affectedDays = [];
            chooseDays.forEach(days => affectedDays.push(days.day.toUpperCase()));

            if(this.state.chooseCheck){
                unit['chooseDays'] = affectedDays;
            }
            if(this.state.updated){
                this.props.updateClosedUnit(this.state.unitId, unit, this.state.closedId);
            }else {
                this.props.createClosedUnits(this.state.unitId, unit);
                let closed = this.state.closed;
                let unitId = this.state.unitId;
                this.setState(this.baseState);
                this.setState({closed, unitId});
            }

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

    remove = (e, titleProps) => {
        if(this.state.updated){
            this.props.removeClosedUnit(this.state.unitId, this.state.closedId)
        }else {
            let closed = this.state.closed;
            let unitId = this.state.unitId;
            this.setState(this.baseState);
            this.setState({closed, unitId});
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
                <Form.Field control={Input} className="required-fields"  label='Title' name="title" value={this.state.title} onChange={this.handleUserInput} placeholder=''/>
                <Form.Group widths='equal'>
                    <Form.Field width="5" required>
                        <label>From</label>
                        <Picker
                            disabledDate={this.disabledStartDate}
                            value={this.state.fromDate}
                            onChange={this.onChange.bind(this, 'fromDate')}
                        />
                    </Form.Field>
                    <Form.Field width="5" required>
                        <label>To</label>
                        <Picker
                            disabledDate={this.disabledEndDate}
                            value={this.state.toDate}
                            onChange={this.onChange.bind(this, 'toDate')}
                        />
                    </Form.Field>
                    <Form.Field width="2" control={Input} value={this.state.diff} disabled label='Nights'/>
                </Form.Group>
              <Form.Field>
                <Checkbox name='chooseCheck' value={this.state.chooseCheck} onChange={() => this.handleCheckbox('chooseCheck', this.state.chooseCheck)} label='Close unit only on this week days (periodic)' />
              </Form.Field>
              <Form.Field disabled={!this.state.chooseCheck}>
                <label>Choose days</label>
                <div className='week-days'>
                  {this.renderWeekDays()}
                </div>
              </Form.Field>
                <hr/>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="4" className={"close-btn " + (this.state.updated ? 'updated-closed' : '') } control={Button} onClick={this.submit}>{this.state.updated ? 'Update' : 'Set'}</Form.Field>
                    <Form.Field width="4" className="clear-btn" onClick={this.remove}>{this.state.updated ? 'Remove' : 'Clear'}</Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

