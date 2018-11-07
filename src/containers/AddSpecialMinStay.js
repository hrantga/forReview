import AddSpecialMinStay from '../components/sidebar/minimumstay/AddSpecialMinStay';
import { connect } from "react-redux";
import { createSpecialMinimumStay, updateSpecialMinimumStay, deleteSpecialMinimumStay } from '../actions/minimum_stay_action';
import { selectPicker } from '../actions/calendar_actions'


function mapStateToProps(state) {
    return {
        calendarPane: state.calendarPane,
        rates: state.rates
    };
}

export default connect(mapStateToProps, { createSpecialMinimumStay, updateSpecialMinimumStay, deleteSpecialMinimumStay, selectPicker })(AddSpecialMinStay);