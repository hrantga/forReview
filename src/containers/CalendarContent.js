import CalendarContent from '../components/calendar/CalendarContent';
import { connect } from "react-redux";
import { getAllRates } from "../actions/rates_action";
import { openSidebarCalendar, openClosedSidebar } from "../actions/active_pane_action";
import { getUnitMinimumStay } from "../actions/minimum_stay_action";
import { resetAllDate } from "../actions/reservation_actions";
import { getAllClosed } from "../actions/close_open_action";
import { selectToday } from "../actions/calendar_actions";

function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        calendarPane: state.calendarPane,
        closedUnits: state.closedUnits,
        rates: state.rates
    };
}

export default connect(mapStateToProps, { getAllRates, openSidebarCalendar, openClosedSidebar, getUnitMinimumStay, resetAllDate, getAllClosed, selectToday })(CalendarContent);