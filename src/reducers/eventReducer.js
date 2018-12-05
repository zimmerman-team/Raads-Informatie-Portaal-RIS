import * as types from '../actions/actionTypes';
import { events } from './initialState';

export default function eventReducer(state = events, action) {
  switch (action.type) {
    case types.LOAD_EVENTS_SUCCESS:
      return {
        data: action.events,
        isLoading: false,
        date: state.date,
      };
    case types.LOAD_EVENTS_REQUEST:
      return {
        data: [],
        isLoading: true,
        date: state.date,
      };
    case types.SAVE_CALENDAR_DATE:
      return {
        ...state,
        date: action.date,
      };
    case types.CLEAR_CALENDAR_DATE:
      return {
        ...state,
        date: '',
      };
    default:
      return state;
  }
}
