import CalendarControls from '../components/calendar/CalendarControls';
import { connect } from "react-redux";
import { selectYear, selectMonth, selectToday, selectWeek, getReservations, selectPicker } from "../actions/calendar_actions";
import { switchPane } from "../actions/active_pane_action";


function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        calendarPane: state.calendarPane,
        rates: state.rates
    };
}

export default connect(mapStateToProps, {selectYear, selectMonth, selectToday, selectWeek, getReservations, switchPane, selectPicker})(CalendarControls);