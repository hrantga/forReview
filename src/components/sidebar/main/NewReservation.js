import React, { Component } from 'react';
import { Accordion, Icon, Form, Button, Dropdown, Input } from 'semantic-ui-react';
import Prices from './Prices'
import { FormErrors } from './FormErrors';

import { calculateTotalPrice } from '../../../utils/ratesCalculator';
import {startMonth, endMonth} from '../../../utils/date'

import AddUnit from '../../../containers/AddUnit';
import moment from "moment/moment";

const addDiscountOption = [
    { key: '0', text: '-', value: '-' },
    { key: '1', text: '+', value: '+' }
]

const optionsType = [
    { key: '1', text: '%', value: '%' },
    { key: '2', text: '₪', value: 'simple' },
]

export default class NewReservation extends Component {
    constructor(props){
        super(props);

        this.state = {
            units: [],
            unitPrice: '',
            guestFilled: false,
            paymentFilled: false,
            firstName: '',
            lastName: '',
            phone: '',
            activeIndex: 0,
            midWeek: 0,
            endWeek: 0,
            price: '',
            discountSize: '',
            addDiscount: '',
            action: '',
            discount: '',
            total: '',
            validDiscount: true,
            disabledStatus: false,
            paymentDisabled: false,
            minimumStay: 1,
            formErrors: { requiredFields: [], fromToBusy: '',  Discount: ''}
        }

        this.baseState = this.state;
    }
    componentWillMount(){
        if(this.props.reservation.guestDetails.firstName) {
            let details = this.props.reservation.guestDetails;
            this.setState({ guestFilled: true, firstName: details.firstName, lastName: details.lastName, phone: details.phone})
        }

        if(this.props.reservation.paymentDetails.cardholderName) {
            this.setState({ paymentFilled: true })
        }

        if(  this.props.reservation.units.length > 0 && Object.keys(this.props.rates.allRates).length > 0) {
            let units = this.props.reservation.units;
            let price = calculateTotalPrice(units);
            let disabledStatus;
            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
            }else{
                disabledStatus = false;
            }

            let activeIndex = (units.length === 0 || (this.props.calendarPane.calendarSidebarOpen.status === 'free' && units.length === 0) || (units.length === 0 && this.props.calendarPane.calendarSidebarOpen.status === undefined)) ? 0 : null;
            this.calculateDiscount(price, this.state.discountSize);
            this.setState({ units, unitPrice: '', disabledStatus,  price, total: price, activeIndex });

        }

