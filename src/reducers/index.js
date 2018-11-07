import { combineReducers } from 'redux';
import  dateReducer from "./reducer_calendar";
import  panesReducer from "./reducer_active_panes";
import  rates from "./reducer_rates";
import  reservation from "./reducer_reservation";
import  minimumStay from "./reducer_minimum_stay";
import  closedUnits from "./reducer_closed";

const rootReducer = combineReducers({
  calendarData: dateReducer,
  calendarPane: panesReducer,
  reservation: reservation,
  rates: rates,
  minimumStay: minimumStay,
  closedUnits: closedUnits
});

export default rootReducer;
