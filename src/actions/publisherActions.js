import axios from 'axios';
import get from 'lodash/get';
import filter from 'lodash/filter';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';
import appResources from '../appResources';
import { setSnackBar } from './generalActions';
import { loadSingleEvent } from './eventActions';
import { loadPublicDossiers } from './folderActions';
import { loadCombined } from './combinedActions';
import { removeParamByName } from '../helpers';

// New user //

export function setAddUserModal(value = false, user = false) {
  return function(dispatch) {
    dispatch(setAddUserModalSuccess(value, user));
  };
}

export function setAddUserModalSuccess(value, user) {
  return { type: types.ADD_USER_MODAL_SUCCESS, value, user };
}

// New public dossier //

export function setPublicDossierModal(value = false, dossierID = null) {
  return function(dispatch) {
    dispatch(setPublicDossierModalSuccess(value, dossierID));
  };
}

export function setPublicDossierModalSuccess(value, dossierID) {
  return { type: types.SET_PUBLIC_DOSSIER_MODAL_SUCCESS, value, dossierID };
}

export function setPublicDossierSelectedDocuments(items) {
  return { type: types.SET_SELECTED_DOCUMENTS, items };
}

export function setPublicDossierSelectedDossiers(items) {
  return { type: types.SET_SELECTED_DOSSIERS, items };
}

export function clearPublicDossierModalData() {
  return { type: types.CLEAR_PUBLIC_DOSSIER_MODAL_DATA };
}

export function createPublicDossier(
  title,
  documents,
  dossiers,
  published,
  goToPublicDossiers,
  that,
  initialState,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}public-dossiers/`,
        { title, published },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        if (documents.length > 0) {
          dispatch(addPublicDossierContent(parseInt(response.data.id, 10), documents));
        }
        dossiers.forEach(d => {
          dispatch(
            addPublicDossierContent(parseInt(d.id, 10), [
              {
                id: parseInt(response.data.combined_id, 10),
                type: 'public_dossier',
              },
            ]),
          );
        });
        that.setState({ ...initialState });
        dispatch(clearPublicDossierModalData());
        dispatch(setPublicDossierModal());
        goToPublicDossiers(response.data.id);
        dispatch(setSnackBar('Dossier succesvol toegevoegd!', 'success'));
      })
      .catch(error => {
        that.setState({ isLoading: false });
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function editPublicDossier(
  id,
  title,
  removeDocs,
  documents,
  removeFromDossiers,
  dossiers,
  published,
  goToPublicDossiers,
  that,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .put(
        `${appResources.backendUrl}public-dossiers/${id}/edit/`,
        { title, published },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        if (removeDocs.concat(removeFromDossiers).length > 0) {
          dispatch(
            deletePublicDossierContent(parseInt(id, 10), removeDocs.concat(removeFromDossiers)),
          );
        }
        if (documents.length > 0) {
          dispatch(addPublicDossierContent(parseInt(id, 10), documents));
        }
        dossiers.forEach(d => {
          dispatch(
            addPublicDossierContent(parseInt(d.id, 10), [
              {
                id: parseInt(response.data.combined_id, 10),
                type: 'public_dossier',
              },
            ]),
          );
        });
        that.setState({ isLoading: false });
        dispatch(setPublicDossierModal());
        dispatch(clearPublicDossierModalData());
        goToPublicDossiers(id);
        dispatch(setSnackBar('Dossier succesvol bijgewerkt!', 'success'));
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
        that.setState({ isLoading: false });
      });
  };
}

function addPublicDossierContent(id, content) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}public-dossiers/add-content/`,
        { dossier: parseInt(id, 10), items: content },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

function deletePublicDossierContent(id, content) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}public-dossiers/remove-content/`,
        { dossier: parseInt(id, 10), items: content },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function deletePublicDossier(id, goToDossiers) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .delete(`${appResources.backendUrl}public-dossiers/${id}/delete/`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(loadPublicDossiers());
        goToDossiers();
        dispatch(setSnackBar('Dossier succesvol verwijderd', 'success'));
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function deleteCouncilDoc(id, type) {
  return function(dispatch, getState) {
    const { user } = getState();

    axios
      .post(
        `${appResources.backendUrl}delete-document/`,
        { doc_id: id, doc_type: type },
        {
          headers: { Authorization: `Token ${user.token}` },
        },
      )
      .then(response => {
        if (response.status === 401) {
          dispatch(setSnackBar('Onbevoegd'));
        } else {
          dispatch(setSnackBar('Document succesvol verwijderd', 'success'));
          dispatch(loadCombined());
        }
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function setPublicDossierPublishStatus(id, value) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}public-dossiers/change-publish-status/`,
        { id: parseInt(id, 10), value },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        // dispatch(loadPublicDossiers());
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

