import remove from 'lodash/remove';
import * as types from './actionTypes';
import { generateID } from '../helpers';
import { loadCombined } from './combinedActions';

export function addFilter(type, value, label = '', loadData = true) {
  return function(dispatch, getState) {
    const { filters } = getState();
    dispatch(fetchAddFilter(filters, type, value, label));
    // dispatch(setActivePage(1, loadData));
    // dispatch(loadCombined())
  };
}

function fetchAddFilter(_filters, type, value, label) {
  return function(dispatch, getState) {
    const filters = _filters;
    if (type === 'date') {
      remove(_filters, { type });
    }
    filters.push({
      type,
      value,
      label,
      id: generateID(),
    });
    dispatch(addFilterSuccess(_filters));
  };
}

export function addFilterSuccess(filters) {
  return { type: types.ADD_FILTER_SUCCESS, filters };
}

// ------------------------------------------------- //

export function removeFilter(type, id, loadData = true) {
  return function(dispatch, getState) {
    const { filters } = getState();
    dispatch(fetchRemoveFilter(filters, type, id));
    // if (loadData) dispatch(loadCombined());
  };
}

function fetchRemoveFilter(filters, type, id) {
  return function(dispatch) {
    remove(filters, { type, id });
    dispatch(removeFilterSuccess(filters));
  };
}

export function removeFilterSuccess(filters) {
  return { type: types.REMOVE_FILTER_SUCCESS, filters };
}

// ------------------------------------------------- //

export function removeAllFilters(loadData = true) {
  return function(dispatch, getState) {
    dispatch(fetchRemoveAllFilters());
    // if (loadData) dispatch(loadCombined());
  };
}

function fetchRemoveAllFilters() {
  return function(dispatch) {
    dispatch(removeAllFilterSuccess());
  };
}

export function removeAllFilterSuccess() {
  return { type: types.REMOVE_ALL_FILTER_SUCCESS };
}

// ------------------------------------------------- //

export function setFilters(filters) {
  return function(dispatch, getState) {
    dispatch(fetchSetFilters(filters));
    // dispatch(loadCombined());
  };
}

function fetchSetFilters(filters) {
  return function(dispatch) {
    dispatch(setFilterSuccess(filters));
  };
}

export function setFilterSuccess(filters) {
  return { type: types.SET_FILTER_SUCCESS, filters };
}

// ------------------------------------------------- //
