import * as types from '../actions/actionTypes';
import {
  sortByState,
  activePage,
  activeTab,
  snackBar,
  dossierInitial,
  actionMenuInitial,
  queryInitial,
  addNoteInitial,
  loadingInitial,
  latestDataInitial,
  publicDossierInitial,
} from './initialState';

export function sortBy(state = sortByState, action) {
  switch (action.type) {
    case types.SET_SORT_BY_SUCCESS:
      return action.sortBy;
    case types.SET_SAVED_QUERY:
      return action.query.sortBy;
    default:
      return state;
  }
}

export function page(state = activePage, action) {
  switch (action.type) {
    case types.SET_ACTIVE_PAGE_SUCCESS:
      return action.page;
    case types.SET_SAVED_QUERY:
      return action.query.page;
    default:
      return state;
  }
}

export function tab(state = activeTab, action) {
  switch (action.type) {
    case types.SET_ACTIVE_TAB_SUCCESS:
      return action.tab;
    case types.SET_SAVED_QUERY:
      return action.query.tab;
    default:
      return state;
  }
}

export function snackbar(state = snackBar, action) {
  switch (action.type) {
    case types.SET_SNACKBAR_SUCCESS:
      return {
        message: action.message,
        visibility: action.visibility,
        type: action._type,
        action: action.action,
      };
    default:
      return state;
  }
}

export function dossierModal(state = dossierInitial, action) {
  switch (action.type) {
    case types.SET_DOSSIER_MODAL_SUCCESS:
      return {
        itemID: action.itemID,
        visibility: action.itemID !== '' || action.folder !== null,
        folder: action.folder,
        item_type: action.item_type,
      };
    default:
      return state;
  }
}

export function addNote(state = addNoteInitial, action) {
  switch (action.type) {
    case types.SET_ADD_NOTE_SUCCESS:
      return {
        document: action.document,
        visibility: action.visibility,
        note: action.note,
      };
    default:
      return state;
  }
}

export function actionMenu(state = actionMenuInitial, action) {
  switch (action.type) {
    case types.HANDLE_ACTION_MENU_CLICK_SUCCESS:
      return {
        open: action.value,
      };
    default:
      return state;
  }
}

export function queryModal(state = queryInitial, action) {
  switch (action.type) {
    case types.SET_QUERY_MODAL_SUCCESS:
      return {
        visibility: action.visibility,
      };
    default:
      return state;
  }
}

export function isLoading(state = loadingInitial, action) {
  switch (action.type) {
    case types.GENERAL_REQUEST_FAILED:
      return false;
    case types.GENERAL_REQUEST:
      return true;
    default:
      return state;
  }
}

export function publicDossiers(state = latestDataInitial, action) {
  switch (action.type) {
    case types.LOAD_PUBLIC_DOSSIERS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_PUBLIC_DOSSIERS_SUCCESS:
      return {
        data: action.data,
        resultsCount: action.count,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function publicDossier(state = publicDossierInitial, action) {
  switch (action.type) {
    case types.LOAD_PUBLIC_DOSSIER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_PUBLIC_DOSSIER_SUCCESS:
      return {
        title: action.data.title,
        combined_id: action.data.combined_id,
        created_at: action.data.created_at,
        last_modified: action.data.last_modified,
        parent_dossier: action.data.parent_dossier,
        isLoading: false,
        document_count: action.data.document_count,
        dossier_count: action.data.dossier_count,
        published: action.data.published,
        documents: action.data.documents,
        dossiers: action.data.dossiers,
      };
    default:
      return state;
  }
}

export function fromPasswordReset(state = false, action) {
  switch (action.type) {
    case types.FROM_PASSWORD_RESET:
      return action.value;
    default:
      return state;
  }
}
