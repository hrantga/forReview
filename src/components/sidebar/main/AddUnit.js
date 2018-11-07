import React, { Component } from 'react';
import { Form, Input, Icon, Select } from 'semantic-ui-react';
import Picker from '../SidebarCalendarRange';
import { FormErrors } from './FormErrors';
import _ from 'lodash';
import moment from 'moment';
import { calculateTotalPrice } from '../../../utils/ratesCalculator';
import { checkMinimumStay } from '../../../utils/data';

const SHOW_TIME = true;

export default class AddUnit extends Component {
    constructor(props){
        super(props);

        this.state = {
            availability: false,
            adultsOption: [],
            babiesOption: [],
            childrenOption: [],
            message: '',
            price: '',
            units: [],
            unitIndex: 0,
            fromDate: null,
            toDate: null,
            diff: '',
            defValue: null,
            id: null,
            adults: 0,
            children: 0,
            babies: 0,
            guestExceeded: true,
            minimumStay: 1,
            formErrors: { requiredFields: [] , fromDate: '', toDate: '', adults: '', availability: '', Max: ''},
            formValid: false,
            toDateValid: false,
            adultsValid: false,
            fromDateValid: false
        }

        this.baseState = this.state;
    }

        componentWillMount(){
        this.selectOptionUnits(this.props.calendarData.units, this.props.id);
        if(this.props.accordUnit){
            let defValue;
            let unit = this.props.accordUnit;
            this.props.calendarData.units.forEach((value,index) => {
                if(value.id === unit.id*1){
                    defValue = index;
                }
            })
            let adultsOption = [];
            let babiesOption = [];
            let childrenOption = [];

            if(this.props.calendarData.units.length > 0 && defValue !== null ){
                adultsOption = this.renderOptions(this.props.calendarData.units[defValue].adult_number, 1);
                babiesOption = this.renderOptions(this.props.calendarData.units[defValue].babies_number, 0);
                childrenOption = this.renderOptions(this.props.calendarData.units[defValue].children_number, 0);
            }

            this.setState({
                id: unit.id,
                unitIndex: this.props.accordUnitIndex,
                fromDate: moment(unit.checkIn),
                toDate: moment(unit.checkOut),
                diff: moment(unit.checkOut).diff(moment(unit.checkIn), 'days'),
                defValue,
                formValid: false,
                adultsOption,
                babiesOption,
                childrenOption,
            }, () => this.setAdults(unit.countAdults, unit.countChildren, unit.countBabies))
        }

    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.calendarPane.activeIndex !== this.props.calendarPane.activeIndex ) {
            this.setState(this.baseState);
        }
        if( nextProps.calendarData.units !== this.props.calendarData.units) {
            this.selectOptionUnits(nextProps.calendarData.units, this.props.id)
        }

        if( nextProps.reservation.priceData !== this.props.reservation.priceData) {
            this.setState({ availability: nextProps.reservation.priceData.availability, message:  nextProps.reservation.priceData.message, price: nextProps.reservation.priceData.price },() => {
                this.validateField('availability', nextProps.reservation.priceData.availability);
            });

        }

        if( nextProps.reservation.units !== this.props.reservation.units && nextProps.reservation.units.length > 0) {
            let newUnits = [...this.state.units];
            this.state.units.forEach(function (unit) {
                nextProps.reservation.units.forEach(function (val) {
                    if(val.id === unit.key){
                        let key = newUnits.findIndex(function (u) {
                            return u.key === val.id
                        });
                        newUnits.splice(key, 1);
                    }
                })
            })

            if(newUnits.length > 0){
                newUnits.forEach(function (unit,key) {unit.value = key})
                this.setState({units: newUnits,defValue : null})
            }else {
                this.setState({units: newUnits,defValue : null})
            }

        }

