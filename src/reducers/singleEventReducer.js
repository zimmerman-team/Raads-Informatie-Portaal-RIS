import * as types from '../actions/actionTypes';
import { singleEventInitial } from './initialState';

export default function singleEvent(state = singleEventInitial, action) {
  switch (action.type) {
    case types.LOAD_SINGLE_EVENT_SUCCESS:
      return {
        ...state,
        eventData: action.data[0],
        childEventsData: action.data[1],
        isLoading: false,
      };
    case types.LOAD_SINGLE_EVENT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_EVENT_SPEAKERS_SUCCESS:
      return {
        ...state,
        speakers: action.data,
      };
    default:
      return state;
  }
}
