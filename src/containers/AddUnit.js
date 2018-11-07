import AddUnit from '../components/sidebar/main/AddUnit';
import { connect } from "react-redux";
import { addUnit, updateUnit, removeUnit, calculatePrice, removeReservedUnit } from "../actions/reservation_actions";
import { getUnitRates } from '../actions/rates_action';
import { selectToday, selectPicker } from '../actions/calendar_actions';



function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        calendarPane: state.calendarPane,
        rates: state.rates,
        minimumStay: state.minimumStay,
        reservation: state.reservation
    };
}
export default connect(mapStateToProps, { addUnit, updateUnit, getUnitRates, removeUnit, calculatePrice, selectToday, selectPicker, removeReservedUnit })(AddUnit);