// New event //

export function setEventModal(value = false, eventID = null) {
  return function(dispatch) {
    dispatch(setEventModalSuccess(value, eventID));
  };
}

export function setEventModalSuccess(value, eventID) {
  return { type: types.SET_NEW_EVENT_SUCCESS, value, eventID };
}

export function clearEventModalData() {
  return { type: types.CLEAR_EVENT_MODAL_DATA };
}

export function createNewEvent(
  that,
  defState,
  name,
  description,
  location,
  start_time,
  end_time,
  published,
  rooms,
  eventDate,
) {
  // that.setState({ isLoading: true });
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}events/create/`,
        { name, description, location, start_time, end_time, published },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        for (let i = 0; i < rooms.length; i++) {
          dispatch(
            createNewChildEvent(
              rooms[i],
              response.data.id,
              published,
              eventDate,
              start_time,
              end_time,
            ),
          );
        }
        dispatch(clearEventModalData());
        dispatch(setEventModal());
        const newState = defState;
        newState.initialState.politiekeMarktNumber = that.state.politiekeMarktNumber;
        that.setState({
          ...newState.initialState,
        });
        dispatch(
          setSnackBar(
            'Agenda succesvol toegevoegd!',
            'success',
            rooms.length === 0 ? { type: 'add_agenda', id: response.data.id } : null,
          ),
        );
        if (rooms.length > 0 || window.location.pathname === '/agenda') {
          // dispatch(saveDate(eventDate));
          setTimeout(() => window.location.reload(), 200);
        }
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
        that.setState({ isLoading: false });
      });
  };
}

function createNewChildEvent(event, parent_id, published, eventDate, start_time, end_time) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}events/create-child/`,
        {
          parent_id,
          published,
          name: event.title,
          start_time: event.start_time ? `${eventDate} ${event.start_time}` : null,
          end_time: event.end_time ? `${eventDate} ${event.end_time}` : null,
        },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

function editChildEvent(id, event, eventDate, start_time, end_time) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}events/edit-child/`,
        {
          event_id: id,
          start_time: event.start_time ? `${eventDate} ${event.start_time}` : null,
          end_time: event.end_time ? `${eventDate} ${event.end_time}` : null,
        },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function changeEventPublishStatus(event_id, published) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}change-event-publish-status/`,
        { event_id, published },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function getEventPublishStatus(event_id, that) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}get-event-publish-status/`,
        { event_id },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        that.setState({ published: response.data.value });
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function deleteEvent(
  id,
  event_type = 'event',
  postDeleteFunction = () => {
    window.history.back();
  },
) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .delete(`${appResources.backendUrl}events/${id}/?type=${event_type}`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        postDeleteFunction();
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function editEvent(
  that,
  defState,
  id,
  name,
  description,
  location,
  start_time,
  end_time,
  published,
  rooms,
  eventDate,
  extraLoadingFunc = null,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}events/edit/`,
        { id, name, description, location, start_time, end_time, published },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        for (let i = 0; i < rooms.length; i++) {
          const action = get(rooms[i], 'action', 'delete');
          if (action === 'add') {
            dispatch(createNewChildEvent(rooms[i], id, published, eventDate, start_time, end_time));
          } else if (action === 'edit') {
            dispatch(editChildEvent(rooms[i].originID, rooms[i], eventDate, start_time, end_time));
          } else if (action === 'delete') {
            dispatch(deleteEvent(rooms[i].originID, 'child_event', () => window.location.reload()));
          }
        }
        dispatch(clearEventModalData());
        dispatch(setEventModal());
        const newState = defState;
        newState.initialState.politiekeMarktNumber = that.state.politiekeMarktNumber;
        that.setState({
          ...newState.initialState,
        });
        dispatch(
          setSnackBar(
            'Agenda succesvol bewerkt!',
            'success',
            !window.location.pathname.startsWith('/evenement') && rooms.length === 0
              ? { type: 'add_agenda', id: response.data.id }
              : null,
          ),
        );
        if (rooms.length > 0 || window.location.pathname === '/agenda') {
          setTimeout(() => window.location.reload(), 1000);
        }
        if (window.location.pathname.startsWith('/evenement')) {
          extraLoadingFunc();
        }
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
        that.setState({ isLoading: false });
      });
  };
}

