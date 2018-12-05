import invert from 'lodash/invert';

export const EVENT = 'event';
export const CHILD_EVENT = 'child_event';
export const DOCUMENT = 'document';
export const PUBLIC_DOSSIER = 'public_dossier';
export const MEDIA = 'media';
export const RECEIVED_DOCUMENT = 'received_document';
export const COUNCIL_ADDRESS = 'council_address';
export const WRITTEN_QUESTION = 'written_question';
export const FORMAT = 'format';
export const MANAGEMENT_DOCUMENT = 'management_document';
export const POLICY_DOCUMENT = 'policy_document';
export const MOTION = 'motion';
export const COMMITMENT = 'commitment';
export const UPLOADED_FILE = 'Geupload document';

export const FORMATED_EVENT = 'Event';
export const FORMATED_DOCUMENT = 'Documenten';
export const FORMATED_RECEIVED_DOC = 'P&C Cyclus';
export const FORMATED_RECEIVED_DOCUMENT = 'P&C Cyclus';
export const FORMATED_COUNCIL_ADDRESS = 'Brief aan de raad';
export const FORMATED_WRITTEN_QUESTION = 'Schriftelijke vragen';
export const FORMATED_FORMAT = 'Formats';
export const FORMATED_MANAGEMENT_DOCUMENT = 'Raadsbrieven';
export const FORMATED_POLICY_DOCUMENT = 'Presidium besluitenlijsten';
export const FORMATED_MOTION = 'Motie';
export const FORMATED_COMMITMENT = 'Toezeggingen';
export const FORMATED_CHILD_EVENT = 'Vergaderzaal';
export const FORMATED_PUBLIC_DOSSIER = 'Public dossier';

export const EVENT_NL = 'evenement';
export const DOCUMENT_NL = 'documenten';
export const PUBLIC_DOSSIER_NL = 'publieke_dossier';
export const RECEIVED_DOCUMENT_NL = 'pc_cyclus';
export const COUNCIL_ADDRESS_NL = 'brief_aan_de_raad';
export const WRITTEN_QUESTION_NL = 'schriftelijke_vragen';
export const FORMAT_NL = 'formats';
export const MANAGEMENT_DOCUMENT_NL = 'raadsbrieven';
export const POLICY_DOCUMENT_NL = 'presidium_besluitenlijsten';
export const MOTION_NL = 'motie';
export const COMMITMENT_NL = 'toezeggingen';

export const MAKE_FOLDER = 'MAKE_FOLDER';
export const MAKE_NOTE = 'MAKE_NOTE';
export const MAKE_QUERY = 'MAKE_QUERY';
export const DELETE_FOLDER = 'DELETE_FOLDER';
export const ADD_MY_AGENDA = 'ADD_MY_AGENDA';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const ADD_FAVORITE = 'ADD_FAVORITE';

export const pageActions = {
  '/': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/zoeken': [
    { type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' },
    { type: MAKE_QUERY, name: 'Bewaar huidige zoekopdracht' },
  ],
  '/document': [
    { type: MAKE_NOTE, name: 'Notitie toevoegen aan dit document' },
    { type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' },
    { type: SET_NOTIFICATION, name: 'Voeg notificatie toe' },
    { type: ADD_FAVORITE, name: 'Voeg toe aan favorieten' },
  ],
  '/over-de-raad': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/agenda': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/mijn_kalender': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/notificaties': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/mijn_notities': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/bewaarde_zoekopdrachten': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/favorieten': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/folders': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/folder': [
    { type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' },
    { type: DELETE_FOLDER, name: 'Verwijderen deze folder' },
  ],
  '/profiel': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/login': [{ type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' }],
  '/evenement': [
    { type: ADD_MY_AGENDA, name: 'Voeg aan mijn agenda toe' },
    { type: MAKE_FOLDER, name: 'Een persoonlijke folder toevoegen' },
    { type: SET_NOTIFICATION, name: 'Voeg notificatie toe' },
    { type: ADD_FAVORITE, name: 'Voeg toe aan favorieten' },
  ],
};

