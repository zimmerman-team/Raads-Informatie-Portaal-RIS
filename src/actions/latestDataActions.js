import axios from 'axios';
import moment from 'moment';
import * as types from './actionTypes';
import appResources from '../appResources';

export function loadLatestData(page) {
  return function(dispatch) {
    dispatch(loadLatestDataRequest());
    axios
      .get(
        `${appResources.backendUrl}combined/?page_size=4&ordering=-date&end_date=${moment()
          .add(1, 'days')
          .format('YYYY-MM-DD')}&page=${page}`,
      )
      .then(response => {
        const data = response.data.results.map(item => {
          return {
            id: item.id,
            date: item.date,
            title: item.name,
            type: item.item_type,
            item_id: item.item_id,
            createdAt: item.last_modified,
            location: `Stadhuis ${appResources.municipality}`,
            download_url: item.url,
          };
        });
        dispatch(loadLatestDataSuccess(data, response.data.count));
      })
      .catch(error => {});
  };
}

export function loadLatestDataSuccess(data, resultsCount) {
  return { type: types.LOAD_LATEST_DATA_SUCCESS, data, resultsCount };
}

export function loadLatestDataRequest() {
  return { type: types.LOAD_LATEST_DATA_REQUEST };
}

export function clearLatestData() {
  return { type: types.CLEAR_LATEST_DATA };
}
