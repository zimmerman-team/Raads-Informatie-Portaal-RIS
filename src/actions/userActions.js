import axios from 'axios';
import * as types from './actionTypes';
import _ from 'lodash';
import moment from 'moment';
import { browserHistory } from 'react-router';
import appResources from '../appResources';
import { isLoggedIn, getCookie } from '../helpers';
import { confirmShareDossier } from './folderActions';
import { setSnackBar, setDossierModal, setQueryModal, fromPasswordReset } from './generalActions';

export function addUser(name, lastName, email, mobileNumber, type, that) {
  return function(dispatch, getState) {
    const { user } = getState();
    const pass =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    axios
      .post(
        `${appResources.backendUrl}accounts/register/`,
        {
          first_name: name,
          last_name: lastName,
          email,
          mobile_number: mobileNumber ? mobileNumber : ' ',
          type,
          username: name,
          password: pass,
          password2: pass,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        },
      )
      .then(response => {
        if (response.status === 401) {
          dispatch(setSnackBar('Gebruiker met die e-mail bestaat al'));
          that.setState({ isLoading: false });
        } else {
          dispatch(
            setSnackBar('Door de gebruiker gemaakte activeringslink naar hen verzonden', 'success'),
          );
          that.setState({
            name: false,
            lastName: false,
            email: false,
            mobileNumber: false,
            type: '',
            isLoading: false,
          });
          that.handleClose();
        }
      })
      .catch(error => {
        that.setState({ isLoading: false });
        if (
          error.response.data &&
          error.response.data.username &&
          error.response.data.username[0] === 'A user with that username already exists.'
        ) {
          dispatch(setSnackBar('Een gebruiker met die gebruikersnaam bestaat al.'));
        } else if (
          error.response.data &&
          error.response.data.email &&
          error.response.data.email[0] === 'Enter a valid email address.'
        ) {
          dispatch(setSnackBar('Voer een geldig e-mailadres in.'));
        } else {
          dispatch(setSnackBar(error.response.data.detail));
        }
      });
  };
}

export function editUser(id, name, lastName, email, mobileNumber, type, that) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .put(
        `${appResources.backendUrl}accounts/profile/change/`,
        {
          id,
          first_name: name,
          last_name: lastName,
          email,
          mobile_number: mobileNumber ? mobileNumber : ' ',
          type,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        },
      )
      .then(response => {
        if (response.status === 401) {
          dispatch(setSnackBar('Gebruiker met die e-mail bestaat al'));
          that.setState({ isLoading: false });
        } else {
          dispatch(setSnackBar('Gebruiker succesvol bewerkt', 'success'));
          that.setState({
            name: false,
            lastName: false,
            email: false,
            mobileNumber: false,
            type: '',
            isLoading: false,
          });
          that.handleClose();
          dispatch(getAllUsers());
        }
      })
      .catch(error => {
        that.setState({ isLoading: false });
        if (
          error.response.data &&
          error.response.data.username &&
          error.response.data.username[0] === 'A user with that username already exists.'
        ) {
          dispatch(setSnackBar('Een gebruiker met die gebruikersnaam bestaat al.'));
        } else if (
          error.response.data &&
          error.response.data.email &&
          error.response.data.email[0] === 'Enter a valid email address.'
        ) {
          dispatch(setSnackBar('Voer een geldig e-mailadres in.'));
        } else {
          dispatch(setSnackBar(error.response.data.detail));
        }
      });
  };
}

export function loadUserDossiers(page = 1, page_size = 10) {
  return function(dispatch, getState) {
    const { user } = getState();

    dispatch(loadUserDossiersRequest());
    if (isLoggedIn()) {
      axios
        .get(`/dossier/list/?page_size=${page_size}&page=${page}`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          dispatch(loadUserDossiersSuccess(response.data.results, response.data.count));
        })
        .catch(error => {});
    } else {
      dispatch(loadUserDossiersSuccess([], 0));
    }
  };
}

