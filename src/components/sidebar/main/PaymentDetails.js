import 'rc-calendar/assets/index.css';
import React, { Component } from 'react';
import MonthCalendar from 'rc-calendar/lib/MonthCalendar';
import DatePicker from 'rc-calendar/lib/Picker';
import { Form, Button, Icon } from 'semantic-ui-react';
import { FormErrors } from './FormErrors'
import _ from 'lodash';
import moment from 'moment';

export default class PaymentDetails extends Component{
    constructor(props){
        super(props);

        this.state = {
            cardholderName: '',
            creditCardNumber: '',
            expirationDate: '',
            cvv: '',
            formErrors: {cardholderName: '', creditCardNumber: '', expirationDate: '', cvv: '', requiredFields: [] },
            cardholderNameValid: false,
            creditCardNumberValid: false,
            expirationDateValid: true,
            CVVValid: false,
            disabledStatus: false
        }
    }

    componentWillMount(){
        if(this.props.reservation.paymentDetails.cardholderName) {
            let paymentDetails = this.props.reservation.paymentDetails;
            let disabledStatus;
            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
            }else{
                disabledStatus = false;
            }
            this.setState({
                disabledStatus,
                cardholderName: paymentDetails.cardholderName,
                creditCardNumber: paymentDetails.creditCardNumber,
                expirationDate: moment(paymentDetails.expirationDate),
                cvv: paymentDetails.cvv,
                formValid: true

        })
        }
        if(  Object.keys(this.props.calendarPane.calendarSidebarOpen).length > 0 && Object.keys(this.props.reservation.paymentDetails).length === 0 && this.props.calendarPane.calendarSidebarOpen.status !== 'free')  {
            let paymentDetails = this.props.calendarPane.calendarSidebarOpen.unit.paymentDetails
            let disabledStatus;
            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
            }else{
                disabledStatus = false;
            }
            this.setState({
                disabledStatus,
                cardholderName: paymentDetails.cardholderName,
                creditCardNumber: paymentDetails.creditCardNumber,
                expirationDate: moment(paymentDetails.expirationDate),
                cvv: paymentDetails.cvv,
                formValid: true
            })

        }
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let creditCardNumberValid = this.state.creditCardNumberValid;
        let expirationDateValid = this.state.expirationDateValid;
        let CVVValid = this.state.CVVValid;

        switch(fieldName) {
            case 'cardholderName':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'creditCardNumber':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }else {
                    creditCardNumberValid = value.match(/^(?:[0-9]{16}(?:[0-9]{3})?)$/);
                    fieldValidationErrors.creditCardNumber = creditCardNumberValid ? '': ' is invalid (must be only 16 digits)';
                }
                break;
            case 'expirationDate':
                if(!value){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }else {
                    let expirationDateValid = moment(value, 'MM/YYYY').diff(moment(), 'months');
                    if(expirationDateValid < 0){
                        expirationDateValid = null;
                        fieldValidationErrors.expirationDate = ' your card expiration date out.';
                    }else {
                        fieldValidationErrors.expirationDate = '';
                    }
                }
                break;
            case 'cvv':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }else{
                    CVVValid = value.match(/^(?:[0-9]{3}(?:[0-9]{3})?)$/);
                    fieldValidationErrors.cvv = CVVValid ? '': ' is invalid (must be only 3 digits)';
                }
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            creditCardNumberValid: creditCardNumberValid,
            expirationDateValid: expirationDateValid,
            CVVValid: CVVValid
        }, this.validateForm);
    }



    validateForm() {
        this.setState({formValid: this.state.creditCardNumberValid && this.state.expirationDateValid && this.state.CVVValid && this.state.cardholderName});
    }

    expiration = (value) => {
        this.setState({expirationDate: value },() => { this.validateField('expirationDate', value)});
    }

    onSubmit = (event, value) => {
        let than = this;
        const data = {
            cardholderName: this.state.cardholderName,
            creditCardNumber: this.state.creditCardNumber,
            expirationDate: moment(this.state.expirationDate).format('YYYY-MM-DD'),
            cvv: this.state.cvv
        }

        if(this.state.formValid){
            this.props.paymentDetails(data);
            this.props.switchPane(0);
        }else {
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({ formErrors })
            _.forOwn(data, function(value, key) {
                than.validateField(key, value);
            } );
        }


    }

    renderHeader(value){
        switch(value.status) {
            case 'reserved':
                return (
                    <div className={"sidebar-header " + (value.unit.guestDetails.source === "direct" ? "reserved-header-offline" : "reserved-header-online" )}>Confirmed Reservation ({value.unit.guestDetails.source === "1" ? "offline" : "online"})</div>
                )
                break;
            case 'inHouse':
                return (
                    <div className="sidebar-header in-house-header">In House</div>
                )
                break;
            case 'CheckedOut':
                return (
                    <div className="sidebar-header checked-out-header">Checked Out</div>
                )
                break;
            default:
                return (
                    <div className="sidebar-header">New Reservation</div>
                )
                break;
        }
    }


    render() {
        const disabledStatus = this.state.disabledStatus;
        const calendar = (<MonthCalendar />);
        return (
            <div className="guest-payment-details">
                {this.renderHeader(this.props.calendarPane.calendarSidebarOpen)}
                <div className="accordion-wrapper">
                    <h1><Icon onClick={() => this.props.switchPane(0)} name="arrow left"/>Payment details</h1>
                    <div>
                        <Icon name="lock"/>
                        Credit card details are secured
                    </div>
                    <hr/>
                    <div>
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                    <Form size="mini" className='required-fields' onSubmit={this.onSubmit}>
                        <Form.Input fluid label='Cardholder Name' name="cardholderName" placeholder='e.g. johndoe' value={this.state.cardholderName} onChange={this.handleUserInput} disabled={disabledStatus}/>
                        <Form.Input fluid label='Credit Card Number' name="creditCardNumber" placeholder='0000-0000-0000-0000-0000' value={this.state.creditCardNumber} onChange={this.handleUserInput} disabled={disabledStatus}/>
                        <Form.Group widths='equal'>
                            <DatePicker animation="slide-up" calendar={calendar} onChange={this.expiration}>
                                {() => {return (<Form.Input width="5" label='Expiration Date'  placeholder='mm/yyyy' readOnly value={this.state.expirationDate && this.state.expirationDate.format('MM/YYYY')} disabled={disabledStatus}/>);}}
                            </DatePicker>
                            <Form.Input width="5" label='CVV' name="cvv"  placeholder='000' value={this.state.cvv} onChange={this.handleUserInput} disabled={disabledStatus}/>
                        </Form.Group>
                        <Form.Field width="16" className="ok-btn" control={Button}>OK</Form.Field>
                    </Form>
                </div>

            </div>
        )
    }
}