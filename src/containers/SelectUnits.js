import SelectUnits from '../components/sidebar/SelectUnits';
import { connect } from "react-redux";
import { selectedRatesSidebar } from '../actions/rates_action'

function mapStateToProps(state) {
    return {
        calendarData: state.calendarData,
        calendarPane: state.calendarPane
    };
}

export default connect(mapStateToProps, { selectedRatesSidebar })(SelectUnits);