export function loadUserDossiersSuccess(dossiers, count) {
  return { type: types.LOAD_USER_DOSSIERS_SUCCESS, dossiers, count };
}

export function loadUserDossiersRequest() {
  return { type: types.LOAD_USER_DOSSIERS_REQUEST };
}

export function loadDossierContents(
  dossier_id,
  page = 1,
  ordering = 'name',
  q = null,
  page_size = 10,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadDossierContentRequest());
    if (isLoggedIn()) {
      // So here we convert the chips into an array of queries
      const queries =
        q && q !== null && !_.isEmpty(q)
          ? q.map(query => {
              return query.value;
            })
          : false;
      const url = queries
        ? `/dossier/content/${dossier_id}/?page_size=${page_size}&page=${page}&ordering=${ordering}&q=${queries}`
        : `/dossier/content/${dossier_id}/?page_size=${page_size}&page=${page}&ordering=${ordering}`;
      axios
        .get(url, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          dispatch(loadDossierContentSuccess(response.data.results, response.data.count));
        })
        .catch(error => {});
    } else {
      dispatch(loadDossierContentSuccess([]));
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

export function loadDossierContentSuccess(content, count) {
  return { type: types.LOAD_DOSSIER_CONTENT_SUCCESS, content, count };
}

export function loadDossierContentRequest() {
  return { type: types.LOAD_DOSSIER_CONTENT_REQUEST };
}

// -------------------------------------------------- //

export function createUserDossier(title, accessibility, color) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadUserDossiersRequest());
    if (isLoggedIn()) {
      axios
        .post(
          '/dossier/create/',
          {
            title,
            accessibility,
            color,
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(response => {
          dispatch(loadUserDossiers());
          dispatch(setDossierModal(''));
          dispatch(setSnackBar('Folder is succesvol aangemaakt'));
        })
        .catch(error => {});
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

export function editUserDossier(folder_id, title, accessibility, color) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadUserDossiersRequest());
    if (isLoggedIn()) {
      axios
        .put(
          `/dossier/edit/`,
          {
            dossier_id: folder_id,
            title,
            accessibility,
            color,
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(response => {
          dispatch(loadUserDossiers());
          dispatch(setDossierModal(''));
          dispatch(setSnackBar(response.data.response));
        })
        .catch(error => {
          dispatch(setSnackBar(error.response.message));
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function deleteDossier(id, userID) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadUserDossiersRequest());
    if (isLoggedIn()) {
      if (user.userID === userID) {
        axios
          .delete(`dossier/delete/`, {
            data: {
              dossier_id: parseInt(id, 10),
            },
            headers: { Authorization: `Token ${user.token}` },
          })
          .then(response => {
            dispatch(loadUserDossiers());
          })
          .catch(error => {});
      } else {
        dispatch(unshareDossier(id));
      }
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function shareDossier(dossierID, selectedUsers) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      for (let i = 0; i < selectedUsers.length; i++) {
        axios
          .post(
            'dossier/share/',
            {
              dossier: dossierID,
              username: '',
              email: selectedUsers[i].email,
              permission: 'Just_display',
            },
            { headers: { Authorization: `Token ${user.token}` } },
          )
          .then(response => {})
          .catch(error => {
            dispatch(setSnackBar('Er is iets fout gegaan...'));
          });
      }
      dispatch(loadUserDossiers());
      dispatch(setSnackBar('Dossier met succes gedeeld'));
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function unshareDossier(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadUserDossiersRequest());
    if (isLoggedIn()) {
      axios
        .delete(`dossier/unshare/${id}/`, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          dispatch(loadUserDossiers());
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan...'));
        });
    }
  };
}

// -------------------------------------------------- //

export function createAndAddToDossier(title, accessibility, color, itemId) {
  return function(dispatch, getState) {
    const { user, dossierModal } = getState();
    if (isLoggedIn()) {
      const obj1 = {
        title,
        accessibility,
        color,
      };
      axios
        .post('/dossier/create/', obj1, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          if (dossierModal.item_type === 'combined') {
            const obj2 = {
              dossier: parseInt(response.data.id, 10),
              items: [parseInt(itemId, 10)],
            };
            axios
              .post('/dossier/content/add/', obj2, {
                headers: { Authorization: `Token ${user.token}` },
              })
              .then(response => {
                dispatch(loadUserDossiers());
                if (response.status === 201) {
                  dispatch(setDossierModal(''));
                  dispatch(setSnackBar('Item is succesvol toegevoegd aan het nieuwe folder'));
                }
              })
              .catch(error => {
                dispatch(setSnackBar('Er is iets fout gegaan...'));
              });
          } else if (dossierModal.item_type === 'note') {
            dispatch(addNoteToDossier(parseInt(response.data.id, 10), parseInt(itemId, 10)));
          }
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan...'));
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function addToDossier(dossierID, itemID) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      const obj = {
        dossier: parseInt(dossierID, 10),
        items: [parseInt(itemID, 10)],
      };
      axios
        .post(`/dossier/content/add/`, obj, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          dispatch(loadUserDossiers());
          dispatch(setSnackBar(response.data.response));
        })
        .catch(error => {
          dispatch(setSnackBar(error.response.data.detail));
        });
    }
  };
}

export function addNoteToDossier(dossierID, noteID) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      const obj = {
        dossier: parseInt(dossierID, 10),
        note_id: parseInt(noteID, 10),
      };
      axios
        .post(`/dossier/note-content/add/`, obj, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          dispatch(loadUserDossiers());
          dispatch(setSnackBar(response.data.response));
        })
        .catch(error => {
          dispatch(setSnackBar(error.response.data.detail));
        });
    }
  };
}

