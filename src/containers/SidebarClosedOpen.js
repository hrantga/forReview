import SidebarClosedOpen from '../components/sidebar/SidebarClosedOpen';
import { connect } from "react-redux";

function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        closedUnits: state.closedUnits,
        rates: state.rates
    };
}

export default connect( mapStateToProps )(SidebarClosedOpen);