import SidebarCalendar from '../components/sidebar/SidebarCalendar';
import { connect } from "react-redux";

function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane
    };
}

export default connect(mapStateToProps)(SidebarCalendar);