// -------------------------------------------------- //

export function removeFromDossier(
  dossierId,
  itemId,
  pagez = 1,
  order = 'name',
  queries = null,
  page_sizez = 10,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    axios
      .delete(`dossier/content/delete/${itemId}/`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(loadDossierContents(dossierId, pagez, order, queries, page_sizez));
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data.detail));
      });
  };
}

export function removeNoteFromDossier(
  dossierID,
  noteID,
  pagez = 1,
  order = 'name',
  queries = null,
  page_sizez = 10,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    const obj = {
      dossier_id: parseInt(dossierID, 10),
      note_id: parseInt(noteID, 10),
    };
    axios
      .post('dossier/note-content/delete/', obj, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(response => {
        dispatch(loadDossierContents(dossierID, pagez, order, queries, page_sizez));
      })
      .catch(error => {
        dispatch(setSnackBar(error.response.data.detail));
      });
  };
}

// -------------------------------------------------- //

export function addFavorite(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .post(
          'favorite/add/',
          {
            item: parseInt(id, 10),
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(response => {
          dispatch(loadFavorites());
          dispatch(setSnackBar('Item toegevoegd aan favorieten'));
        })
        .catch(error => {
          const status = error.message.substr(error.message.length - 3);
          if (parseInt(status, 10) === 403) {
            dispatch(loadFavorites());
            dispatch(setSnackBar('Item toegevoegd aan favorieten'));
          } else if (parseInt(status, 10) === 401) {
            dispatch(setSnackBar('Er is iets fout gegaan...'));
          }
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function removeFavorite(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .delete(`favorite/delete/${id}/`, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          dispatch(loadFavorites());
        })
        .catch(error => {});
    }
  };
}

// -------------------------------------------------- //

export function loadFavorites(page = 1, page_size = 10) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadFavoriteRequest());
    if (isLoggedIn()) {
      axios
        .get(`favorite/list/?page_size=${page_size}&page=${page}`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          const results = response.data.results;
          const favorites = results.map(result => {
            let url;
            switch (result.item.item_type) {
              case 'event':
                url = `/evenement/${result.item.item_id}`;
                break;
              case 'child_event':
                url = `/evenement/${result.item.parent_id}/?zaal=${result.item.item_id}`;
                break;
              case 'document':
                url = result.item.url;
                break;
              default:
                url = result.item.url;
            }
            const item = {
              parent_id: result.item.parent_id,
              fav_id: result.id,
              uid: result.item.id,
              id: result.item.item_id,
              name: result.item.name,

              event_date:
                result.item.item_type === 'event' || result.item.item_type === 'child_event'
                  ? moment(result.item.date).format('DD-MM-YYYY')
                  : '',

              last_modified: moment(result.item.last_modified).format('DD-MM-YYYY'),
              url,
              author: 'John The Great',
              title: {
                link: url,
                title: result.item.name,
                description: result.item.description ? result.item.description : '',
              },
              options: {
                fav_id: result.id,
                origin_id: result.id,
                combined_id: result.item.item_id,
                type: result.item.item_type,
              },
              status: {
                text: 'Besloten',
                icon: {
                  text: 'clear',
                  color: '#ff0000',
                },
              },
              type: result.item.item_type,
            };
            return item;
          });
          dispatch(loadFavoriteSuccess(favorites, response.data.count));
        })
        .catch(error => {});
    } else {
      dispatch(loadFavoriteSuccess([], 0));
    }
  };
}

