import StandardRates from '../components/sidebar/rates/StandardRates';
import { connect } from "react-redux";
import { updateStandardRates } from '../actions/rates_action'

function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        rates: state.rates,
        calendarPane: state.calendarPane
    };
}

export default connect(mapStateToProps, { updateStandardRates })(StandardRates);