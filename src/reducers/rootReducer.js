import { combineReducers } from 'redux';
import events from './eventReducer';
import combined from './combinedReducer';
import filters from './filtersReducer';
import user from './userReducer';
import latestData from './latestDataReducer';
import singleEvent from './singleEventReducer';
import publisher from './publisherReducer';
import {
  sortBy,
  page,
  tab,
  snackbar,
  dossierModal,
  actionMenu,
  queryModal,
  addNote,
  isLoading,
  publicDossiers,
  publicDossier,
  fromPasswordReset,
} from './generalReducers';

const rootReducer = combineReducers({
  events,
  combined,
  filters,
  sortBy,
  page,
  tab,
  snackbar,
  user,
  dossierModal,
  latestData,
  singleEvent,
  actionMenu,
  queryModal,
  addNote,
  isLoading,
  publicDossiers,
  publicDossier,
  publisher,
  fromPasswordReset,
});

export default rootReducer;
