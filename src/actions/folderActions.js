import axios from 'axios';
import { browserHistory } from 'react-router';
import { isLoggedIn } from '../helpers';
import appResources from '../appResources';
import { setSnackBar } from './generalActions';
import { loadUserDossiers } from './userActions';
import * as types from './actionTypes';
import {
  formatPublicDossiers,
  formatPublicDossierDocs,
  formatPublicDossierDossiers,
} from '../data-formatters/PublicDossierDataFormatter';

export function shareDossier(dossierID, emails, permission = 'view') {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      for (let i = 0; i < emails.length; i++) {
        axios
          .post(
            `${appResources.backendUrl}dossier/share/`,
            {
              dossier_id: dossierID,
              email: emails[i],
              permission,
            },
            { headers: { Authorization: `Token ${user.token}` } },
          )
          .then(response => {
            dispatch(setSnackBar(response.data.response));
          })
          .catch(error => {
            dispatch(setSnackBar('Er is iets fout gegaan...'));
          });
      }
      dispatch(loadUserDossiers());
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

export function confirmShareDossier(uuid) {
  return function(dispatch) {
    axios
      .post(`${appResources.backendUrl}dossier/confirm_invitation/`, { uuid })
      .then(response => {
        sessionStorage.removeItem('folder-uuid');
        dispatch(setSnackBar(response.data.response));
        dispatch(loadUserDossiers());
        if (isLoggedIn()) browserHistory.replace('/folders');
        else browserHistory.replace('/');
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data));
        if (error.response.status === 401) {
          sessionStorage.setItem('folder-uuid', uuid);
          browserHistory.replace('/login');
        } else if (error.response.status === 404) {
          sessionStorage.removeItem('folder-uuid');
        }
      });
  };
}

export function loadPublicDossiers(page = 1, page_size = 10, sort_by = '-last_modified', q = '') {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadPublicDossiersRequest());
    axios
      .get(
        `${
          appResources.backendUrl
        }public-dossiers/?page=${page}&page_size=${page_size}&ordering=${sort_by}&search=${q}`,
        { headers: user.token !== '' ? { Authorization: `Token ${user.token}` } : {} },
      )
      .then(response => {
        dispatch(
          loadPublicDossiersSuccess(
            response.data.count,
            formatPublicDossiers(response.data.results),
          ),
        );
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data));
      });
  };
}

export function loadPublicDossiersSuccess(count, data) {
  return { type: types.LOAD_PUBLIC_DOSSIERS_SUCCESS, count, data };
}

export function loadPublicDossiersRequest() {
  return { type: types.LOAD_PUBLIC_DOSSIERS_REQUEST };
}

export function loadPublicDossier(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadPublicDossierRequest());
    axios
      .get(
        `${appResources.backendUrl}public-dossiers/${id}/`,
        user.token !== '' ? { headers: { Authorization: `Token ${user.token}` } } : {},
      )
      .then(response => {
        const data = {
          title: response.data.title,
          created_at: response.data.created_at,
          last_modified: response.data.last_modified,
          parent_dossier: response.data.parent_dossier,
          document_count: response.data.document_count,
          dossier_count: response.data.folder_count,
          published: response.data.published,
          documents: formatPublicDossierDocs(response.data.documents),
          dossiers: formatPublicDossierDossiers(response.data.dossiers),
        };
        dispatch(loadPublicDossierSuccess(data));
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data));
      });
  };
}

export function loadPublicDossierSuccess(data) {
  return { type: types.LOAD_PUBLIC_DOSSIER_SUCCESS, data };
}

export function loadPublicDossierRequest() {
  return { type: types.LOAD_PUBLIC_DOSSIER_REQUEST };
}