export const CREATE_PUBLIC_DOSSIER = 'CREATE_PUBLIC_DOSSIER';
export const CREATE_NEW_EVENT = 'CREATE_NEW_EVENT';
export const CREATE_NEW_AGENDA_ITEM = 'CREATE_NEW_AGENDA_ITEM';
export const ADD_NEW_ROOM_TO_EVENT = 'ADD_NEW_ROOM_TO_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const ADD_USER = 'ADD_USER';
export const CREATE_NEW_DOCUMENT = 'CREATE_NEW_DOCUMENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const EDIT_PUBLIC_DOSSIER = 'EDIT_PUBLIC_DOSSIER';
export const DELETE_PUBLIC_DOSSIER = 'DELETE_PUBLIC_DOSSIER';

export const publisherActions = {
  '/': [
    { type: CREATE_NEW_DOCUMENT, name: 'Raadsdocument uploaden' },
    { type: CREATE_PUBLIC_DOSSIER, name: 'Dossier toevoegen' },
    { type: CREATE_NEW_EVENT, name: 'Nieuw evenement toevoegen' },
  ],
  '/evenement': [{ type: CREATE_NEW_AGENDA_ITEM, name: 'Nieuw agendapunt toevoegen' }],
  '/parent-event': [
    { type: CREATE_NEW_AGENDA_ITEM, name: 'Nieuw agendapunt toevoegen' },
    { type: EDIT_EVENT, name: 'Bewerk Evenement' },
    { type: DELETE_EVENT, name: 'Evenement verwijderen' },
  ],
  '/event-with-rooms': [
    // { type: ADD_NEW_ROOM_TO_EVENT, name: 'Voeg zaals toe' },
    { type: EDIT_EVENT, name: 'Bewerk Evenement' },
    { type: DELETE_EVENT, name: 'Evenement verwijderen' },
  ],
  '/public-dossier': [
    { type: EDIT_PUBLIC_DOSSIER, name: 'Bewerk dossier' },
    { type: DELETE_PUBLIC_DOSSIER, name: 'Verwijder dossier' },
  ],
  admin: [{ type: ADD_USER, name: 'Nieuwe gebruiker toevoegen' }],
};

const urlConstants = {
  EVENT,
  DOCUMENT,
  PUBLIC_DOSSIER,
  RECEIVED_DOCUMENT,
  COUNCIL_ADDRESS,
  WRITTEN_QUESTION,
  FORMAT,
  MANAGEMENT_DOCUMENT,
  POLICY_DOCUMENT,
  MOTION,
  COMMITMENT,
  EVENT_NL,
  DOCUMENT_NL,
  PUBLIC_DOSSIER_NL,
  RECEIVED_DOCUMENT_NL,
  COUNCIL_ADDRESS_NL,
  WRITTEN_QUESTION_NL,
  FORMAT_NL,
  MANAGEMENT_DOCUMENT_NL,
  POLICY_DOCUMENT_NL,
  MOTION_NL,
  COMMITMENT_NL,
  FORMATED_EVENT: 'Agenda punten',
  FORMATED_DOCUMENT,
  FORMATED_RECEIVED_DOC,
  FORMATED_RECEIVED_DOCUMENT,
  FORMATED_COUNCIL_ADDRESS,
  FORMATED_WRITTEN_QUESTION,
  FORMATED_FORMAT,
  FORMATED_MANAGEMENT_DOCUMENT,
  FORMATED_POLICY_DOCUMENT,
  FORMATED_MOTION,
  FORMATED_COMMITMENT,
  FORMATED_PUBLIC_DOSSIER,
};

export function getNLItemName(key) {
  return urlConstants[`${invert(urlConstants)[key]}_NL`];
}

export function getNLFormattedItemName(key) {
  return urlConstants[`FORMATED_${invert(urlConstants)[key].slice(0, -3)}`];
}

export function getGBItemName(key) {
  return urlConstants[`${invert(urlConstants)[key].slice(0, -3)}`];
}
