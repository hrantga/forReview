import CalendarContentCloseOpen from '../components/calendar/CalendarContentCloseOpen';
import { connect } from "react-redux";
import { getAllClosed } from "../actions/close_open_action";
import { openClosedSidebar } from "../actions/active_pane_action";



function mapStateToProps(state) {
  return {
    calendarData: state.calendarData,
      closedUnits: state.closedUnits
  };
}

export default connect(mapStateToProps, { getAllClosed, openClosedSidebar })(CalendarContentCloseOpen);