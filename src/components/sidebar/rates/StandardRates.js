import React, { Component } from 'react';
import { Form, Input, Icon } from 'semantic-ui-react';
import { FormErrors } from '../main/FormErrors';
import { getWeekDays } from '../../../utils/date'
import _ from 'lodash';

export default class StandardRates extends Component {
    constructor(props){
        super(props);

        this.state = {
            standardMid: '',
            singleMid: '',
            adultsMid: '',
            childrenMid: '',
            babiesMid: '',
            standardEnd: '',
            singleEnd: '',
            adultsEnd: '',
            childrenEnd: '',
            babiesEnd: '',
            midDays: '',
            endDays: '',
            formErrors: { requiredFields: []},
            unitId: undefined
        }

        this.baseState = this.state;
    }

    componentWillMount(){
        if( Object.keys(this.props.calendarData.hotel).length > 0) {
            let weekDays = getWeekDays(this.props.calendarData.hotel);
            this.setState({
                midDays: weekDays.midDays,
                endDays: weekDays.endDays,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit || (this.state.unitId !== nextProps.rates.selectedUnit && nextProps.rates.selectedUnit)) {
            let unitId =  nextProps.rates.selectedUnit ?  nextProps.rates.selectedUnit : this.state.unitId ;
            let unit = nextProps.rates.allRates[unitId];
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({
                unitId,
                standardMid: unit.midWeek ? unit.midWeek.rateValue : '',
                singleMid: unit.midWeek ? unit.midWeek.singleRateValue : '',
                adultsMid: unit.midWeek ? unit.midWeek.extraAdult : '',
                childrenMid: unit.midWeek ? unit.midWeek.extraChild : '',
                babiesMid: unit.midWeek ? unit.midWeek.extraBaby : '',
                standardEnd: unit.endWeek ? unit.endWeek.rateValue : '',
                singleEnd: unit.endWeek ? unit.endWeek.singleRateValue : '',
                adultsEnd: unit.endWeek ? unit.endWeek.extraAdult : '',
                childrenEnd: unit.endWeek ? unit.endWeek.extraChild : '',
                babiesEnd: unit.endWeek ? unit.endWeek.extraBaby : '',
                formErrors
            }, this.validateField('unitId', unitId));
        }

        if( nextProps.calendarPane.ratesSidebarOpen.id !== this.props.calendarPane.ratesSidebarOpen.id || (this.state.unitId !== nextProps.calendarPane.ratesSidebarOpen.id && Object.keys(nextProps.calendarPane.ratesSidebarOpen).length > 0)) {
            let unitId = nextProps.calendarPane.ratesSidebarOpen.id ?  nextProps.calendarPane.ratesSidebarOpen.id  : this.state.unitId;
            let unit = nextProps.calendarPane.ratesSidebarOpen.unit;
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({
                unitId,
              standardMid: unit.midWeek ? unit.midWeek.rateValue : '',
              singleMid: unit.midWeek ? unit.midWeek.singleRateValue : '',
              adultsMid: unit.midWeek ? unit.midWeek.extraAdult : '',
              childrenMid: unit.midWeek ? unit.midWeek.extraChild : '',
              babiesMid: unit.midWeek ? unit.midWeek.extraBaby : '',
              standardEnd: unit.endWeek ? unit.endWeek.rateValue : '',
              singleEnd: unit.endWeek ? unit.endWeek.singleRateValue : '',
              adultsEnd: unit.endWeek ? unit.endWeek.extraAdult : '',
              childrenEnd: unit.endWeek ? unit.endWeek.extraChild : '',
              babiesEnd: unit.endWeek ? unit.endWeek.extraBaby : '',
              formErrors
            }, this.validateField('unitId', unitId));
        }

        if( nextProps.calendarData.hotel !== this.props.calendarData.hotel) {
            let weekDays = getWeekDays(nextProps.calendarData.hotel);
            this.setState({
                midDays: weekDays.midDays,
                endDays: weekDays.endDays,
            });
        }
    }

    onSubmit = (e, value) => {
        if(this.state.formValid){
            let data = {
                "midWeek":{
                    "rateValue": this.state.standardMid,
                    "singleRateValue": this.state.singleMid,
                    "extraAdult": this.state.adultsMid,
                    "extraChild": this.state.childrenMid,
                    "extraBaby": this.state.babiesMid

                },
                "endWeek":{
                    "rateValue": this.state.standardEnd,
                    "singleRateValue": this.state.singleEnd,
                    "extraAdult": this.state.adultsEnd,
                    "extraChild": this.state.childrenEnd,
                    "extraBaby": this.state.babiesEnd
                }
            }
            
            this.props.updateStandardRates(this.state.unitId, data);
            this.setState({ formErrors: {} });
        }else {
            const formErrors = this.state.formErrors;
            formErrors.requiredFields = [];
            this.setState({ formErrors });
            let that = this;
            let unit = {
                'standardMid': this.state.standardMid,
                'standardEnd': this.state.standardEnd,
                'unitId': this.state.unitId
            }
            _.forOwn(unit, function(value, key) {
                that.validateField(key, value);
            } );
        }
    }

    resetForm = () => {
        this.setState(this.baseState)
    }

    handleUserInput = (e, { name , value}) => {
        this.setState({[name]:  value},() => { this.validateField(name, value) });

    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        if(fieldValidationErrors.requiredFields === undefined){
            fieldValidationErrors = {requiredFields: []}
        }

        switch(fieldName) {
            case 'standardMid':
                if(!value){
                    fieldValidationErrors.requiredFields.push(fieldName);
                }
                break;
            case 'standardEnd':
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
        this.setState({formErrors: fieldValidationErrors}, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.standardMid &&  this.state.standardEnd && this.state.unitId});
    }

    render() {
        return (
            <Form size="mini" onSubmit={this.onSubmit.bind(this)}>
                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Form.Group inline>
                    <label>Midweek standard rates<span>({this.state.midDays})</span></label>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field control={Input} className="required-fields" type="number" name="standardMid" onChange={this.handleUserInput} value={this.state.standardMid}  label='Standard rate(2 guests)' placeholder='ILS' />
                    <Form.Field control={Input} type="number" name="singleMid" onChange={this.handleUserInput} value={this.state.singleMid} label='Single rate' placeholder='ILS' />
                </Form.Group>
                <Form.Group inline>
                    <label><span>Extras:</span></label>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field width="4" type="number" name="adultsMid" onChange={this.handleUserInput} value={this.state.adultsMid}  control={Input} label='Adults' placeholder='ILS'/>
                    <Form.Field width="4" type="number" name="childrenMid" onChange={this.handleUserInput} value={this.state.childrenMid} control={Input} label='Children (ages 2-12)' placeholder='ILS' />
                    <Form.Field width="4" type="number" name="babiesMid" onChange={this.handleUserInput} value={this.state.babiesMid} control={Input} label='Babies (under 2)' placeholder='ILS' />
                </Form.Group>
                <hr/>
                <Form.Group inline>
                    <label>End week standard rates<span>({this.state.endDays})</span></label>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field control={Input} className="required-fields" type="number" name="standardEnd" onChange={this.handleUserInput} value={this.state.standardEnd} label='Standard rate(2 guests)' placeholder='ILS' />
                    <Form.Field control={Input} type="number" name="singleEnd" onChange={this.handleUserInput} value={this.state.singleEnd} label='Single rate' placeholder='ILS' />
                </Form.Group>
                <Form.Group inline>
                    <label><span>Extras:</span></label>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field width="4" type="number" name="adultsEnd" onChange={this.handleUserInput} value={this.state.adultsEnd} control={Input} label='Adults' placeholder='ILS'/>
                    <Form.Field  width="4" type="number" name="childrenEnd" onChange={this.handleUserInput} value={this.state.childrenEnd} control={Input} label='Children (ages 2-12)' placeholder='ILS' />
                    <Form.Field width="4" type="number" name="babiesEnd" onChange={this.handleUserInput} value={this.state.babiesEnd} control={Input} label='Babes (under 2)' placeholder='ILS' />
                </Form.Group>
                <hr/>
                <Form.Group inline>
                    <label className="displayed-date">Standard rates will be displayed in the calendar from 14/1/2018 to 18 months ahead.</label>
                </Form.Group>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="4" > <Form.Button className={(this.state.standardMid) ? 'edit-rate' : ''}>Set Rates</Form.Button></Form.Field>
                    <Form.Field width="4" onClick={this.resetForm} className="clear-btn">Clear</Form.Field>
                </Form.Group>
            </Form>
        );
    }
}
