import React, { Component } from 'react';
import {Form, Button, Icon, Select} from 'semantic-ui-react';
import { CountryDropdown } from 'react-country-region-selector';
import { FormErrors } from './FormErrors'
import _ from 'lodash';

const source = [
  { key: '0', text: 'Direct', value: 'direct' },
  { key: '1', text: 'Online', value: 'online' },

]

export default class GuestDetails extends Component{
    constructor(props){
        super(props);

        this.state = {
            country: 'Israel',
            source: 'direct',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            additionalPhone: '',
            textArea: '',
            formErrors: {country: '', source: '', email: '', firstName: '', lastName: '', phone: '', additionalPhone: '', requiredFields: [] },
            emailValid: false,
            phoneValid: false,
            additionalPhoneValid: true,
            formValid: false,
            disabledStatus: false
        }
    }
    componentWillMount(){
        if(this.props.reservation.guestDetails.firstName) {
            let guestDetails = this.props.reservation.guestDetails;
            let disabledStatus;
            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status === 'CheckedOut'
            }else{
                disabledStatus = false;
            }
            this.setState({
                disabledStatus,
                country: guestDetails.country,
                source: guestDetails.source,
                email: guestDetails.email,
                firstName: guestDetails.firstName,
                lastName: guestDetails.lastName,
                phone: guestDetails.phone,
                phoneValid: true,
                additionalPhone: guestDetails.additionalPhone ? guestDetails.additionalPhone : '',
                textArea: guestDetails.textArea ? guestDetails.textArea : '',
                formValid: true,
                emailValid: true,
                phoneValid: true,
            })
        }
        if(  Object.keys(this.props.calendarPane.calendarSidebarOpen).length > 0 && Object.keys(this.props.reservation.guestDetails).length === 0 && this.props.calendarPane.calendarSidebarOpen.status !== 'free')  {
            let guestDetails = this.props.calendarPane.calendarSidebarOpen.unit.guestDetails
            let disabledStatus;
            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status === 'CheckedOut'
            }else{
                disabledStatus = false;
            }
            this.setState({
                disabledStatus,
                country: guestDetails.country,
                source: guestDetails.source,
                email: guestDetails.email,
                firstName: guestDetails.firstName,
                lastName: guestDetails.secondName,
                phone: guestDetails.userPhone,
                phoneValid: true,
                additionalPhone: guestDetails.aditionalPhone ? guestDetails.aditionalPhone : '',
                textArea: guestDetails.specialRequirements ? guestDetails.specialRequirements : '',
                formValid: true,
                emailValid: true,
                phoneValid: true,
            })

        }
    }
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    selectCountry (val) {
        this.setState({ country: val });
        this.validateField('country', val);
    }

    selectSource = (val) => {
        this.setState({ source: val.target.innerText.toLowerCase() });
        this.validateField('source', val.target.innerText.toLowerCase());
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let phoneValid = this.state.phoneValid;
        let additionalPhoneValid = this.state.additionalPhoneValid;

        switch(fieldName) {
            case 'country':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'firstName':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'lastName':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'source':
                if(!value.length){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'email':
                if(value.length){
                    emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                    fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                }else {
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'phone':
                if(value.length){
                   // phoneValid = value.match(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/);
                    phoneValid = value.match(/^[+\d](?=.*[0-9])[ 0-9]+$/);
                    fieldValidationErrors.phone = phoneValid ? '': ' is invalid (must be digits, format +XX XXXX XXXX )';
                }else {
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
             case 'additionalPhoneValid':
                 additionalPhoneValid = value.match(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/);
                fieldValidationErrors.additionalPhone = additionalPhoneValid ? '': ' is invalid (must be digits, format +XX XXXX XXXX )';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            phoneValid: phoneValid,
            additionalPhoneValid: additionalPhoneValid
        }, this.validateForm);
    }



    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.phoneValid && this.state.firstName && this.state.lastName && this.state.country && this.state.source});
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

    onSubmit = (event, value) => {
        let than = this;
        const data = {
            country: this.state.country,
            source: this.state.source,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
            additionalPhone: this.state.additionalPhone,
            textArea: this.state.textArea,
        }
        if(than.state.formValid){
             this.props.guestDetails(data);
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


    render() {
        const disabledStatus = this.state.disabledStatus;
        return (
            <div className="guest-payment-details">
                {this.renderHeader(this.props.calendarPane.calendarSidebarOpen)}
                <div className="accordion-wrapper">
                    <h1><Icon onClick={() => this.props.switchPane(0)} name="arrow left"/>Guest details</h1>
                    <div>
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                    <Form size="mini" onSubmit={this.onSubmit}>
                        <Form.Group widths='equal' >
                            <Form.Input className="required-fields" width="5" name="firstName"  value={this.state.firstName} onChange={this.handleUserInput} disabled={disabledStatus} label='First name' />
                            <Form.Input className="required-fields" width="5" name="lastName" label='Last name' value={this.state.lastName} disabled={disabledStatus} onChange={this.handleUserInput} />
                        </Form.Group>
                        <Form.Input className="required-fields" fluid label='Email' name="email" value={this.state.email} disabled={disabledStatus} onChange={this.handleUserInput} />
                        <Form.Group widths='equal'>
                            <Form.Input className="required-fields" width="5" label='Phone' name="phone"  value={this.state.phone} disabled={disabledStatus} onChange={this.handleUserInput} />
                            <Form.Input width="5" label='Additional phone' name="additionalPhone"  value={this.state.additionalPhone} disabled={disabledStatus} onChange={this.handleUserInput} />
                        </Form.Group>
                        <div className="select-country country">
                            <Form.Field className="required-fields" width="16" label="Country" disabled={disabledStatus} />
                            <CountryDropdown value={this.state.country}  classes="country-styles" disabled={disabledStatus} name="country" onChange={(val) => this.selectCountry(val)}/>
                        </div>
                        <div className="select-country region">
                            <Form.Field control={Select} className="required-fields select-options" disabled={disabledStatus} width="16" label="Source" name="source" value={this.state.source} onChange={(val) => this.selectSource(val)} options={source}/>
       </div>
                        <Form.TextArea fluid="true" name="textArea" value={this.state.textArea} onChange={this.handleUserInput} disabled={disabledStatus} label='Special requirements'/>

                        <Form.Field width="16" className="ok-btn" control={Button} >OK</Form.Field>
                    </Form>
                </div>

            </div>
        )
    }
}