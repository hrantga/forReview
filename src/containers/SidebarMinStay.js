import SidebarMinStay from '../components/sidebar/SidebarMinStay';
import { connect } from "react-redux";
import { getSpecialMinimumStay } from '../actions/minimum_stay_action';


function mapStateToProps(state) {
    return {
        rates: state.rates,
        minimumStay: state.minimumStay
    };
}

export default connect(mapStateToProps, { getSpecialMinimumStay })(SidebarMinStay);