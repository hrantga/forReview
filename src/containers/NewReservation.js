import NewReservation from '../components/sidebar/main/NewReservation';
import { connect } from "react-redux";
import { switchPane, resetCalendarSidebarOpen } from '../actions/active_pane_action';
import { addReservation, updateReservation, cancelReservation } from '../actions/calendar_actions';
import { clearUnis, resetAllDate } from "../actions/reservation_actions";


function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        calendarPane: state.calendarPane,
        reservation: state.reservation,
        rates: state.rates
    };
}

export default connect(mapStateToProps, { switchPane, addReservation, updateReservation, clearUnis, resetAllDate, cancelReservation, resetCalendarSidebarOpen })(NewReservation);