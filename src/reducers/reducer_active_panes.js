import { SWITCH_PANE, OPEN_RATES_SIDEBAR, OPEN_CALENDAR_SIDEBAR, OPEN_CLOSED_SIDEBAR, RESET_SIDEBAR, RESET_CLOSED, OPEN_SIDEBAR,OPEN_SIDEBAR_RESET } from '../actions/active_pane_action';
const initState= {
    activeIndex: 0,
    ratesSidebarOpen: {},
    calendarSidebarOpen: {},
    openClosedSidebar: {},
    close: false,
    openSidebar: false
}

export default function (state = initState, action) {
    switch  (action.type){
        case RESET_SIDEBAR:
            return {...state, calendarSidebarOpen: {}, calendarSidebarOpen: {}, calendarSidebarOpen: {}, close: action.payload, openSidebar: false}
        case OPEN_SIDEBAR_RESET:
            return {...state, openSidebar: action.payload}
        case OPEN_SIDEBAR:
            return {...state, calendarSidebarOpen: {}, calendarSidebarOpen: {}, calendarSidebarOpen: {}, openSidebar: action.payload, close: false}
        case RESET_CLOSED:
            return {...state, close: action.payload, openSidebar: false}
        case SWITCH_PANE:
            return {...state, activeIndex: action.payload, close: false, openSidebar: false}
        case OPEN_RATES_SIDEBAR:
            return {...state, ratesSidebarOpen: action.payload, close: false, openSidebar: false}
        case OPEN_CALENDAR_SIDEBAR:
            return {...state, calendarSidebarOpen: action.payload, activeIndex: 0, openSidebar: false}
        case OPEN_CLOSED_SIDEBAR:
            return {...state, openClosedSidebar: action.payload, close: false, openSidebar: false}
        default:
            return state;
    }
}