export function loadFavoriteSuccess(favorites, count) {
  return { type: types.LOAD_FAVORITE_SUCCESS, favorites, count };
}

export function loadFavoriteRequest() {
  return { type: types.LOAD_FAVORITE_REQUEST };
}

// -------------------------------------------------- //

export function login(obj, rememberMe = false, fromPasswordResetValue = false) {
  return function(dispatch) {
    const cookiesExpirationDate = new Date();
    cookiesExpirationDate.setFullYear(cookiesExpirationDate.getFullYear() + 1);
    dispatch(loginRequest());
    axios
      .post(`accounts/login/`, obj)
      .then(response => {
        if (response.status === 200) {
          if (rememberMe) {
            document.cookie = `token=${
              response.data.key
            }; expires=${cookiesExpirationDate.toUTCString()}`;
          }
          if (sessionStorage.getItem('folder-uuid')) {
            dispatch(confirmShareDossier(sessionStorage.getItem('folder-uuid')));
          }
          sessionStorage.setItem('token', response.data.key);
          dispatch(loginSuccess(response.data.key));
          dispatch(getUserData(response.data.key));
          if (fromPasswordResetValue) {
            browserHistory.push('/');
            dispatch(fromPasswordReset(false));
          } else {
            browserHistory.goBack();
          }
        } else {
          dispatch(loginFailure());
          dispatch(
            setSnackBar(
              response.data !== undefined ? response.data.detail : 'Er is iets fout gegaan.',
            ),
          );
        }
      })
      .catch(error => {
        dispatch(loginFailure());
        dispatch(
          setSnackBar(
            error.response.data !== undefined
              ? error.response.data.detail
              : 'Er is iets fout gegaan.',
          ),
        );
      });
  };
}

export function loginSuccess(token) {
  return { type: types.LOGIN_SUCCESS, token };
}

export function loginRequest() {
  return { type: types.LOGIN_REQUEST };
}

export function loginFailure() {
  return { type: types.LOGIN_FAILURE };
}

// -------------------------------------------------- //

