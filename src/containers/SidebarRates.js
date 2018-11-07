import SidebarRates from '../components/sidebar/SidebarRates';
import { connect } from "react-redux";
import { accordionOpen } from '../actions/rates_action';


function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        rates: state.rates
    };
}

export default connect(mapStateToProps, { accordionOpen })(SidebarRates);