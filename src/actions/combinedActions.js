import _ from 'lodash';
import axios from 'axios';
import * as types from './actionTypes';
import {
  getTimelineDates,
  formatTimelineData,
  formatSearchResults,
} from '../data-formatters/SearchResultsDataFormatter';
import appResources from '../appResources';

function groupFilters(filters) {
  const filtersObj = {
    date: [],
    item_type: [],
  };
  for (let i = 0; i < filters.length; i++) {
    const f = filters[i];
    if (f.type !== 'date') {
      filtersObj[f.type].push(f.value.substring(f.value.indexOf('=') + 1));
    } else {
      filtersObj[f.type].push(f.value);
    }
  }
  return filtersObj;
}

export function loadCombined() {
  return function(dispatch, getState) {
    dispatch(loadCombinedRequest());

    const { user, filters, sortBy, page, combined } = getState();
    const keywords = _.filter(filters, { type: 'search' })
      .map(c => c.value)
      .join();
    const groupedFilters = groupFilters(
      _.filter(filters, f => {
        return f.type !== 'search';
      }),
    );
    let filterString = '';
    for (const prop in groupedFilters) {
      if (prop !== 'date') {
        filterString += `&${prop}=${groupedFilters[prop].map(value => value).join(',')}`;
      } else {
        filterString += `&${groupedFilters[prop]}`;
      }
    }
    const url = `${appResources.backendUrl}combined/?format=json&page_size=10&page=${page}&${
      combined.searchType
    }=${keywords}${filterString}&ordering=${sortBy}`;

    axios
      .get(url, user.token !== '' ? { headers: { Authorization: `Token ${user.token}` } } : {})
      .then(response => {
        const timelineDates = getTimelineDates(response.data.results);
        const data = {
          resultsCount: response.data.count,
          data: formatSearchResults(response),
          timelineData: formatTimelineData(response.data.results),
          timelineStart: timelineDates[0],
          timelineEnd: timelineDates[1],
        };
        dispatch(loadCombinedSuccess(data));
      })
      .catch(error => {
        dispatch(loadCombinedFailure());
      });
  };
}

export function loadCombinedSuccess(data) {
  return { type: types.LOAD_COMBINED_SUCCESS, data };
}

export function loadCombinedRequest() {
  return { type: types.LOAD_COMBINED_REQUEST };
}

export function loadCombinedFailure() {
  return { type: types.LOAD_COMBINED_FAILURE };
}

export function specifySearch(typez = 'q') {
  return { type: types.SPECIFY_SEARCH, typez };
}