export function getUserData(token = getCookie('token'), route = null) {
  return function(dispatch) {
    if (token !== '') {
      dispatch(getUserDataRequest());
      axios
        .get(`${appResources.backendUrl}accounts/user/`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then(response => {
          const obj = {
            userID: response.data.id,
            email: response.data.email,
            name: response.data.first_name,
            surname: response.data.last_name,
            username: response.data.username,
            prof_pic: appResources.backendUrl.concat(response.data.profile_pic),
            is_admin:
              response.data.type === 'admin' ||
              response.data.type === 'auteur' ||
              response.data.is_admin,
            type: response.data.is_admin ? 'admin' : response.data.type,
          };
          if (response.status !== 401) {
            dispatch(getUserDataSuccess(obj, token));
            if (route) browserHistory.replace(route);
          }
        })
        .catch(error => {
          if (error.response.data.detail.toLowerCase().contains('token')) {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          }
          const message =
            error.response.data !== undefined
              ? error.response.data.detail
              : 'Er is iets fout gegaan';
          dispatch(setSnackBar(message));
        });
    }
  };
}

export function getUserDataSuccess(data, token) {
  return { type: types.GET_USER_DATA_SUCCESS, data, token };
}

export function getUserDataRequest() {
  return { type: types.GET_USER_DATA_REQUEST };
}

// -------------------------------------------------- //

export function logout() {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(logoutRequest());
    axios
      .post(
        `${appResources.backendUrl}accounts/logout/`,
        {},
        { headers: { Authorization: `Token ${user.token}` } },
      )
      .then(response => {
        if (response.status === 200) {
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          dispatch(logoutSuccess());
          browserHistory.push('/');
          axios.defaults.headers.common.Authorization = '';
          dispatch(setSnackBar('Succesvol afgemeld'));
        }
      });
  };
}

export function logoutSuccess() {
  return { type: types.LOGOUT_SUCCESS };
}

export function logoutRequest() {
  return { type: types.LOGOUT_REQUEST };
}

// -------------------------------------------------- //

export function editProfileData(requests) {
  return function(dispatch, getState) {
    dispatch(editProfileDataRequest());
    const { user } = getState();
    axios
      .all(requests)
      .then(
        axios.spread(responses => {
          dispatch(getUserData(user.token));
          dispatch(editProfileDataSuccess());
          dispatch(setSnackBar('Profielgegevens worden succesvol bijgewerkt.'));
        }),
      )
      .catch(error => {
        let message = 'Er is iets fout gegaan';
        if (error.response && error.response.data && typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.non_field_errors[0]) {
          message = error.response.data.non_field_errors[0];
        }
        dispatch(setSnackBar(message));
      });
  };
}

export function editProfileDataSuccess() {
  return { type: types.EDIT_PROFILE_DATA_SUCCESS };
}

export function editProfileDataRequest() {
  return { type: types.EDIT_PROFILE_DATA_REQUEST };
}

// -------------------------------------------------- //

export function deleteAccount(id = false) {
  return function(dispatch, getState) {
    if (isLoggedIn()) {
      dispatch(deleteAccountRequest());
      const { user } = getState();
      const url = id ? `/accounts/profile/delete/${id}` : `/accounts/profile/delete/`;
      axios
        .delete(url, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          if (id) {
            dispatch(getAllUsers());
          } else {
            sessionStorage.removeItem('token');
            dispatch(setSnackBar('Account verwijderd'));
            axios.defaults.headers.common.Authorization = '';
            browserHistory.push('/login');
            dispatch(deleteAccountSuccess());
          }
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan'));
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

export function deleteAccountSuccess() {
  return { type: types.DELETE_ACCOUNT_SUCCESS };
}

export function deleteAccountRequest() {
  return { type: types.DELETE_ACCOUNT_REQUEST };
}

// -------------------------------------------------- //

export function loadUserQueries(page = 1, page_size = 10) {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadUserQueriesRequest());
    if (isLoggedIn()) {
      axios
        .get(`/query/list/?page_size=${page_size}&page=${page}`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          dispatch(loadUserQueriesSuccess(response.data.results, response.data.count));
        })
        .catch(error => {});
    } else {
      dispatch(loadUserQueriesSuccess([], 0));
    }
  };
}

export function loadUserQueriesSuccess(queries, count) {
  return { type: types.LOAD_USER_QUERIES_SUCCESS, queries, count };
}

export function loadUserQueriesRequest() {
  return { type: types.LOAD_USER_QUERIES_REQUEST };
}

// -------------------------------------------------- //

export function removeQuery(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .delete(`query/delete/${id}`, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          dispatch(loadUserQueries(1, 10));
        })
        .catch(error => {});
    }
  };
}