        if(  Object.keys(this.props.calendarPane.calendarSidebarOpen).length > 0 && this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.reservation.units.length === 0) {
            let calendar = this.props.calendarPane.calendarSidebarOpen
            let filled = calendar.status === 'free' ? false : true;
            let disabledStatus;
            let units =  calendar.unit.units.length >  0 ? calendar.unit.units : [];
            let price = calculateTotalPrice(units);

            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
            }else{
                disabledStatus = false;
            }
            let activeIndex =  (calendar.unit.units.length === 0 || (this.props.calendarPane.calendarSidebarOpen.status === 'free' && calendar.unit.units.length === 0) || (calendar.unit.units.length === 0 && this.props.calendarPane.calendarSidebarOpen.status === undefined)) ? 0 : null;
            let discount = this.props.calendarPane.calendarSidebarOpen.unit.discount;
            if(discount){
                if(discount.discountSign){
                    this.setState({
                        addDiscount: discount.discountSign,
                        action: discount.discountType === 'abs' ? 'simple' : '%',
                        discount: discount.discountType === 'abs' ? discount.discountValue : Math.abs(price - calendar.unit.totalPrice),
                        discountSize: discount.discountValue,
                    })
                }
                else{
                    this.setState({
                        addDiscount: '',
                        action: '',
                        discount: '',
                        discountSize: '',
                    })
                }
            }else{
                this.setState({
                    addDiscount: '',
                    action: '',
                    discount: '',
                    discountSize: '',
                })
            }
            this.setState({
                disabledStatus,
                paymentDisabled: this.props.calendarPane.calendarSidebarOpen.unit.paymentDetails === null,
                activeIndex,
                units,
                unitPrice: '',
                guestFilled: filled,
                paymentFilled: filled,
                price,
                total: price,
                firstName: this.props.reservation.guestDetails ? this.props.reservation.guestDetails.firstName : calendar.unit.firstName,
                lastName: this.props.reservation.guestDetails ? this.props.reservation.guestDetails.lastName : calendar.unit.secondName,
                phone: this.props.reservation.guestDetails ? this.props.reservation.guestDetails.phone : calendar.unit.phone}, () => this.calculateDiscount())

        }

        if(  Object.keys(this.props.calendarPane.calendarSidebarOpen).length > 0 && this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.reservation.units.length > 0) {
            let calendar = this.props.calendarPane.calendarSidebarOpen
            let filled = calendar.status === 'free' ? false : true;
            let disabledStatus;
            let units =  calendar.unit.units.length > 0 ? calendar.unit.units.concat(this.props.reservation.units) : [];
            let price = calculateTotalPrice(units);

            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
            }else{
                disabledStatus = false;
            }
            let activeIndex =  (calendar.unit.units.length === 0 || (this.props.calendarPane.calendarSidebarOpen.status === 'free' && calendar.unit.units.length === 0) || (calendar.unit.units.length === 0 && this.props.calendarPane.calendarSidebarOpen.status === undefined)) ? 0 : null;
            let discount = this.props.calendarPane.calendarSidebarOpen.unit.discount;
            if(discount){
                if(discount.discountSign){
                    this.setState({
                        addDiscount: discount.discountSign,
                        action: discount.discountType === 'abs' ? 'simple' : '%',
                        discount: discount.discountType === 'abs' ? discount.discountValue : Math.abs(price - calendar.unit.totalPrice),
                        discountSize: discount.discountValue,
                    })
                }
                else{
                    this.setState({
                        addDiscount: '',
                        action: '',
                        discount: '',
                        discountSize: '',
                    })
                }
            }else{
                this.setState({
                    addDiscount: '',
                    action: '',
                    discount: '',
                    discountSize: '',
                })
            }
            this.setState({
                disabledStatus,
                paymentDisabled: this.props.calendarPane.calendarSidebarOpen.unit.paymentDetails === null,
                activeIndex,
                units,
                unitPrice: '',
                guestFilled: filled,
                paymentFilled: filled,
                price,
                total: calendar.unit.totalPrice,
                firstName: calendar.unit.firstName,
                lastName: calendar.unit.secondName,
                phone: calendar.unit.phone}, () => this.calculateDiscount())

        }
    }

    componentWillReceiveProps(nextProps) {
        if(  nextProps.reservation.units.length !== this.props.reservation.units.length && nextProps.reservation.units.length > 0) {
            let units = nextProps.reservation.units;
            let disabledStatus;
            if(this.props.calendarPane.calendarSidebarOpen.status){
                disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
            }else{
                disabledStatus = false;
            }
            let activeIndex = (units.length === 0 || (this.props.calendarPane.calendarSidebarOpen.status === 'free' && units.length === 0) || (units.length === 0 && this.props.calendarPane.calendarSidebarOpen.status === undefined)) ? 0 : null;

            this.setState({ units , unitPrice: '', disabledStatus, activeIndex });
        }

        if(  nextProps.reservation.units.length !== this.props.reservation.units.length) {
            let units = nextProps.reservation.units;
            let price = calculateTotalPrice(units);
            this.calculateDiscount(price, this.state.discountSize);
            this.setState({ units , unitPrice: '', price, total: price });
        }

        if(  nextProps.reservation.units.length !== this.props.reservation.units.length && Object.keys(nextProps.calendarPane.calendarSidebarOpen).length > 0 && nextProps.calendarPane.calendarSidebarOpen.status !== 'free') {
            let units = this.props.calendarPane.calendarSidebarOpen.unit.units.concat(nextProps.reservation.units);
            let price = calculateTotalPrice(units);
            this.calculateDiscount(price, this.state.discountSize);
            this.setState({ units , unitPrice: '', price, total: price },  () => this.calculateDiscount());
        }

        if( nextProps.reservation.priceData !== this.props.reservation.priceData) {
            this.setState({ unitPrice: nextProps.reservation.priceData.price});
        }

        if(  nextProps.calendar !== this.props.calendar && Object.keys(nextProps.calendarPane.calendarSidebarOpen).length > 0) {
            this.props.clearUnis();
        let filled = nextProps.calendar.status === 'free'  ? false : true;
        let disabledStatus;
        let units = nextProps.calendar.unit.units ? nextProps.calendar.unit.units : [];
            let price = calculateTotalPrice(units);
        if(this.props.calendarPane.calendarSidebarOpen.status){
            disabledStatus = this.props.calendarPane.calendarSidebarOpen.status !== 'free' && this.props.calendarPane.calendarSidebarOpen.status !== 'reserved'
        }else{
            disabledStatus = false;
        }
        let discount = nextProps.calendarPane.calendarSidebarOpen.unit.discount;
        if(discount){
            if(discount.discountSign){
                this.setState({
                    addDiscount: discount.discountSign,
                    action: discount.discountType === 'abs' ? 'simple' : '%',
                    discount: discount.discountType === 'abs' ? discount.discountValue : Math.abs(price - nextProps.calendar.unit.totalPrice),
                    discountSize: discount.discountValue,
                })
            }
            else{
                this.setState({
                    addDiscount: '',
                    action: '',
                    discount: '',
                    discountSize: '',
                })
            }
        }else{
            this.setState({
                addDiscount: '',
                action: '',
                discount: '',
                discountSize: '',
            })
        }

        let activeIndex = (units.length === 0 || (this.props.calendarPane.calendarSidebarOpen.status === 'free' && units.length === 0) || (units.length === 0 && this.props.calendarPane.calendarSidebarOpen.status === undefined)) ? 0 : null;
        this.setState({
            disabledStatus,
            paymentDisabled:  nextProps.calendarPane.calendarSidebarOpen.unit.paymentDetails === null,
            activeIndex,
            units,
            unitPrice: '',
            guestFilled: filled,
            paymentFilled: filled,
            price,
            total: nextProps.calendar.unit.totalPrice,
            firstName: !filled ? '' : nextProps.calendar.unit.firstName,
            lastName: !filled ? '' : nextProps.calendar.unit.lastName,
            phone: !filled ? '' : nextProps.calendar.unit.phone,
            formErrors: { requiredFields: [], fromToBusy: '' }})
        }
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = this.state.activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

    handleUserInput = (e, { name , value}) => {
        this.setState({[name]:  value},this.calculateDiscount);
    }

    calculateDiscount(){
        if(this.state.addDiscount && this.state.action && this.state.discountSize){
            let discount = this.state.discountSize;
            let price = this.state.price;
            let total = 0;
            let validDiscount = true;

            if((this.state.addDiscount === "-" && this.state.action === 'simple') || (this.state.addDiscount === "-" && this.state.action === '%' && this.state.discountSize >= 100)){
                validDiscount = false;
            }

            if(this.state.action === '%'){
                discount = Math.ceil(price*discount/100);
            }
            if(this.state.addDiscount === '+'){
                total = 1*price + 1*discount;
            }else{
                total = 1*price - 1*discount;
            }

            this.setState({ discount, total, validDiscount })
        }
    }

    validateReservation() {
        let fieldValidationErrors = this.state.formErrors;
        let formValid = true;
        if(this.state.units.length === 0) {
            fieldValidationErrors.requiredFields.push('Add unit');
            formValid = false;
        }
        if(!this.props.reservation.guestDetails.firstName) {
            fieldValidationErrors.requiredFields.push('Guest Details');
            formValid = false;
        }
        if(!this.props.reservation.paymentDetails.cardholderName) {
            fieldValidationErrors.requiredFields.push('Payment Details');
            formValid = false;
        }

        if(!this.state.validDiscount) {
            fieldValidationErrors.Discount = ' value should not exceed purchase value';
            formValid = false;
        }else {
            fieldValidationErrors.Discount = '';
        }

        this.setState({formErrors: fieldValidationErrors});
        return formValid;
    }

    reserve = (e, titleProps) => {
        let errors = this.state.formErrors;
        errors.requiredFields = [] ;
        this.setState({ formErrors: errors });

        if(this.props.calendarPane.calendarSidebarOpen.reservationId){
            let discount = {};
            if(this.state.addDiscount && this.state.action && this.state.discountSize &&  this.state.validDiscount){
                discount = {
                    "discountSign": this.state.addDiscount,
                    "discountValue": this.state.discountSize,
                    "discountType": this.state.action === 'simple' ? 'abs' : 'rel'
                }
            }else {
                discount = {
                    "discountSign": '',
                    "discountValue": '',
                    "discountType": ''
                }
            }
            let date = moment(this.props.calendarData.date);
            let start = startMonth(date, -2);
            let end = endMonth(date, 28);
            let paymentDetails = Object.keys(this.props.reservation.paymentDetails).length > 0  ? this.props.reservation.paymentDetails : this.props.calendarPane.calendarSidebarOpen.unit.paymentDetails;
            let guestDetails = Object.keys(this.props.reservation.guestDetails).length > 0 ? this.props.reservation.guestDetails : this.props.calendarPane.calendarSidebarOpen.unit.guestDetails;
            this.props.updateReservation(this.state.units, guestDetails, paymentDetails, start, end, this.props.calendarPane.calendarSidebarOpen.reservationId, discount);

            return;
        }

          if(this.validateReservation()){
              let discount = {};
              if(this.state.addDiscount && this.state.action && this.state.discountSize &&  this.state.validDiscount){
                   discount = {
                      "discountSign": this.state.addDiscount,
                      "discountValue": this.state.discountSize,
                      "discountType": this.state.action === 'simple' ? 'abs' : 'rel'
                  }
              }else {
                   discount = {
                      "discountSign": '',
                      "discountValue": '',
                      "discountType": ''
                  }
              }
            let date = moment(this.props.calendarData.date);
            let start = startMonth(date, -2);
            let end = endMonth(date, 28);
              this.props.addReservation(this.state.units, this.props.reservation.guestDetails, this.props.reservation.paymentDetails, start, end, discount);
              this.props.resetAllDate();
              this.baseState.formErrors = { requiredFields: [], fromToBusy: '',  Discount: ''}
              this.setState(this.baseState, () => this.calculateDiscount());
          }
    }

    cancelReservation = (e, titleProps) => {


        if(this.props.calendarPane.calendarSidebarOpen.reservationId){
            let date = moment(this.props.calendarData.date);
            let start = startMonth(date, -2);
            let end = endMonth(date, 28);
            this.props.cancelReservation(this.props.calendarPane.calendarSidebarOpen.reservationId, start, end);
            this.props.resetCalendarSidebarOpen();
            this.props.resetAllDate();
            this.baseState.formErrors = { requiredFields: [], fromToBusy: '',  Discount: ''}
            this.setState(this.baseState, () => this.calculateDiscount());
            return;
        }


        this.props.resetCalendarSidebarOpen();
        this.props.resetAllDate();
        this.baseState.formErrors = { requiredFields: [], fromToBusy: '',  Discount: ''}
        this.setState(this.baseState, () => this.calculateDiscount());
    }

    renderAddUnitList(){
       if(this.props.calendarPane.calendarSidebarOpen.status){
           return this.state.units.map((value, key) => {
               let unitName, unitType ;

               if(value.UnitName){
                   unitName = value.UnitName;
                   unitType = value.UnitType;
               }else {
                   this.props.calendarData.units.forEach(function (unit) {
                       if(unit.id === value.id*1){
                           unitName = unit.name;
                           unitType = unit.type;
                       }
                   })
               }

               return (
                   <div key={key}>
                       <Accordion.Title active={this.state.activeIndex === key+1} index={key+1} onClick={this.handleClick}>
                           <div className="accordion-item">
                               <p>{unitName}</p>
                               <p><span>{value.checkIn} - {value.checkOut}</span> | <span>{moment(value.checkOut).diff(moment(value.checkIn), 'days')} nights</span></p>
                               <p>
                                   <span>{unitType} | {value.countAdults ? `${value.countAdults} Adults, `: ''}{value.countChildren ? `${value.countChildren} Children, `: ''}{value.countBabies ? `${value.countBabies} Babies | `: ''}</span>
                                   <span>Room only</span>
                               </p>
                               <span className="added-unit-total">₪{value.price}</span>
                               <Icon name='angle down' />
                           </div>
                       </Accordion.Title>
                       <Accordion.Content  active={this.state.activeIndex === key+1}>
                           <AddUnit accordUnitIndex={key} accordUnit={value}/>
                       </Accordion.Content>
                   </div>


               )
           })
       }else {
           return this.state.units.map((value, key) => {
               return (
                   <div key={key}>
                       <Accordion.Title active={this.state.activeIndex === key+1} index={key+1} onClick={this.handleClick}>
                           <div className="accordion-item">
                               <p>{value.UnitName}</p>
                               <p><span>{value.checkIn} - {value.checkOut}</span> | <span>{value.diff} nights</span></p>
                               <p>
                                   <span>{value.UnitType} | {value.adults ? `${value.adults} Adults, `: ''}{value.children ? `${value.children} Children, `: ''}{value.babies ? `${value.babies} Babies | `: ''}</span>
                                   <span>Room only</span>
                               </p>
                               <span className="added-unit-total">₪{value.price}</span>
                               <Icon name='angle down' />
                           </div>
                       </Accordion.Title>
                       <Accordion.Content  active={this.state.activeIndex === key+1}>
                           <AddUnit accordUnitIndex={key} accordUnit={value}/>
                       </Accordion.Content>
                   </div>


               )
           })
       }

    }

    renderHeader(value){
        switch(value.status) {
            case 'reserved':
                return (
                    <div className={"sidebar-header " + (value.unit.guestDetails.source === "direct" ? "reserved-header-offline" : "reserved-header-online" )}>Confirmed Reservation ({value.unit.guestDetails.source === "direct" ? "offline" : "online"})</div>
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

    renderAddUnit(){
        const usedFields = this.props.calendarPane.calendarSidebarOpen.status === 'free' || this.props.calendarPane.calendarSidebarOpen.status === 'reserved' || this.props.calendarPane.calendarSidebarOpen.status === undefined
        if(!this.props.calendar.inHouse){
          return (
            <div>
              <Accordion.Title className="add-new-unit"  active={this.state.activeIndex === 0 && usedFields} index={0} onClick={this.handleClick}>
                <div className="accordion-item">
                  <p className="add-unit-plus">+  add room</p>
                   <span className="add-unit-plus-price">{(this.state.unitPrice) ? `₪${this.state.unitPrice}` : ''}</span>
                  <Icon name='angle down' />
                </div>
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === 0 && usedFields} >
                <AddUnit />
              </Accordion.Content>
            </div>
          )
        }
    }

    render() {
      const buttons = this.props.calendarPane.calendarSidebarOpen.status !== 'CheckedOut' ? (
        <div>
          <hr/>
          <div>
            <FormErrors formErrors={this.state.formErrors} />
          </div>
          <Form.Field  width="16" className={"reserve-btn " + (this.state.guestFilled && this.state.paymentFilled && this.state.units.length > 0 ? 'btn-dark' : '')} control={Button} onClick={this.reserve.bind(this)}>
              {this.props.calendarPane.calendarSidebarOpen.reservationId ? 'Update' : 'Reserve'}
          </Form.Field>
          <Form.Field width="16" onClick={this.cancelReservation.bind(this)} className="cancel-reserve">Cancel</Form.Field>
        </div>

      ) : '';
        return (
        <div>
          {this.renderHeader(this.props.calendarPane.calendarSidebarOpen)}
            <div className="sub-title">
                <p>{this.state.firstName} {this.state.lastName} {this.state.phone}</p>
            </div>
            <Accordion className="accordion-list"  vertical="true" fluid>
                <div className="accordion-wrapper">
                    {this.renderAddUnitList()}
                    {this.renderAddUnit()}
                </div>

              <Form>
                <Form.Field className="guest-payment" >
                  <div className="accordion-wrapper" onClick={() => this.props.switchPane(4)}>
                    <span>Guest details</span>
                    {this.state.guestFilled && <Icon name='checkmark'/>}
                  </div>
                </Form.Field>
                <Form.Field className="guest-payment" disabled={this.state.paymentDisabled}>
                  <div className="accordion-wrapper" onClick={() => this.props.switchPane(5)}>
                    <span>Payment details</span>
                    {this.state.paymentFilled && <Icon name='checkmark'/>}
                  </div>
                </Form.Field>
              </Form>


                <div className="accordion-wrapper">
                    <Form size="mini" className="discount-reservation" onSubmit={()=> this.reserve}>
                        { this.state.price ? <Prices prices={this.state.price} /> : null }
                        <Form.Field width="16" className="discount-reservation-wrapp" disabled={this.props.calendarPane.calendarSidebarOpen.status === 'CheckedOut'}>
                            <span> Add/Discount:</span>
                            <div className="discount-rate">
                                <Dropdown value={this.state.addDiscount} name="addDiscount" onChange={this.handleUserInput} className='icon' closeOnBlur={true}  selection options={addDiscountOption} />
                                <Input type="number" value={this.state.discountSize} name="discountSize" onChange={this.handleUserInput}/>
                                <Dropdown value={this.state.action} name="action" onChange={this.handleUserInput} className='icon' closeOnBlur={true}  selection options={optionsType} />
                            </div>
                            <span className="disc-amount"> {this.state.addDiscount ? `${this.state.addDiscount}₪${this.state.discount}` : ''}</span>
                        </Form.Field>
                        <Form.Field width="16" className="total" disabled={this.props.calendarPane.calendarSidebarOpen.status === 'CheckedOut'}><span>Total:</span> <span className={"disc-amount " + (this.state.validDiscount ? '' : 'discount-error')}> {this.state.total ? `₪${this.state.total}` : ''}</span> </Form.Field>
                      {buttons}
                    </Form>
                </div>


            </Accordion>
        </div>

        );
    }
}

