import { combined } from './initialState';
import * as types from '../actions/actionTypes';

export default function combinedReducer(state = combined, action) {
  switch (action.type) {
    case types.LOAD_COMBINED_SUCCESS:
      return {
        ...state,
        resultsCount: action.data.resultsCount,
        data: action.data.data,
        timelineData: action.data.timelineData,
        timelineStart: action.data.timelineStart,
        timelineEnd: action.data.timelineEnd,
        isLoading: false,
        apiCallCount: state.apiCallCount - 1,
      };
    case types.LOAD_COMBINED_REQUEST:
      return {
        ...state,
        apiCallCount: state.apiCallCount + 1,
        isLoading: true,
      };
    case types.LOAD_COMBINED_FAILURE:
      return {
        ...state,
        apiCallCount: state.apiCallCount + 1,
        isLoading: false,
      };
    case types.SPECIFY_SEARCH:
      return {
        ...state,
        searchType: action.typez,
      };
    default:
      return state;
  }
}
