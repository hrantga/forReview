import React, { Component } from 'react';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import Picker from '../SidebarCalendarRange';
import moment from 'moment';
import _ from 'lodash';
import { FormErrors } from '../main/FormErrors';


const SHOW_TIME = true;

export default class AddSpecialRate extends Component {
    constructor(props){
        super(props);

        this.state = {
            unitId: '',
            fromDate: null,
            toDate: null,
            diff: '',
            title: '',
            standardRate: '',
            singleRate: '',
            adults: '',
            children: '',
            babies: '',
            update: false,
            titleActive: true,
            formErrors: { requiredFields: [], title: '', standardRate: '', singleRate: '', adults: '', children: '', babies: ''},
            titleValid: true,
            standardValid: false,
            singleValid: true,
            adultsValid: true,
            childrenValid: true,
            babiesValid: true,
            formValid: false,
            specialRatesError: ''
        }

        this.textInput = React.createRef();
        this.baseState = this.state;
    }
    componentWillMount(){
        if( this.props.specialRate) {
            let specialRate = this.props.specialRate;
            this.setState({
                unitId: this.props.rates.selectedUnit ? this.props.rates.selectedUnit : this.props.calendarPane.ratesSidebarOpen.id,
                id: specialRate.id,
                fromDate: moment(specialRate.dateFrom),
                toDate: moment(specialRate.dateTo),
                diff: moment(specialRate.dateTo).diff(moment(specialRate.dateFrom), 'days'),
                title: specialRate.title,
                standardRate: specialRate.rateValue,
                singleRate: specialRate.singleRateValue,
                adults: specialRate.extraAdult,
                children: specialRate.extraChild,
                babies: specialRate.extraBaby,
                update: true,
                titleValid: true,
                standardValid: true,
                singleValid: true,
                adultsValid: true,
                childrenValid: true,
                babiesValid: true,
                formValid: true
            })
        }
    }
    componentDidMount() {
        this.textInput.current.focus();
    }

        componentWillReceiveProps(nextProps) {
        if(  nextProps.calendarPane.ratesSidebarOpen !== this.props.calendarPane.ratesSidebarOpen) {
            let id =  nextProps.calendarPane.ratesSidebarOpen.id;
            this.setState({unitId : id})
            this.textInput.current.focus();
        }
        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit ) {
            this.setState({unitId: nextProps.rates.selectedUnit},this.validateForm)
            this.textInput.current.focus();
        }

