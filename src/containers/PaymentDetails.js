import PaymentDetails from '../components/sidebar/main/PaymentDetails';
import { connect } from "react-redux";
import { switchPane } from '../actions/active_pane_action';
import { paymentDetails } from '../actions/reservation_actions';

function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        reservation: state.reservation
    };
}

export default connect(mapStateToProps, { switchPane, paymentDetails })(PaymentDetails);