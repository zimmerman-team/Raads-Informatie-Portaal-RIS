import { publisherInitial } from './initialState';
import * as types from '../actions/actionTypes';

export default function publisher(state = publisherInitial, action) {
  switch (action.type) {
    case types.SET_PUBLIC_DOSSIER_MODAL_SUCCESS:
      return {
        ...state,
        publicDossierModalVisibility: action.value,
        publicDossierSelectedID: action.dossierID,
      };
    case types.SET_SELECTED_DOCUMENTS:
      return {
        ...state,
        publicDossierSelectedDocuments: action.items,
      };
    case types.SET_SELECTED_DOSSIERS:
      return {
        ...state,
        publicDossierSelectedDossiers: action.items,
      };
    case types.CLEAR_PUBLIC_DOSSIER_MODAL_DATA:
      return {
        ...state,
        publicDossierSelectedDocuments: [],
        publicDossierSelectedDossiers: [],
      };
    case types.SET_NEW_EVENT_SUCCESS:
      return {
        ...state,
        newEventModalVisibility: action.value,
        newEventSelectedID: action.eventID,
      };
    case types.CLEAR_EVENT_MODAL_DATA:
      return {
        ...state,
        newEventSelectedID: null,
      };
    case types.SET_EVENT_DOCUMENT_MODAL_SUCCESS:
      return {
        ...state,
        eventDocumentModalVisibility: action.value,
      };
    case types.SET_EVENT_DOCUMENTS:
      return {
        ...state,
        eventDocumentModalDocuments: action.items,
      };
    case types.CLEAR_EVENT_DOCUMENT_MODAL_DATA:
      return {
        ...state,
        eventDocumentModalDocuments: [],
      };
    case types.SET_NEW_AGENDA_ITEM_SUCCESS:
      return {
        ...state,
        newAgendaItemModalVisibility: action.value,
        newAgendaItemSelectedID: action.agendaItemID,
        newAgendaItemSelectedIndex: action.agendaIndex,
        selectedEventID: action.eventID,
      };
    case types.CLEAR_AGENDA_ITEM_MODAL_DATA:
      return {
        ...state,
        newAgendaItemSelectedID: null,
        newAgendaItemSelectedDocuments: [],
        newAgendaItemSelectedDossiers: [],
        newAgendaItemSelectedIndex: null,
        selectedEventID: null,
      };
    case types.SET_AGENDA_ITEM_SELECTED_DOCUMENTS:
      return {
        ...state,
        newAgendaItemSelectedDocuments: action.items,
      };
    case types.SET_AGENDA_ITEM_DOSSIERS:
      return {
        ...state,
        newAgendaItemSelectedDossiers: action.items,
      };
    case types.ADD_USER_MODAL_SUCCESS:
      return {
        ...state,
        userToEdit: action.user,
        addUserModalVisibility: action.value,
      };
    case types.SET_DOCUMENT_MODAL_SUCCESS:
      return {
        ...state,
        docData: action.docData,
        newDocumentModalVisibility: action.value,
      };
    default:
      return state;
  }
}
