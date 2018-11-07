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

export default class AddSpecialMinStay extends Component {
    constructor(props){
        super(props);

        this.state = {
            fromDate: null,
            toDate: null,
            title: '',
            unitId: '',
            minimumStay: null,
            specialId: '',
            formErrors: { requiredFields: [] , fromDate: '', toDate: ''},
            formValid: false,
            toDateValid: false,
            fromDateValid: false,
            diff: ''
        }

        this.baseState = this.state;
    }

    componentWillMount(){
        if( this.props.minStaySpecial) {
            this.setState({ fromDate: moment(this.props.minStaySpecial.dateFrom),
                toDate: moment(this.props.minStaySpecial.dateTo),
                title: this.props.minStaySpecial.title,
                minimumStay: this.props.minStaySpecial.minimumStayValue,
                diff: this.props.minStaySpecial.minimumStayValue,
                specialId: this.props.minStaySpecial.id,
                unitId: this.props.rates.selectedUnit
            })
        }
    }


    componentWillReceiveProps(nextProps) {
        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit ) {
           // this.props.getPeriodicMinimumStay(nextProps.rates.selectedUnit);
            this.setState({unitId: nextProps.rates.selectedUnit});
        }

        /*if( nextProps.minimumStay.periodicMinimumStay  !== this.props.minimumStay.periodicMinimumStay ) {
            let periodic = nextProps.minimumStay.periodicMinimumStay;
            let  days = this.state.days;
            days.forEach(function (val) {
                let active =  periodic.affectedDays.find((day) => val.day.toUpperCase() === day )
                if(active) {
                    val.active = true;
                }else {
                    val.active = false;
                }
            });
            this.setState({fromDate: moment(periodic.dateFrom), toDate: moment(periodic.dateTo), defValue: periodic.minimumStayValue, days});
        }*/

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
        this.setState({[name]:  value}, () => this.validateField(name, value));
    }
    
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let fromDateValid = this.state.fromDateValid;
        let toDateValid = this.state.toDateValid;
        if(fieldValidationErrors.requiredFields === undefined){
            fieldValidationErrors = {requiredFields: []}
        }
        
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
            From: moment(this.state.fromDate).format('YYYY-MM-DD'),
            To: moment(this.state.toDate).format('YYYY-MM-DD'),
            unitId: this.state.unitId,
            minimumStay: this.state.minimumStay
        }

        if(this.state.formValid){
            unit['title'] = this.state.title;
            if(this.state.specialId){
                this.props.updateSpecialMinimumStay(this.state.unitId, unit, this.state.specialId);
            }else {
                this.props.createSpecialMinimumStay(this.state.unitId, unit);
                this.baseState.unitId = unit.unitId;
                this.baseState.formErrors = {requiredFields: [] , fromDate: '', toDate: ''};
                this.setState(this.baseState);
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

    delete = (e, titleProps) => {
            if(this.state.specialId){
                this.props.deleteSpecialMinimumStay(this.state.unitId, this.state.specialId);
            }else {
                this.baseState.unitId = this.state.unitId;
                this.baseState.formErrors = {requiredFields: [] , fromDate: '', toDate: ''};
                this.setState(this.baseState);
            }
    }

    render() {
        return (
            <Form size="mini">
                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form.Field control={Input} value={this.state.title} name="title" label='Title' onChange={this.handleUserInput} placeholder=''/>
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
                <Form.Field width="6" value={this.state.minimumStay} label="Minimum stay" name="minimumStay"  control={Select}  options={options} onChange={this.handleUserInput} required/>

                <hr/>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="4" className="close-btn" control={Button} onClick={this.submit.bind(this)}>Set</Form.Field>
                    <Form.Field width="4" onClick={this.delete.bind(this)}><div className="delete cl-op-delete"><Icon name='trash outline' /><span>Delete</span></div></Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

