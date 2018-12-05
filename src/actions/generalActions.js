import _ from 'lodash';
import { browserHistory } from 'react-router';
import * as types from './actionTypes';
import { addAgenda, deleteDossier, addNotification, addFavorite } from './userActions';
import {
  setAddUserModal,
  setPublicDossierModal,
  setEventModal,
  setAgendaItemModal,
  deleteEvent,
  setDocumentModal,
  deletePublicDossier,
} from './publisherActions';
import { loadCombined } from './combinedActions';
import {
  MAKE_QUERY,
  MAKE_FOLDER,
  MAKE_NOTE,
  DELETE_FOLDER,
  ADD_MY_AGENDA,
  SET_NOTIFICATION,
  ADD_FAVORITE,
  CREATE_PUBLIC_DOSSIER,
  CREATE_NEW_EVENT,
  CREATE_NEW_AGENDA_ITEM,
  DELETE_EVENT,
  ADD_USER,
  CREATE_NEW_DOCUMENT,
  EDIT_EVENT,
  EDIT_PUBLIC_DOSSIER,
  DELETE_PUBLIC_DOSSIER,
} from '../constants';

export function setSortBy(value, loadData = true) {
  return function(dispatch, getState) {
    dispatch(fetchSetSortBy(value));
    if (loadData) dispatch(loadCombined());
  };
}

function fetchSetSortBy(value) {
  return function(dispatch) {
    dispatch(setSortBySuccess(value));
  };
}

export function setSortBySuccess(value) {
  return { type: types.SET_SORT_BY_SUCCESS, sortBy: value };
}

// ------------------------------------------------------------- //

export function setActivePage(value, loadData = true) {
  return function(dispatch, getState) {
    dispatch(fetchSetActivePage(value));
    if (loadData) dispatch(loadCombined());
  };
}

function fetchSetActivePage(value) {
  return function(dispatch) {
    dispatch(setActivePageSuccess(value));
  };
}

export function setActivePageSuccess(value) {
  return { type: types.SET_ACTIVE_PAGE_SUCCESS, page: value };
}

// ------------------------------------------------------------- //

export function setActiveTab(value) {
  return function(dispatch, getState) {
    dispatch(setActiveTabSuccess(value));
  };
}

export function setActiveTabSuccess(value) {
  return { type: types.SET_ACTIVE_TAB_SUCCESS, tab: value };
}

// ------------------------------------------------------------- //

export function setSnackBar(message, type = 'general', action = null) {
  return function(dispatch) {
    const visibility = message !== '';
    const _message = message.detail ? message.detail : message;
    dispatch(setSnackBarSuccess(visibility, _message, type, action));
  };
}

export function setSnackBarSuccess(visibility, message, _type, action) {
  return { type: types.SET_SNACKBAR_SUCCESS, visibility, message, _type, action };
}

// ------------------------------------------------------------- //

export function setDossierModal(itemID = null, folder = null, item_type = 'combined') {
  return function(dispatch, getState) {
    dispatch(setDossierModalSuccess(itemID, folder, item_type));
  };
}

export function setDossierModalSuccess(itemID, folder, item_type) {
  return { type: types.SET_DOSSIER_MODAL_SUCCESS, itemID, folder, item_type };
}

// ------------------------------------------------------------- //

export function setAddNote(document = null, visibility = false, note = null) {
  return function(dispatch, getState) {
    dispatch(setAddNoteSuccess(document, visibility, note));
  };
}

export function setAddNoteSuccess(document, visibility, note) {
  return {
    type: types.SET_ADD_NOTE_SUCCESS,
    document,
    visibility,
    note,
  };
}

// ------------------------------------------------------------- //

export function setQueryModal() {
  return function(dispatch, getState) {
    const { queryModal } = getState();
    dispatch(setQueryModalSuccess(!queryModal.visibility));
  };
}

export function setQueryModalSuccess(visibility) {
  return { type: types.SET_QUERY_MODAL_SUCCESS, visibility };
}

// ------------------------------------------------------------- //

export function handleActionMenuClick() {
  return function(dispatch, getState) {
    const { actionMenu } = getState();
    dispatch(handleActionMenuClickSuccess(!actionMenu.open));
  };
}

export function handleActionMenuClickSuccess(value) {
  return { type: types.HANDLE_ACTION_MENU_CLICK_SUCCESS, value };
}

// ------------------------------------------------------------- //

export function handleActionClick(type, urlParams = {}) {
  return function(dispatch, getState) {
    const { user, addNote, singleEvent } = getState();
    switch (type) {
      case MAKE_FOLDER:
        dispatch(setDossierModal());
        break;
      case MAKE_QUERY:
        dispatch(setQueryModal());
        break;
      case MAKE_NOTE:
        dispatch(setAddNote(addNote.document, true));
        break;
      case DELETE_FOLDER:
        const folderUser = _.find(user.dossiers, d => {
          return d.id === parseInt(urlParams.id, 10);
        });
        dispatch(deleteDossier(urlParams.id, folderUser.owner.id));
        browserHistory.replace('/folders');
        break;
      case ADD_MY_AGENDA:
        dispatch(addAgenda(parseInt(singleEvent.eventData.id, 10)));
        break;
      case SET_NOTIFICATION:
        dispatch(addNotification(parseInt(user.selectedCombinedItem, 10)));
        break;
      case ADD_FAVORITE:
        dispatch(addFavorite(parseInt(user.selectedCombinedItem, 10)));
        break;
      case CREATE_PUBLIC_DOSSIER:
        dispatch(setPublicDossierModal(true));
        break;
      case CREATE_NEW_EVENT:
        dispatch(setEventModal(true));
        break;
      case CREATE_NEW_AGENDA_ITEM:
        dispatch(setAgendaItemModal(true));
        break;
      case DELETE_EVENT:
        if (window.confirm('Weet u zeker dat u de evenement permanent wilt verwijderen?')) {
          dispatch(deleteEvent(singleEvent.eventData.id));
        }
        break;
      case ADD_USER:
        dispatch(setAddUserModal(true));
        break;
      case CREATE_NEW_DOCUMENT:
        dispatch(setDocumentModal(true));
        break;
      case EDIT_EVENT:
        dispatch(setEventModal(true, urlParams.id));
        break;
      case EDIT_PUBLIC_DOSSIER:
        dispatch(setPublicDossierModal(true, urlParams.id));
        break;
      case DELETE_PUBLIC_DOSSIER:
        if (window.confirm('Weet u zeker dat u de dossier permanent wilt verwijderen?')) {
          dispatch(
            deletePublicDossier(urlParams.id, () => browserHistory.replace('/publieke-dossiers')),
          );
        }
        break;
      default:
        dispatch(setSnackBar('Not implemented yet'));
    }
  };
}

export function generalRequest() {
  return { type: types.GENERAL_REQUEST };
}

export function generalRequestFailed() {
  return { type: types.GENERAL_REQUEST_FAILED };
}

export function setSelectedCombinedItemID(item) {
  return { type: types.SET_SELECTED_COMBINED_ITEM_ID, item };
}

export function removeSelectedCombinedItemID() {
  return { type: types.REMOVE_SELECTED_COMBINED_ITEM_ID };
}

export function fromPasswordReset(value) {
  return { type: types.FROM_PASSWORD_RESET, value };
}
