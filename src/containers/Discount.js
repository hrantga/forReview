import Discount from '../components/sidebar/rates/Discount';
import { connect } from "react-redux";
import { updateDiscount } from '../actions/rates_action'

function mapStateToProps(state) {
    return {
        rates: state.rates,
        calendarPane: state.calendarPane
    };
}

export default connect(mapStateToProps, { updateDiscount })(Discount);