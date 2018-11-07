import Calendar from '../components/calendar';
import { connect } from "react-redux";
import { getUnits, getReservations, getHotel } from "../actions/calendar_actions";

function mapStateToProps(state) {
  return {
    calendarData: state.calendarData,
    calendarPane: state.calendarPane,
  };
}

export default connect(mapStateToProps, {getUnits, getReservations, getHotel})(Calendar);