// -------------------------------------------------- //

export function createQuery(queryObject) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .post(`query/create/`, queryObject, { headers: { Authorization: `Token ${user.token}` } })
        .then(response => {
          dispatch(loadUserQueries());
          dispatch(setQueryModal());
          dispatch(setSnackBar('Zoek zoekopdracht is succesvol opgeslagen'));
        })
        .catch(error => {});
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function setSavedQuery(query) {
  return { type: types.SET_SAVED_QUERY, query };
}

// My Agenda ------------------------------------------//

export function addAgenda(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .post(
          'my_agenda/add/',
          {
            agenda_id: id,
            user_id: parseInt(user.userID, 10),
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(response => {
          if (response.data.response === 'added') {
            dispatch(loadMyAgendas());
            dispatch(setSnackBar("Item toegevoegd aan mijn agenda's"));
          } else {
            dispatch(setSnackBar('Er is iets fout gegaan'));
          }
        })
        .catch(error => {
          const status = error.message.substr(error.message.length - 3);
          if (parseInt(status, 10) === 406) {
            dispatch(setSnackBar('Evenement al toegevoegd'));
          } else {
            dispatch(setSnackBar('Er is iets fout gegaan'));
          }
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

export function removeAgenda(id) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .delete('my_agenda/remove/', {
          data: {
            agenda_id: id,
            user_id: parseInt(user.userID, 10),
          },
          headers: {
            Authorization: `Token ${user.token}`,
          },
        })
        .then(response => {
          if (response.data.response === 'deleted') {
            dispatch(loadMyAgendas());
            dispatch(setSnackBar("Item verwijderd van mijn agenda's"));
          } else {
            dispatch(setSnackBar('Er is iets fout gegaan'));
          }
        })
        .catch(error => {
          const status = error.message.substr(error.message.length - 3);
          if (parseInt(status, 10) === 406) {
            dispatch(setSnackBar('Evenement al toegevoegd'));
          } else {
            dispatch(setSnackBar('Er is iets fout gegaan'));
          }
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

export function loadMyAgendas() {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .get(`my_agenda/list/`, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        })
        .then(response => {
          dispatch(loadMyAgendasSuccess(response.data.results));
        })
        .catch(error => {});
    }
  };
}

export function loadMyAgendasSuccess(myAgenda) {
  return { type: types.LOAD_MY_AGENDAS_SUCCESS, myAgenda };
}

// My Agenda END --------------------------------------//

export function loadNotifications() {
  return function(dispatch, getState) {
    const { user } = getState();
    dispatch(loadNotificationsRequest());
    if (isLoggedIn()) {
      axios
        .post(
          `/subscription/get/`,
          {
            user: user.userID,
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(response => {
          dispatch(loadNotificationsSuccess(response.data));
        })
        .catch(error => {});
    } else {
      dispatch(loadNotificationsSuccess([], 0));
    }
  };
}

export function loadNotificationsSuccess(notifications) {
  return { type: types.LOAD_NOTIFICATIONS_SUCCESS, notifications };
}

export function loadNotificationsRequest() {
  return { type: types.LOAD_NOTIFICATIONS_REQUEST };
}

// -------------------------------------------------- //

export function addNotification(item_id) {
  return function(dispatch, getState) {
    const { user } = getState();
    const isItemNotification = _.find(user.notifications, n => {
      if (n.id === item_id) {
        return true;
      }
    });
    if (isItemNotification === undefined) {
      if (isLoggedIn()) {
        axios
          .post(
            '/subscription/subscribe/',
            {
              user: user.userID,
              item: item_id,
            },
            { headers: { Authorization: `Token ${user.token}` } },
          )
          .then(response => {
            dispatch(loadNotifications());
            dispatch(setSnackBar('Notificatie succesvol toegevoegd.'));
          })
          .catch(error => {
            dispatch(setSnackBar('Er is iets fout gegaan.'));
          });
      } else {
        dispatch(setSnackBar('U moet ingelogd zijn voor deze optie.'));
      }
    } else {
      dispatch(setSnackBar('Al geïnstalleerde notificatie.'));
    }
  };
}

// -------------------------------------------------- //

export function deleteNotifications(items) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      for (let i = 0; i < items.length; i++) {
        axios
          .delete(`subscription/remove/`, {
            headers: { Authorization: `Token ${user.token}` },
            data: {
              item: items[i],
              user: user.userID,
            },
          })
          .then(response => {
            dispatch(loadNotifications());
          })
          .catch(error => {
            dispatch(setSnackBar('Er is iets fout gegaan.'));
          });
      }
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function setNotificationStatus(item_id, status) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .post(
          `subscription/change/`,
          {
            user: user.userID,
            item: item_id,
            enable: status,
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(response => {
          dispatch(loadNotifications());
          dispatch(setSnackBar(`Notificatie ${status ? 'geactiveerd' : 'gedeactiveerd'}`));
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan.'));
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie'));
    }
  };
}

// -------------------------------------------------- //

export function uploadFile(
  file,
  folder_id,
  pagez = 1,
  order = 'name',
  queries = null,
  page_sizez = 10,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      dispatch(uploadFileRequest());
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dossier_id', folder_id);

      if (parseInt(file.size, 10) > 10000000) {
        dispatch(setSnackBar('Bestand te groot, kies een ander bestand'));
      } else {
        axios
          .post(`dossier/upload-file/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Token ${user.token}`,
            },
          })
          .then(response => {
            dispatch(setSnackBar(response.data.response));
            dispatch(loadDossierContents(folder_id, pagez, order, queries, page_sizez));
            dispatch(uploadFileSuccess());
          })
          .catch(error => {
            dispatch(setSnackBar('Er is iets fout gegaan...'));
          });
      }
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie.'));
    }
  };
}

export function uploadFileSuccess() {
  return { type: types.UPLOAD_FILE_SUCCESS };
}

export function uploadFileRequest() {
  return { type: types.UPLOAD_FILE_REQUEST };
}

export function deleteFile(
  file_id,
  folder_id,
  pagez = 1,
  order = 'name',
  queries = null,
  page_sizez = 10,
) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .delete('dossier/delete-file/', {
          headers: { Authorization: `Token ${user.token}` },
          data: {
            file_id: parseInt(file_id, 10),
            dossier_id: folder_id,
          },
        })
        .then(() => {
          dispatch(loadDossierContents(folder_id, pagez, order, queries, page_sizez));
        })
        .catch(error => {
          const status = error.message.substr(error.message.length - 3);
          if (parseInt(status, 10) === 404) {
            dispatch(setSnackBar('Dossier niet gevonden'));
          } else {
            dispatch(setSnackBar('Er is iets fout gegaan...'));
          }
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie.'));
    }
  };
}

export function getAllUsers(page = 1, sort_by = 'first_name') {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn() && user.is_admin) {
      axios
        .get(`accounts/users/?exclude_me=True&page=${page}&sort=${sort_by}`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          dispatch(getAllUsersSuccess(response.data.results, response.data.count));
        })
        .catch(error => {});
    } else {
      dispatch(setSnackBar('U hebt geen beheerdersrechten'));
    }
  };
}

export function getAllUsersSuccess(users, count) {
  return { type: types.GET_ALL_USERS_SUCCESS, users, count };
}