        if( nextProps.calendarPane.calendarSidebarOpen !== this.props.calendarPane.calendarSidebarOpen && !this.state.id && Object.keys(nextProps.calendarPane.calendarSidebarOpen).length > 0) {
            this.setState({ formValid: false});
            this.selectOptionUnits(this.props.calendarData.units, nextProps.calendarPane.calendarSidebarOpen.id, nextProps.calendarPane.calendarSidebarOpen.unit.date)
        }
        if(this.props.accordUnit !== nextProps.accordUnit){
            let unit = nextProps.accordUnit;
            let  defValue = null;
            this.props.calendarData.units.forEach((value,index) => {
                if(value.id === unit.id*1){
                    defValue = index;
                }
            })
            this.setState({
                id: unit.id,
                unitIndex: this.props.accordUnitIndex,
                fromDate: moment(unit.checkIn),
                toDate: moment(unit.checkOut),
                diff: moment(unit.checkOut).diff(moment(unit.checkIn), 'days'),
                defValue,
                formValid: false
            }, () => this.setAdults(unit.countAdults, unit.countChildren, unit.countBabies))
        }

        if(  nextProps.minimumStay !== this.props.minimumStay && Object.keys(nextProps.minimumStay.minimumStay).length > 0) {

            if(nextProps.minimumStay.minimumStay.periodic.error === 'OK'){
                this.getPrice()
                return;
            }

            let minimumStay = checkMinimumStay(nextProps.minimumStay);
            let date = moment(nextProps.minimumStay.minimumStay.date);
            let diff = minimumStay;
            if(minimumStay) {
                this.setState({ minimumStay, toDate: date.clone().add(minimumStay, 'day'), diff }, () => {this.validateForm ; this.getPrice()})
            }else {
                this.getPrice();
            }
        }
    }

    selectOptionUnits = (unitsList, unitId, date) => {
        let  defValue = null;
        let unitsNew;
        let same;
        unitId = this.props.accordUnit ? this.props.accordUnit.id : unitId;
        let units = unitsList.map((value,index) => {
            if(value.id === unitId){
                defValue = index;
            }
            return {key: value.id, value: index, text: `(${value.type ? value.type : ''}) ${value.name}`, icon: 'checkmark', selected: value.id === unitId}
        })

        unitsNew = units;

        if(this.props.reservation.units.length > 0){
            if(this.props.accordUnit){
                let reservation = [...this.props.reservation.units];
                let reservationFilter = reservation.filter((e) => e.id !== this.props.accordUnit.id  )

                unitsNew = units.filter((value) => {
                    same = reservationFilter.find((e) => e.id === value.key  )
                    if(!same ) return value;
                })
            }else{
                unitsNew = units.filter((value) => {
                    same = this.props.reservation.units.find((e) => e.id === value.key  )
                    if(!same ) return value;
                })
            }

            if(unitsNew.length > 0){
                unitsNew.forEach(function (unit,key) {unit.value = key})

            }
            unitsNew.forEach((value,index) => {
                if(value.key === unitId){
                    defValue = index;
                }
            })
        }

      let start = (date) ? moment(date) : null;
      let end = (date) ? moment(date).clone().add(1, 'day') : null;

      let adultsOption = [];
      let babiesOption = [];
      let childrenOption = [];

      if(this.props.calendarData.units.length > 0 && defValue !== null ){
          adultsOption = this.renderOptions(this.props.calendarData.units[defValue].adult_number, 1);
          babiesOption = this.renderOptions(this.props.calendarData.units[defValue].babies_number, 0);
          childrenOption = this.renderOptions(this.props.calendarData.units[defValue].children_number, 0);
      }

      let adults = this.props.accordUnit ? this.props.accordUnit.countAdults  : '2';
      let children  = this.props.accordUnit ? this.props.accordUnit.countChildren : '0';
      let babies = this.props.accordUnit ? this.props.accordUnit.countBabies  : '0';

        this.setState({
            units: unitsNew,
            fromDate: start,
            toDate: end,
            diff: (start) ? end.diff(start, 'days') : '',
            defValue: defValue,
            adultsOption,
            babiesOption,
            childrenOption
        }, () => this.setAdults(adults, children, babies))
    }

    renderOptions(count, start){
            let options = [];
            for(let i = start; i <= count; i++){
                options.push({ key: `${i}`, text: `${i}`, value: `${i}` })
            }
            return options;
    }

    setAdults(adults, children, babies){
            this.setState({adults, children, babies})
    }

    handleUserInput = (e, { name , value}) => {
        this.setState({[name]:  value},() => { this.validateField(name, value); this.getPrice();});
        if(name === 'defValue'){
            let adultsOption = [];
            let babiesOption = [];
            let childrenOption = [];

            if(this.props.calendarData.units.length > 0 && value !== null ){
                adultsOption = this.renderOptions(this.props.calendarData.units[value].adult_number, 1);
                babiesOption = this.renderOptions(this.props.calendarData.units[value].babies_number, 0);
                childrenOption = this.renderOptions(this.props.calendarData.units[value].children_number, 0);
            }
            this.setState({adultsOption, babiesOption, childrenOption});
        }

    }

    getPrice() {
        if(this.state.defValue !== null){
            var guestExceeded = this.state.adults*1 + this.state.babies*1 + this.state.children*1 <= this.props.calendarData.units[this.state.defValue].max_guests_number;
            let fieldValidationErrors = this.state.formErrors;

            fieldValidationErrors.Max = guestExceeded ? '' : ' room capacity exceeded';
            this.setState({guestExceeded}, this.validateForm())
        }

        if(this.state.fromDate &&  this.state.toDate && (this.state.defValue !== null) && !this.props.accordUnit && guestExceeded){
            let data = {
                from: moment(this.state.fromDate).format('YYYY-MM-DD'),
                to: moment(this.state.toDate).format('YYYY-MM-DD'),
                adults: this.state.adults,
                children: this.state.children,
                babies: this.state.babies,
            }
            this.props.calculatePrice(this.props.calendarData.units[this.state.defValue].id, data);
        }
    }

    onChange = (field, value) => {
        if(value){
            this.setState({[field]: value},() => { this.validateField(field, value); this.getPrice(); });
            this.props.selectPicker(value);
        }
        let diff;

        if(this.state.fromDate && field === "toDate"){
            if(value) {
                 diff = value.diff(this.state.fromDate, 'days');
            }else {
                diff = this.state.minimumStay;
            }

            this.setState({ diff })
        }

        if(this.state.toDate && field === "fromDate"){
            if(value) {
                diff = this.state.toDate.diff(value, 'days');
            }else {
                diff = this.state.minimumStay;
            }
            this.props.selectToday(value);
            this.setState({ diff })
        }
    }

    disabledEndDate = (toDate) => {
        if (!toDate) {
            return false;
        }
        const fromDate = this.state.fromDate ? this.state.fromDate.clone().add(this.state.minimumStay, 'day') : this.state.fromDate;
        if (!fromDate) {
            return false;
        }
        return SHOW_TIME ? toDate.isBefore(fromDate) : toDate.diff(fromDate, 'days') < 0;
    }

    disabledStartDate = (fromDate) => {
        if (!fromDate) {
            return false;
        }
        const toDate = this.state.toDate ? this.state.toDate.clone().add(-this.state.minimumStay, 'day') : this.state.toDate;
        if (!toDate) {
            return false;
        }
        return SHOW_TIME ? toDate.isBefore(fromDate) : toDate.diff(fromDate, 'days') < 0;
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let fromDateValid = this.state.fromDateValid;
        let toDateValid = this.state.toDateValid;

        switch(fieldName) {
            case 'checkIn':
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
            case 'checkOut':
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
            case 'UnitName':
                if(value === null){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'adults':
                if(value === null){
                    fieldValidationErrors.requiredFields.push('Adults is');
                }
                break;
            case 'availability':
                if(!value){
                    fieldValidationErrors.availability = this.state.message;
                }else {
                    fieldValidationErrors.availability = '';
                }
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors, fromDateValid: fromDateValid, toDateValid: toDateValid}, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.fromDate &&  this.state.toDate && (this.state.defValue !== null) && this.state.availability && !this.state.id && this.state.guestExceeded});
    }

  removeUnit = (e, titleProps) => {
            if(this.props.calendarPane.calendarSidebarOpen.reservationId){
                this.props.removeReservedUnit(this.state.unitIndex, this.props.calendarPane.calendarSidebarOpen, this.props.reservation.units);
            }
      this.props.removeUnit(this.state.unitIndex);
      this.setState({unitIndex: 0})
  }

    addUnit = (e, titleProps) => {
        let unit = {
            checkIn: this.state.fromDate,
            checkOut: this.state.toDate,
            UnitName: this.state.defValue,
            availability: this.state.availability
        }
        if(this.state.formValid){
            unit['id'] = this.state.units[this.state.defValue].key;
            unit['diff'] = this.state.diff;
            unit['defValue'] = this.state.defValue;
            unit['countAdults'] = this.state.adults;
            unit['countChildren'] = this.state.children;
            unit['countBabies'] = this.state.babies;
            unit['price'] = this.state.price;
            let index = this.props.calendarData.units.findIndex(function (u) {
                return u.id === unit.id
            });
            unit['UnitName'] = this.props.calendarData.units[index].name;
            unit['UnitType'] = this.props.calendarData.units[index].type;


            if(this.state.id){
                this.props.updateUnit(unit, this.state.unitIndex);
            }else{

                this.props.addUnit(this.props.reservation.units, unit, this.state.unitIndex+1);
                let units = this.state.units;
                this.setState(this.baseState);
                this.setState({units: units});
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

    render() {
        return (
                <Form size="mini" onSubmit={()=> this.addUnit}>
                    <div>
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                    <Form.Group widths='equal'>
                        <Form.Field width="6" required>
                            <label>From</label>
                            <Picker
                                moveCalendar={this.state.fromDate}
                                disabled={(this.state.id) ? true : false}
                                disabledDate={this.disabledStartDate}
                                value={this.state.fromDate}
                                onChange={this.onChange.bind(this, 'fromDate')}
                            />
                        </Form.Field>
                        <Form.Field width="6" required>
                            <label>To</label>
                            <Picker
                                moveCalendar={this.state.toDate}
                                disabled={(this.state.id) ? true : false}
                                disabledDate={this.disabledEndDate}
                                value={this.state.toDate}
                                onChange={this.onChange.bind(this, 'toDate')}
                            />
                        </Form.Field>
                        <Form.Field width="1" className="nights" control={Input} value={this.state.diff} disabled label='Nights'/>
                    </Form.Group>
                    <Form.Field width="16" control={Select} name="defValue" className='icon' label="Unit name" disabled={(this.state.id) ? true : false} value={this.state.defValue !== null ? this.state.defValue : ''} onChange={this.handleUserInput}  placeholder='Select Unit'   options={this.state.units} required />
                    <Form.Group widths='equal'>
                        <Form.Field control={Select} disabled={(this.state.id) ? true : false} className="select-options required-fields" name="adults" label="Adults" value={this.state.adults} onChange={this.handleUserInput} options={this.state.adultsOption}/>
                        <Form.Field control={Select} disabled={(this.state.id) ? true : false} className="select-options" name="children" label="Children(ages 2-12)" value={this.state.children} onChange={this.handleUserInput} options={this.state.childrenOption}/>
                        <Form.Field control={Select} disabled={(this.state.id) ? true : false} className="select-options" name="babies" label="Babies(under 2)" value={this.state.babies} onChange={this.handleUserInput}   options={this.state.babiesOption}/>
                    </Form.Group>
                    <Form.Group widths='equal' className="submit-group">
                        <Form.Field width="4" ></Form.Field>
                        <Form.Field width="4" className="close-btn" ><Form.Button onClick={this.addUnit.bind(this)} className={(this.state.formValid) ? '' : 'not-valid'} disabled={(!this.state.formValid) ? true : false}>Add</Form.Button></Form.Field>
                        <Form.Field width="4" onClick={this.removeUnit}><div className="delete cl-op-delete"><Icon name='trash outline' /><span>Remove</span></div></Form.Field>
                    </Form.Group>
                </Form>
        );
    }
}