        if( nextProps.rates.accordionOpen) {
            this.setState({ titleActive: true })
        }
    }

    onChange = (field, value) => {
        this.props.selectPicker(value);
        this.setState({
            [field]: value,
        },this.validateForm);
        this.state.titleActive = false;

        let data = {};
        let id = this.props.rates.selectedUnit ? this.props.rates.selectedUnit : this.props.calendarPane.ratesSidebarOpen.id;

        if(this.state.fromDate && field === "toDate"){
            let diff;
            if(!this.state.fromDate || !value){
                diff = '';
            }else {
                diff = value.diff(this.state.fromDate, 'days') + 1;
            }
            this.setState({ diff })
            data = {'checkIn': this.state.fromDate, 'checkOut': value, diff}
            this.props.selectedActiveDays(id, data)
        }

        if(this.state.toDate && field === "fromDate"){
            let diff;
            if(!this.state.toDate || !value){
                diff = '';
            }else {
                diff = this.state.toDate.diff(value, 'days') + 1;
            }

            this.setState({ diff });
            data = {'checkIn': value, 'checkOut': this.state.toDate, diff}
            this.props.selectedActiveDays(id, data)
        }
    }

    disabledEndDate = (toDate) => {
        if (!toDate) {
            return false;
        }
        const fromDate = this.state.fromDate;
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
        return SHOW_TIME ? toDate.isBefore(fromDate) : toDate.diff(fromDate, 'days') <= 0;
    }

    handleUserInput = (e, { name , value}) => {
        this.setState({[name]:  value}, () => this.validateField(name, value));
        if(name !== 'title'){
            this.state.titleActive = false;
        }else {
            this.state.titleActive = true;
        }
    }

    handleActiveTitle = (name) => {
        if(name !== 'title'){
            this.setState({ titleActive: false })
        }else {
            this.setState({ titleActive: true })
        }
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let titleValid = this.state.titleValid;
        let standardValid = this.state.standardValid;
        let singleValid = this.state.singleValid;
        let adultsValid = this.state.adultsValid;
        let childrenValid = this.state.childrenValid;
        let babiesValid = this.state.babiesValid;

        switch(fieldName) {
            case 'dateFrom':
                if(!value){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'title':
                if(value){
                    titleValid = value.match(/[$-/:-?{-~!"^_`\[\]]/) ? false : true;
                    fieldValidationErrors.title = titleValid && value.length <= 25 ? '' : ' should not be more than 25 symbols ';
                }
                break;
            case 'standardRate':
                if(value){
                    if(fieldValidationErrors.requiredFields){
                     let errorIndex = fieldValidationErrors.requiredFields.find((e) => e === fieldName)
                     if(errorIndex) fieldValidationErrors.requiredFields.splice(errorIndex,1);
                    }
                    standardValid = value.match(/^[0-9]{0,6}$/);
                    if(standardValid) {
                        fieldValidationErrors.standardValid = '';
                    }else {
                        fieldValidationErrors.standardValid = ' allow digits only ';
                        break;
                    }
                    fieldValidationErrors.standardValid = (value*1 <= 100000) ? '' : ' exceeds max value of 100000 ';
                }else{
                    if(!fieldValidationErrors.requiredFields.find((e) => e === fieldName)) fieldValidationErrors.requiredFields.push(fieldName);
                    standardValid = false;
                }
                break;
            case 'singleRate':
                if(value){
                    singleValid = value.match(/^[0-9]{0,6}$/);
                    if(singleValid) {
                        fieldValidationErrors.singleValid = '';
                    }else {
                        fieldValidationErrors.singleValid = ' allow digits only ';
                        break;
                    }
                    fieldValidationErrors.singleValid = (value*1 <= 100000) ? '' : ' exceeds max value of 100000 ';
                }else {
                    fieldValidationErrors.singleValid = '';
                }
                break;
            case 'adults':
                if(value){
                    adultsValid = value.match(/^[0-9]{0,6}$/);
                    if(adultsValid) {
                        fieldValidationErrors.adultsValid = '';
                    }else {
                        fieldValidationErrors.adultsValid = ' allow digits only ';
                        break;
                    }
                    fieldValidationErrors.adultsValid = (value*1 <= 100000) ? '' : ' exceeds max value of 100000 ';
                }else {
                    fieldValidationErrors.adultsValid = '';
                }
                break;
            case 'children':
                if(value){
                    childrenValid = value.match(/^[0-9]{0,6}$/);
                    if(childrenValid) {
                        fieldValidationErrors.childrenValid = '';
                    }else {
                        fieldValidationErrors.childrenValid = ' allow digits only ';
                        break;
                    }
                    fieldValidationErrors.childrenValid = (value*1 <= 100000) ? '' : ' exceeds max value of 100000 ';
                }else {
                    fieldValidationErrors.childrenValid = '';
                }
                break;
            case 'babies':
                if(value){
                    babiesValid = value.match(/^[0-9]{0,6}$/);
                    if(babiesValid) {
                        fieldValidationErrors.babiesValid = '';
                    }else {
                        fieldValidationErrors.babiesValid = ' allow digits only ';
                        break;
                    }
                    fieldValidationErrors.babiesValid = (value*1 <= 100000) ? '' : ' exceeds max value of 100000 ';
                }else {
                    fieldValidationErrors.babiesValid = '';
                }
                break;
            case 'dateTo':
                if(!value){
                    fieldValidationErrors.requiredFields.push(fieldName);
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
        this.setState({formErrors: fieldValidationErrors, titleValid, standardValid, singleValid, adultsValid, childrenValid, babiesValid}, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.fromDate && this.state.toDate && this.state.unitId && this.state.titleValid && this.state.singleValid && this.state.standardValid && this.state.adultsValid && this.state.childrenValid && this.state.babiesValid
        });
    }

    addSpecialRate = (e, titleProps) => {
        let unit = {
            "unitId": this.state.unitId,
            "dateFrom": this.state.fromDate,
            "dateTo": this.state.toDate,
        }
        if(this.state.formValid){
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({ formErrors });
            let data = {
                "title": this.state.title.length === 0 || this.state.title.match(/^[ ]$/) ? 'no title' : this.state.title,
                "dateFrom": this.state.fromDate.format('YYYY-MM-DD'),
                "dateTo": this.state.toDate.format('YYYY-MM-DD'),
                "rateValue": this.state.standardRate,
                "singleRateValue": this.state.singleRate,
                "extraAdult": this.state.adults,
                "extraChild": this.state.children,
                "extraBaby": this.state.babies,
            }

            if(this.state.update){
                let unitId = this.props.rates.selectedUnit ? this.props.rates.selectedUnit : this.props.calendarPane.ratesSidebarOpen.id;
                this.props.updateSpecialRates(this.state.id, unitId, data);
            }else {
                this.props.createSpecialRates(this.state.unitId, data);
                this.setState(this.baseState);
            }

            this.setState({ formErrors: {} });
        }else {
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({ formErrors });
            let that = this;
            _.forOwn(unit, function(value, key) {
                that.validateField(key, value);
            } );
        }


    }

    deleteSpecialRate = () => {
        if(this.state.update){
            let id = this.props.rates.selectedUnit ? this.props.rates.selectedUnit : this.props.calendarPane.ratesSidebarOpen.id;
            this.props.deleteSpecialRates(id, this.state.id);
        }else {
            this.setState(this.baseState);
            this.setState({ formErrors: {} });
        }

    }

    render() {
        const buttonClear = this.state.update ? (<div className="delete"><Icon name='trash outline' /><span>Delete</span></div>) : (<div className="delete"><span>Clear</span></div>);
        return (
            <Form size="mini" onSubmit={()=> this.addSpecialRate}>
                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form.Field control={Input} value={this.state.title} name="title" onChange={this.handleUserInput} onClick={() => this.handleActiveTitle('title')} label='Title'>
                    <Input type="text"  value={this.state.title} name="title" onChange={this.handleUserInput} placeholder='' ref={this.textInput} focus={this.state.titleActive}/>
                </Form.Field>

                <Form.Group widths='equal'>
                    <Form.Field width="6" required onClick={this.handleActiveTitle}>
                        <label>From</label>
                        <Picker
                            disabledDate={this.disabledStartDate}
                            value={this.state.fromDate}
                            onChange={this.onChange.bind(this, 'fromDate')}
                        />
                    </Form.Field>
                    <Form.Field width="6" required onClick={this.handleActiveTitle}>
                        <label>To</label>
                        <Picker
                            disabledDate={this.disabledEndDate}
                            value={this.state.toDate}
                            onChange={this.onChange.bind(this, 'toDate')}
                        />
                    </Form.Field>
                    <Form.Field width="1" className="nights" control={Input} value={this.state.diff} disabled label='Nights'/>
                </Form.Group>
                <hr/>
                <Form.Group widths='equal'>
                    <Form.Field control={Input} value={this.state.standardRate} name="standardRate" onChange={this.handleUserInput} onClick={this.handleActiveTitle} label='Standard rate(2 guests)' placeholder='ILS' required/>
                    <Form.Field control={Input} value={this.state.singleRate} name="singleRate" onChange={this.handleUserInput} onClick={this.handleActiveTitle} label='Single rate' placeholder='ILS' />
                </Form.Group>
                <Form.Group inline>
                    <label><span>Extras:</span></label>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field width="4" control={Input} value={this.state.adults} name="adults" onChange={this.handleUserInput} onClick={this.handleActiveTitle} label='Adults' placeholder='ILS'/>
                    <Form.Field  width="4" control={Input} value={this.state.children} name="children" onChange={this.handleUserInput} onClick={this.handleActiveTitle} label='Children (ages 2-12)' placeholder='ILS' />
                    <Form.Field width="4" control={Input} value={this.state.babies} name="babies" onChange={this.handleUserInput} onClick={this.handleActiveTitle} label='Babeis (under 2)' placeholder='ILS' />
                </Form.Group>
                <hr/>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="6" className={'reserve-btn ' + (this.state.update || this.state.formValid ? 'edit-rate' : '')} control={Button} onClick={this.addSpecialRate.bind(this)} disabled={!this.state.formValid}>{this.state.update ? 'Update' : 'Set'} Rates</Form.Field>
                    <Form.Field width="4" onClick={this.deleteSpecialRate.bind(this)}>{buttonClear}</Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

