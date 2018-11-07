import AddSpecialRate from '../components/sidebar/rates/AddSpecialRate';
import { connect } from "react-redux";
import { createSpecialRates, deleteSpecialRates, updateSpecialRates, selectedActiveDays } from '../actions/rates_action'
import { selectPicker } from '../actions/calendar_actions'


function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        rates: state.rates
    };
}
export default connect(mapStateToProps, { createSpecialRates, deleteSpecialRates, updateSpecialRates, selectedActiveDays, selectPicker })(AddSpecialRate);