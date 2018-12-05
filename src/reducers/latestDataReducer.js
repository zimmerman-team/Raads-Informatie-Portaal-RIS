import * as types from '../actions/actionTypes';
import { latestDataInitial } from './initialState';

export default function latestData(state = latestDataInitial, action) {
  switch (action.type) {
    case types.LOAD_LATEST_DATA_SUCCESS:
      return {
        isLoading: false,
        data: action.data,
        resultsCount: action.resultsCount,
      };
    case types.LOAD_LATEST_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.CLEAR_LATEST_DATA:
      return latestDataInitial;
    default:
      return state;
  }
}
