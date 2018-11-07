import CalendarNotification from '../components/calendar/CalendarNotification';
import { connect } from "react-redux";
import { switchPane,openSidebar } from "../actions/active_pane_action";


export default connect(null , {switchPane, openSidebar})(CalendarNotification);