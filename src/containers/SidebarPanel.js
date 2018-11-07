import SidebarPanel from '../components/sidebar/SidebarPanel';
import { connect } from "react-redux";
import { closedSet, openSidebarReset } from '../actions/active_pane_action';

function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        reservation: state.reservation
    };
}

export default connect(mapStateToProps, {closedSet, openSidebarReset})(SidebarPanel);