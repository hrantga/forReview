import React, { Component } from 'react';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import Picker from '../SidebarCalendarRange';
import { FormErrors } from '../main/FormErrors';
import _ from 'lodash';
import moment from 'moment';

const SHOW_TIME = true;

export default class AddSpecialOpenClose extends Component {
    constructor(props){
        super(props);

        this.state = {
            fromDate: null,
            toDate: null,
            unitId: '',
            title: '',
            minimumStay: null,
            formErrors: { requiredFields: [] , fromDate: '', toDate: ''},
            toDateValid: false,
            fromDateValid: false,
            diff: ''
        }
    }
    
    onChange = (field, value) => {
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
        this.setState({formValid: this.state.fromDate &&  this.state.toDate && this.state.unitId});
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
        let unit = {
            From: this.state.fromDate,
            To: this.state.toDate,
            unitId: this.state.unitId
        }
        
        if(this.state.formValid){
            unit['title'] = this.state.title;
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

    render() {
        return (
            <Form size="mini">
                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form.Field control={Input} label='Title' onChange={this.handleUserInput} placeholder=''/>
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
                <hr/>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="4" className="close-btn" control={Button} onClick={this.submit}>Close</Form.Field>
                    <Form.Field width="4" ><div className="delete cl-op-delete"><Icon name='trash outline' /><span>Delete</span></div></Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

