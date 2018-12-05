import { filters } from './initialState';
import * as types from '../actions/actionTypes';

export default function filtersReducer(state = filters, action) {
  switch (action.type) {
    case types.ADD_FILTER_SUCCESS:
      return action.filters;
    case types.REMOVE_FILTER_SUCCESS:
      return action.filters;
    case types.REMOVE_ALL_FILTER_SUCCESS:
      return [];
    case types.SET_FILTER_SUCCESS:
      return action.filters;
    case types.SET_SAVED_QUERY:
      return action.query.filters;
    default:
      return state;
  }
}
