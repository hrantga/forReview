import Duration from '../components/sidebar/closeopen/Duration';
import { connect } from "react-redux";
import { createClosedUnits, updateClosedUnit, removeClosedUnit } from '../actions/close_open_action';
import { selectPicker } from '../actions/calendar_actions'


function mapStateToProps(state) {
    return {
        rates: state.rates,
        calendarPane: state.calendarPane
    };
}

export default connect(mapStateToProps, { createClosedUnits, updateClosedUnit, removeClosedUnit, selectPicker })(Duration);