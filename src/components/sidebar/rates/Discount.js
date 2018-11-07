import React, { Component } from 'react';
import { Button, Form, Icon, Select } from 'semantic-ui-react';

const options = [
    { key: '0', text: '0%', value: '0' },
    { key: '5', text: '5%', value: '5' },
    { key: '10', text: '10%', value: '10' },
    { key: '15', text: '15%', value: '15' },
    { key: '20', text: '20%', value: '20' },
]
export default class Discount extends Component {
    constructor(props){
        super(props);

        this.state = {
            unit: {},
            unitId: '',
            discount: null,
            formErrors: { requiredFields: []}
        }
    }

    resetForm = () => {
        this.setState({ discount: null})
    }

    componentWillReceiveProps(nextProps) {
        if(  nextProps.calendarPane.ratesSidebarOpen !== this.props.calendarPane.ratesSidebarOpen) {
            let data = nextProps.calendarPane.ratesSidebarOpen.unit;
            this.setState({unit: data, discount: data.discount, unitId: nextProps.calendarPane.ratesSidebarOpen.id});
        }

        if( nextProps.rates.selectedUnit  !== this.props.rates.selectedUnit ) {
            let unitId = nextProps.rates.selectedUnit;
            let data = nextProps.rates.allRates[unitId];
            this.setState({unit: data, discount: data.discount, unitId});
        }
    }

    handleUserInput = (e, { name , value}) => {
        this.setState({[name]:  value});

    }

    onSubmit = (e, value) => {
        if(this.state.unitId && this.state.discount){
            this.props.updateDiscount(this.state.unitId, this.state.discount);

        }

    }

        render() {
        const unit = this.state.unit;
        return (
            <Form size="mini" onSubmit={this.onSubmit.bind(this)} className="discount">
                <Form.Group className="discount-rate-wrapp">
                    <label className="discount-label">Discount:</label>
                    <Form.Field width="3" value={this.state.discount} name="discount" className="discount-rate" control={Select} options={options} onChange={this.handleUserInput} required/>
                </Form.Group>
                <hr/>
                    <Form.Field width="16" ><span>Standard rate:</span> <div className="disc-amount"><span>₪{unit.midWeek ? unit.midWeek.rateValue : 0}</span> (₪{unit.endWeek ? unit.endWeek.rateValue : 0})</div> </Form.Field>
                    <Form.Field width="16" ><span>Single rate:</span> <div className="disc-amount"><span>₪{unit.midWeek ? unit.midWeek.singleRateValue : 0}</span> (₪{unit.endWeek ? unit.endWeek.singleRateValue : 0})</div></Form.Field>
                    <label><span>Extras:</span></label>
                    <Form.Field width="16" ><span>Adults:</span> <div className="disc-amount"><span>₪{unit.midWeek ? unit.midWeek.extraAdult : 0}</span> (₪{unit.endWeek ? unit.endWeek.extraAdult : 0})</div></Form.Field>
                    <Form.Field width="16" ><span>Children:</span> <div className="disc-amount"><span>₪{unit.midWeek ? unit.midWeek.extraChild : 0}</span> (₪{unit.endWeek ? unit.endWeek.extraChild : 0})</div></Form.Field>
                    <Form.Field width="16" ><span>Babies:</span> <div className="disc-amount"><span>₪{unit.midWeek ? unit.midWeek.extraBaby : 0}</span> (₪{unit.endWeek ? unit.endWeek.extraBaby : 0})</div></Form.Field>

                <hr/>
                <Form.Group widths='equal' className="submit-group">
                    <Form.Field width="4" ><div className="duplicate"><Icon name='clone' /><span>Duplicate</span></div></Form.Field>
                    <Form.Field width="4" control={Button}  className={(this.state.discount) ? 'edit-rate' : ''} >Set Rates</Form.Field>
                    <Form.Field width="4" className="clear-btn" onClick={this.resetForm} >Clear</Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

