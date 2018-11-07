import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

export default class Prices extends Component {
    constructor(props){
        super(props);

        this.state = {
            prices: {}
        }
    }
    componentWillMount(){
        if(this.props.prices) {
            this.setState({ prices: this.props.prices})
        }
    }
    componentWillReceiveProps(nextProps) {
        if(  nextProps.prices !== this.props.prices) {
            this.setState({ prices: nextProps.prices})
        }
    }

    render() {
        const prices = this.state.prices
        return (
            <div>
                <hr/>
                <Form.Group className="sub-total">
                    <label className="discount-label">Sub total:</label>
                    <span> ₪{prices}</span>
                </Form.Group>
            </div>

        );
    }
}

