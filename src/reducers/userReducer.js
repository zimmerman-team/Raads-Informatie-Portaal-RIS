import { userInitial } from './initialState';
import * as types from '../actions/actionTypes';

export default function user(state = userInitial, action) {
  switch (action.type) {
    case types.LOAD_USER_DOSSIERS_SUCCESS:
      return {
        ...state,
        dossiers: action.dossiers,
        dossierCount: action.count,
        isLoading: false,
      };
    case types.LOAD_USER_DOSSIERS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_DOSSIER_CONTENT_SUCCESS:
      return {
        ...state,
        content: action.content,
        count: action.count,
        isLoading: false,
      };
    case types.LOAD_DOSSIER_CONTENT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_FAVORITE_SUCCESS:
      return {
        ...state,
        favorites: action.favorites,
        favoriteCount: action.count,
        isLoading: false,
      };
    case types.LOAD_FAVORITE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token,
        isLoading: false,
      };
    case types.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOGOUT_SUCCESS:
      return userInitial;
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case types.GET_USER_DATA_SUCCESS:
      return {
        ...state,
        name: action.data.name,
        token: action.token,
        surname: action.data.surname,
        userID: action.data.userID,
        email: action.data.email,
        username: action.data.username,
        prof_pic: action.data.prof_pic,
        is_admin: action.data.is_admin,
        type: action.data.type,
        isLoading: false,
      };
    case types.GET_USER_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.EDIT_PROFILE_DATA_SUCCESS:
      return {
        ...state,
        clearForm: state.clearForm++,
      };
    case types.LOAD_USER_QUERIES_SUCCESS:
      return {
        ...state,
        queries: action.queries,
        queriesCount: action.count,
        isLoading: false,
      };
    case types.LOAD_USER_QUERIES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_MY_NOTES_SUCCESS:
      return {
        ...state,
        notes: action.notes,
        isLoading: false,
      };
    case types.LOAD_MY_NOTES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_MY_AGENDAS_SUCCESS:
      return {
        ...state,
        myAgenda: action.myAgenda,
      };
    case types.LOAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.notifications,
      };
    case types.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        allUsers: action.users,
        allUsersCount: action.count,
      };
    case types.UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case types.UPLOAD_FILE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.SET_SELECTED_COMBINED_ITEM_ID:
      return {
        ...state,
        selectedCombinedItem: action.item,
      };
    case types.REMOVE_SELECTED_COMBINED_ITEM_ID:
      return {
        ...state,
        selectedCombinedItem: null,
      };
    case types.DELETE_ACCOUNT_SUCCESS:
      return userInitial;
    case types.DELETE_ACCOUNT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}
