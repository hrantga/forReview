import Periodic from '../components/sidebar/minimumstay/Periodic';
import { connect } from "react-redux";
import { updatePeriodicMinimumStay, getPeriodicMinimumStay } from '../actions/minimum_stay_action';
import { selectPicker } from '../actions/calendar_actions'


function mapStateToProps(state) {
    return {
        rates: state.rates,
        minimumStay: state.minimumStay
    };
}

export default connect(mapStateToProps, { updatePeriodicMinimumStay, getPeriodicMinimumStay, selectPicker })(Periodic);