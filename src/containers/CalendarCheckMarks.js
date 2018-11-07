import CalendarCheckMarks from '../components/calendar/CalendarCheckMarks';
import { connect } from "react-redux";
import { openSidebarCalendar } from "../actions/active_pane_action";

function mapStateToProps(state) {
    return {
        calendarData: state.calendarData
    };
}

export default connect(mapStateToProps, { openSidebarCalendar })(CalendarCheckMarks);