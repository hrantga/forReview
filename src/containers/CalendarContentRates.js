import CalendarContentRates from '../components/calendar/CalendarContentRates';
import { connect } from "react-redux";
import { getAllRates } from "../actions/rates_action";
import { openSidebarRates } from "../actions/active_pane_action";


function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        rates: state.rates
    };
}

export default connect(mapStateToProps, {  openSidebarRates, getAllRates })(CalendarContentRates);