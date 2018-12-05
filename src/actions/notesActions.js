import axios from 'axios';
import * as types from './actionTypes';
import moment from 'moment';
import { isLoggedIn } from '../helpers';
import { setSnackBar, generalRequest, generalRequestFailed } from './generalActions';

// -------------------------------------------------- //

export function createNote(doc_id, doc_type, doc, title, desc) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .post(
          'note/add',
          {
            document_id: parseInt(doc_id, 10),
            title,
            description: desc,
            doc_title: doc.name,
            type: parseInt(doc_type, 10),
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(() => {
          dispatch(loadMyNotes());
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan'));
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie.'));
    }
  };
}

export function editNote(note_id, title, desc) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      axios
        .post(
          'note/edit',
          {
            note_id: parseInt(note_id, 10),
            title,
            description: desc,
          },
          { headers: { Authorization: `Token ${user.token}` } },
        )
        .then(() => {
          dispatch(loadMyNotes());
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan'));
        });
    } else {
      dispatch(setSnackBar('U moet ingelogd zijn voor deze optie.'));
    }
  };
}

// -------------------------------------------------- //

export function removeNote(id) {
  return function(dispatch, getState) {
    if (isLoggedIn()) {
      generalRequest();
      axios
        .delete(`note/remove/`, {
          data: {
            note_id: id,
          },
        })
        .then(response => {
          dispatch(loadMyNotes());
          dispatch(setSnackBar('Opmerking verwijderd'));
        })
        .catch(error => {
          generalRequestFailed();
        });
    }
  };
}

// -------------------------------------------------- //

export function loadMyNotes(page = 1, page_size = 300) {
  return function(dispatch, getState) {
    const { user } = getState();
    if (isLoggedIn()) {
      generalRequest();
      axios
        .get(`note/my_list/?page_size=${page_size}&page=${page}`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then(response => {
          let notes = response.data.results;
          notes = notes.map(note => {
            return {
              id: note.id,
              doc_id: note.document_id,
              created_at: moment(note.created_at.substring(note.created_at.indexOf(' '))).format(
                'DD-MM-YYYY',
              ),
              last_modified: moment(
                note.last_modified.substring(note.last_modified.indexOf(' ')),
              ).format('DD-MM-YYYY'),
              title: {
                title: note.title,
                link: '#',
              },
              description: note.description,
              type: note.type,
              doc_title: note.doc_title,
            };
          });
          dispatch(loadMyNotesSuccess(notes));
        })
        .catch(error => {
          dispatch(setSnackBar('Er is iets fout gegaan'));
          generalRequestFailed();
        });
    }
  };
}

export function loadMyNotesSuccess(notes) {
  return { type: types.LOAD_MY_NOTES_SUCCESS, notes };
}

export function getNote(id) {
  return function(dispatch, getState) {
    if (isLoggedIn()) {
      generalRequest();
      axios
        .get(`note/${id}`)
        .then(response => {
          return response;
        })
        .catch(error => {
          dispatch(setSnackBar('Opmerking niet gevonden'));
          generalRequestFailed();
        });
    }
  };
}

// -------------------------------------------------- //