export function setEventDocumentModal(value = false) {
  return function(dispatch) {
    dispatch(setEventDocumentSuccess(value));
  };
}

export function setEventDocumentSuccess(value) {
  return { type: types.SET_EVENT_DOCUMENT_MODAL_SUCCESS, value };
}

export function setEventDocuments(items) {
  return { type: types.SET_EVENT_DOCUMENTS, items };
}

export function clearEventDocumentData() {
  return { type: types.CLEAR_EVENT_DOCUMENT_MODAL_DATA };
}

export function addEventDocuments(that, docs, initialState) {
  return function(dispatch, getState) {
    const { user } = getState();
    const url = `${appResources.backendUrl}events/${that.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${that.props.params.eventId}/`;
    const obj = {
      docs,
      event_id: that.state.eventID,
    };
    axios
      .post(`${appResources.backendUrl}add-documents-to-event/`, obj, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(loadSingleEvent([url, c_url]));
        that.setState({ ...initialState });
        dispatch(setEventDocumentModal(false));
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function removeEventDocument(that, document, eventID) {
  return function(dispatch, getState) {
    const { user } = getState();
    const url = `${appResources.backendUrl}events/${that.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${that.props.params.eventId}/`;
    const obj = {
      document,
      event_id: eventID,
    };
    axios
      .post(`${appResources.backendUrl}remove-document-from-event/`, obj, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(loadSingleEvent([url, c_url]));
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

// New agenda item //

export function setAgendaItemModal(
  value = false,
  agendaItemID = null,
  eventID = null,
  agendaIndex = null,
) {
  return function(dispatch) {
    dispatch(setAgendaItemModalSuccess(value, agendaItemID, eventID, agendaIndex));
  };
}

export function setAgendaItemModalSuccess(value, agendaItemID, eventID, agendaIndex) {
  return { type: types.SET_NEW_AGENDA_ITEM_SUCCESS, value, agendaItemID, eventID, agendaIndex };
}

export function setAgendaItemSelectedDocuments(items) {
  return { type: types.SET_AGENDA_ITEM_SELECTED_DOCUMENTS, items };
}

export function setAgendaItemSelectedDossiers(items) {
  return { type: types.SET_AGENDA_ITEM_DOSSIERS, items };
}

export function clearAgendaItemModalData() {
  return { type: types.CLEAR_AGENDA_ITEM_MODAL_DATA };
}

export function createNewAgendaItem(
  that,
  mock,
  event_id,
  name,
  description,
  start_time,
  end_time,
  docs,
  dossiers,
  griffier,
  medewerker,
  order,
) {
  that.setState({ isLoading: true });
  return function(dispatch, getState) {
    const { user } = getState();
    const url = `${appResources.backendUrl}events/${that.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${that.props.params.eventId}/`;
    const obj = {
      event_id,
      name,
      description,
      griffier,
      medewerker,
    };
    if (order) {
      obj.order = order;
    }
    if (start_time) {
      obj.start_time = start_time;
    }
    if (end_time) {
      obj.end_time = end_time;
    }
    axios
      .post(`${appResources.backendUrl}agenda_items/create/`, obj, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(addMediaToAgendaItems(response.data.id, docs, dossiers));
        dispatch(clearAgendaItemModalData());
        dispatch(setAgendaItemModal());
        that.setState({ ...mock.initialState });
        // window.location.reload();
        setTimeout(() => dispatch(loadSingleEvent([url, c_url])), 200);
        dispatch(setSnackBar('Agendapunt succesvol toegevoegd!', 'success'));
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data));
        that.setState({ isLoading: false });
      });
  };
}

export function deleteAgendaItem(id, that) {
  return function(dispatch, getState) {
    const { user } = getState();
    const url = `${appResources.backendUrl}events/${that.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${that.props.params.eventId}/`;
    axios
      .delete(`${appResources.backendUrl}agenda_items/${id}/`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(setSnackBar('Agendapunt succesvol verwijderd!', 'success'));
        browserHistory.replace(removeParamByName('agenda'));
        dispatch(loadSingleEvent([url, c_url]));
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function addMediaToAgendaItems(agenda_item_id, documents, dossiers) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}agenda_item/add-items/`,
        { agenda_item_id, documents, dossiers },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function editAgendaItem(
  agenda_id,
  title,
  description,
  start_time,
  end_time,
  mock,
  that,
  docs,
  dossiers,
  removeDocs,
  removeDossiers,
  griffier,
  medewerker,
  order,
) {
  that.setState({ isLoading: true });
  return function(dispatch, getState) {
    const { user } = getState();
    const url = `${appResources.backendUrl}events/${that.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${that.props.params.eventId}/`;
    const obj = {
      agenda_id,
      title,
      description,
      griffier,
      medewerker,
    };
    if (order) {
      obj.order = order;
    }
    if (that.state.clearTimes) {
      obj.clear_times = true;
    } else {
      if (start_time) {
        obj.start_time = start_time;
      }
      if (end_time) {
        obj.end_time = end_time;
      }
    }
    axios
      .post(`${appResources.backendUrl}agenda_items/edit/`, obj, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        removeDocs.concat(removeDossiers).forEach(d => {
          dispatch(deleteAgendaMediaItem(parseInt(d.id, 10), that));
        });
        dispatch(addMediaToAgendaItems(agenda_id, docs, dossiers));
        dispatch(clearAgendaItemModalData());
        dispatch(setAgendaItemModal());
        that.setState({ ...mock.initialState });
        dispatch(setSnackBar('Agendapunt succesvol aangepast', 'success'));
        dispatch(loadSingleEvent([url, c_url]));
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data));
        that.setState({ isLoading: false });
      });
  };
}

export function deleteAgendaMediaItem(id, that) {
  return function(dispatch, getState) {
    const { user } = getState();
    const url = `${appResources.backendUrl}events/${that.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${that.props.params.eventId}/`;
    axios
      .delete(`${appResources.backendUrl}agenda_media_items/${id}/`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(setSnackBar('Agendapunt item succesvol verwijderd!', 'success'));
        dispatch(loadSingleEvent([url, c_url]));
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

// New document //

export function setDocumentModal(value = false, docData) {
  return function(dispatch) {
    dispatch(setDocumentModalSuccess(value, docData));
  };
}

export function setDocumentModalSuccess(value, docData) {
  return { type: types.SET_DOCUMENT_MODAL_SUCCESS, value, docData };
}

export function createNewDocuments(that, mock, files, data) {
  return function(dispatch, getState) {
    const { user } = getState();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    if (data.author_id) {
      formData.append('author_id', data.author_id);
    }
    if (data.status) {
      formData.append('status', data.status);
    }
    if (data.dossier_id) {
      formData.append('dossier_id', data.dossier_id);
    }
    formData.append('type', data.type);
    formData.append('subject', data.subject);
    formData.append('portfolio', data.portfolio);
    formData.append('published', data.published);
    axios
      .post(`${appResources.backendUrl}upload-documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${user.token}`,
        },
      })
      .then(response => {
        that.setState(
          {
            ...mock.initialState,
            files: filter(that.state.files, o => {
              return !o.enabled;
            }),
          },
          () => {
            if (that.state.files.length === 0) {
              dispatch(setDocumentModal());
            }
          },
        );
        dispatch(setSnackBar(response.data.response, 'success'));
        dispatch(loadCombined());
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function editDocument(that, mock, data) {
  return function(dispatch, getState) {
    const { user } = getState();

    axios
      .post(`${appResources.backendUrl}edit-document/`, data, {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      })
      .then(response => {
        that.setState(
          {
            ...mock.initialState,
            files: filter(that.state.files, o => {
              return !o.enabled;
            }),
          },
          () => {
            if (that.state.files.length === 0) {
              dispatch(setDocumentModal());
            }
          },
        );
        dispatch(setSnackBar(response.data.response, 'success'));
        dispatch(loadCombined());
      })
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}

export function changeDocumentPublishStatus(doc_id, doc_type, value) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .post(
        `${appResources.backendUrl}change-document-publish-status/`,
        { doc_id, doc_type, value },
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {})
      .catch(error => {
        dispatch(setSnackBar('Er is iets fout gegaan...'));
      });
  };
}
