import GuestDetails from '../components/sidebar/main/GuestDetails';
import { connect } from "react-redux";
import { switchPane } from '../actions/active_pane_action';
import { guestDetails } from '../actions/reservation_actions';

function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        reservation: state.reservation
    };
}

export default connect(mapStateToProps, { switchPane, guestDetails })(GuestDetails);