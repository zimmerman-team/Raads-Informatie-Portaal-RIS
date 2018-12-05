import axios from 'axios';
import * as types from './actionTypes';
import appResources from '../appResources';
import { setSelectedCombinedItemID, setSnackBar } from './generalActions';

export function loadEvents(url) {
  return function(dispatch, getState) {
    const { user, events } = getState();
    if (events.isLoading) {
      window.stop();
    }
    dispatch(loadEventsRequest());
    axios
      .get(url, user.token !== '' ? { headers: { Authorization: `Token ${user.token}` } } : {})
      .then(response => {
        const events = [];
        const eventsArray = response.data.results;

        for (let i = 0; i < eventsArray.length; i++) {
          const event = {};

          event.id = eventsArray[i].id;
          event.uid = eventsArray[i].combined_id;
          event.title = eventsArray[i].name;
          event.name = eventsArray[i].name;
          event.start = new Date(eventsArray[i].start_time);
          event.date = new Date(eventsArray[i].start_time);
          event.end = new Date(eventsArray[i].start_time);
          event.end.setHours(event.end.getHours() + 1);
          event.itemsCount =
            parseInt(eventsArray[i].agenda_count, 10) +
            parseInt(eventsArray[i].document_count, 10) +
            parseInt(eventsArray[i].media_count, 10);
          event.type = 'event';
          event.url = `/evenement/${eventsArray[i].id}`;
          event.classification = eventsArray[i].classification;
          event.published = eventsArray[i].published;
          events.push(event);
        }

        dispatch(loadEventsSuccess(events));
      })
      .catch(error => {});
  };
}

export function loadEventsSuccess(events) {
  return { type: types.LOAD_EVENTS_SUCCESS, events };
}

export function loadEventsRequest() {
  return { type: types.LOAD_EVENTS_REQUEST };
}

// -------------------------------------------------------- //

export function loadSingleEvent(urls) {
  return function(dispatch) {
    dispatch(loadSingleEventRequest());
    axios
      .all([axios.get(urls[0]), axios.get(urls[1])])
      .then(response => {
        const event = response[0].data;
        const c_events = response[1].data.results;
        const emptyEvent =
          event.documents.length === 0 && event.agenda.length === 0 && c_events.count === 0;
        dispatch(setSelectedCombinedItemID(event.combined_id));
        dispatch(loadSingleEventSuccess([event, c_events]));
        if (emptyEvent) {
          dispatch(setSnackBar('Dit onderdeel bevat geen data'));
        }
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function loadSingleEventSuccess(data) {
  return { type: types.LOAD_SINGLE_EVENT_SUCCESS, data };
}

export function loadSingleEventRequest() {
  return { type: types.LOAD_SINGLE_EVENT_REQUEST };
}

// -------------------------------------------------------- //

export function loadEventSpeakers(eventID) {
  return function(dispatch) {
    axios
      .get(`${appResources.backendUrl}event_speakers/${eventID}/?page_size=300`)
      .then(response => {
        const speakers = response.data.results;
        dispatch(loadEventSpeakersSuccess(speakers));
      })
      .catch(error => {});
  };
}

export function loadEventSpeakersSuccess(data) {
  return { type: types.LOAD_EVENT_SPEAKERS_SUCCESS, data };
}

export function loadEventSpeakersRequest() {
  return { type: types.LOAD_EVENT_SPEAKERS_REQUEST };
}

export function saveDate(date) {
  return { type: types.SAVE_CALENDAR_DATE, date };
}

export function clearDate() {
  return { type: types.CLEAR_CALENDAR_DATE };
}
