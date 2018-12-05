import axios from 'axios';
import _ from 'lodash';
import appResources from './appResources';
import {
  EVENT,
  CHILD_EVENT,
  DOCUMENT,
  MEDIA,
  RECEIVED_DOCUMENT,
  COUNCIL_ADDRESS,
  WRITTEN_QUESTION,
  FORMAT,
  MANAGEMENT_DOCUMENT,
  POLICY_DOCUMENT,
  MOTION,
  COMMITMENT,
  FORMATED_EVENT,
  FORMATED_DOCUMENT,
  FORMATED_RECEIVED_DOC,
  FORMATED_COUNCIL_ADDRESS,
  FORMATED_WRITTEN_QUESTION,
  FORMATED_FORMAT,
  FORMATED_MANAGEMENT_DOCUMENT,
  FORMATED_POLICY_DOCUMENT,
  FORMATED_MOTION,
  FORMATED_COMMITMENT,
  FORMATED_CHILD_EVENT,
  PUBLIC_DOSSIER,
} from './constants';
import * as Colors from '@material-ui/core/colors';

const FileSaver = require('file-saver');
const _moment = require('moment');

const _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getToken() {
  try {
    return JSON.parse(JSON.parse(sessionStorage.getItem('persist:roota')).user).token;
  } catch (error) {
    return '';
  }
}

export function isLoggedIn() {
  const token = getToken();
  if (token === undefined || token === null || token === '') {
    return false;
  }
  axios.defaults.baseURL = appResources.backendUrl;
  return true;
}

export function datetify(datetimeObj) {
  //convert datetime object to nice formatted datestring
  const MM = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ];
  const dt = datetimeObj.replace(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}/,
    ($0, $1, $2, $3, $4, $5) => {
      return `${$3} ${MM[$2 - 1]}, ${$1}`;
    },
  );
  return dt.split('.')[0];
}

export function getHorizontalTimelineItemStyle(type) {
  switch (type) {
    case EVENT:
      return `border-radius: 15px;background-color: ${
        appResources.timelineEventColor
      };border-color: ${appResources.timelineEventColor};cursor: pointer;color: ${
        appResources.darkGreyTextColor
      };`;
    case DOCUMENT:
      return `border-radius: 15px;background-color: ${
        appResources.timelineDocumentColor
      };border-color: ${appResources.timelineDocumentColor};cursor: pointer;color: ${
        appResources.darkGreyTextColor
      };`;
    case MEDIA:
      return `border-radius: 15px;background-color: ${Colors.teal200};border-color: ${
        Colors.teal200
      };cursor: pointer;color: ${appResources.darkGreyTextColor};`;
    case RECEIVED_DOCUMENT:
      return `border-radius: 15px;background-color: ${
        appResources.received_document
      };border-color: ${appResources.received_document};cursor: pointer;color: ${
        appResources.darkGreyTextColor
      };`;
    case COUNCIL_ADDRESS:
      return `border-radius: 15px;background-color: ${appResources.council_address};border-color: ${
        appResources.council_address
      };cursor: pointer;color: ${appResources.darkGreyTextColor};`;
    case WRITTEN_QUESTION:
      return `border-radius: 15px;background-color: ${
        appResources.written_question
      };border-color: ${appResources.written_question};cursor: pointer;color: ${
        appResources.darkGreyTextColor
      };`;
    case FORMAT:
      return `border-radius: 15px;background-color: ${appResources.format};border-color: ${
        appResources.format
      };cursor: pointer;color: ${appResources.darkGreyTextColor};`;
    case MANAGEMENT_DOCUMENT:
      return `border-radius: 15px;background-color: ${
        appResources.management_document
      };border-color: ${appResources.management_document};cursor: pointer;color: ${
        appResources.darkGreyTextColor
      };`;
    case POLICY_DOCUMENT:
      return `border-radius: 15px;background-color: ${appResources.policy_document};border-color: ${
        appResources.policy_document
      };cursor: pointer;color: ${appResources.darkGreyTextColor};`;
    case MOTION:
      return `border-radius: 15px;background-color: ${appResources.format};border-color: ${
        appResources.format
      };cursor: pointer;color: ${appResources.darkGreyTextColor};`;
    case COMMITMENT:
      return `border-radius: 15px;background-color: ${appResources.policy_document};border-color: ${
        appResources.policy_document
      };cursor: pointer;color: ${appResources.darkGreyTextColor};`;
    default:
      return `border-radius: 15px;background-color: ${
        appResources.timelineEventColor
      };border-color: ${appResources.timelineEventColor};cursor: pointer;color: ${
        appResources.darkGreyTextColor
      };`;
  }
}

export function getTimelineGroup(type) {
  switch (type) {
    case EVENT:
      return 1;
    case DOCUMENT:
      return 2;
    case RECEIVED_DOCUMENT:
      return 3;
    case COUNCIL_ADDRESS:
      return 4;
    case WRITTEN_QUESTION:
      return 5;
    case FORMAT:
      return 6;
    case MANAGEMENT_DOCUMENT:
      return 7;
    case POLICY_DOCUMENT:
      return 8;
    case MOTION:
      return 9;
    case COMMITMENT:
      return 10;
    default:
      return 1;
  }
}

function formatTime(date) {
  const formattedDate = _moment2.default.utc(date).format('YYYYMMDDTHHmmssZ');
  return formattedDate.replace('+00:00', 'Z');
}

function calculateDuration(startTime, endTime) {
  const end = _moment2.default.utc(endTime).format('DD/MM/YYYY HH:mm:ss');
  const start = _moment2.default.utc(startTime).format('DD/MM/YYYY HH:mm:ss');

  const difference = (0, _moment2.default)(end, 'DD/MM/YYYY HH:mm:ss').diff(
    (0, _moment2.default)(start, 'DD/MM/YYYY HH:mm:ss'),
  );

  const duration = _moment2.default.duration(difference);

  return Math.floor(duration.asHours()) + _moment2.default.utc(difference).format(':mm');
}

export function getFormattedType(type) {
  switch (type) {
    case EVENT:
      return 'Event';
    case DOCUMENT:
      return 'Documenten';
    case RECEIVED_DOCUMENT:
      return 'P&C Cyclus';
    case COUNCIL_ADDRESS:
      return 'Brief aan de raad';
    case WRITTEN_QUESTION:
      return 'Schriftelijke vragen';
    case FORMAT:
      return 'Formats';
    case MANAGEMENT_DOCUMENT:
      return 'Raadsbrieven';
    case POLICY_DOCUMENT:
      return 'Presidium besluitenlijsten';
    case MOTION:
      return 'Motie';
    case COMMITMENT:
      return 'Toezeggingen';
    case CHILD_EVENT:
      return 'Vergaderzaal';
    case PUBLIC_DOSSIER:
      return 'Public dossier';
    default:
      return '';
  }
}

export function downloadEvent(event, calendar) {
  let calendarUrl = '';

  switch (calendar) {
    case 'Google':
      calendarUrl = 'https://calendar.google.com/calendar/render';
      calendarUrl += '?action=TEMPLATE';
      calendarUrl += `&dates=${formatTime(event.startTime)}`;
      calendarUrl += `/${formatTime(event.endTime)}`;
      calendarUrl += `&location=${encodeURIComponent(event.location)}`;
      calendarUrl += `&text=${encodeURIComponent(event.title)}`;
      calendarUrl += `&details=${encodeURIComponent(event.description)}`;
      window.open(calendarUrl);
      break;
    case 'Yahoo':
      var duration = calculateDuration(event.startTime, event.endTime);
      calendarUrl = 'https://calendar.yahoo.com/?v=60&view=d&type=20';
      calendarUrl += `&title=${event.title}`;
      calendarUrl += `&st=${formatTime(event.startTime)}`;
      calendarUrl += `&dur=${duration}`;
      calendarUrl += `&desc=${event.description}`;
      calendarUrl += `&in_loc=${encodeURIComponent(event.location)}`;
      window.open(calendarUrl);
      break;
    default:
      calendarUrl = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `URL:${document.URL}`,
        `DTSTART:${formatTime(event.startTime)}`,
        `DTEND:${formatTime(event.endTime)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\n');
      var blob = new Blob([calendarUrl], { type: 'text/calendar;charset=utf-8' });
      FileSaver.saveAs(blob, `${event.title}.ics`);
      break;
  }
}

function copyToClipboard(value) {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.style.position = 'absolute';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful)
      console.info(`Oops, something went wrong. Hereby the link you want to copy - ${value}`);
  } catch (err) {
    console.info(`Oops, something went wrong. Hereby the link you want to copy - ${value}`);
  }

  document.body.removeChild(textArea);
}

export function share(item_type, item_url, item_name, type) {
  const url = window.location.hostname + item_url;

  switch (type) {
    case 'Email':
      const body = `Hoi!%0D%0A%0D%0AIk kwam dit ( ${url} ) tegen op de Raadsinformatie Portaal ${
        appResources.municipality
      } en wilde dit graag met je delen.%0D%0A%0D%0AHartelijke groet,%0D%0A`;
      window.open(
        `mailto:?subject=RIS ${appResources.municipality}: ${item_name}&body=${body}`,
        '_self',
      );
      break;
    case 'Link':
      const action = window.prompt('Klik op OK om te kopiëren', url);
      if (action) {
        copyToClipboard(url);
      }
      break;
    default:
  }
}

export function getUserDossiers() {
  axios.defaults.baseURL = appResources.backendUrl;
  // axios.defaults.headers.common['Authorization'] = 'Token ' + sessionStorage.getItem('token')
  axios
    .get(`/dossier/list/`)
    .then(response => {
      return response.data.results;
    })
    .catch(error => {
      return error;
    });
}

export function getCounts() {
  axios
    .get(`accounts/user_items/`, {
      headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
    })
    .then(response => {
      sessionStorage.setItem('notifications_count', response.data[0].notifications_count);
      sessionStorage.setItem('dossiers_count', response.data[0].dossiers_count);
      sessionStorage.setItem('queries_count', response.data[0].queries_count);
      sessionStorage.setItem('favorites_count', response.data[0].favorites_count);
    })
    .catch(error => {
      const status = error.message.substr(error.message.length - 3);
      if (parseInt(status, 10) === 401) {
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('notifications_count');
        sessionStorage.removeItem('dossiers_count');
        sessionStorage.removeItem('queries_count');
        sessionStorage.removeItem('favorites_count');
        axios.defaults.headers.common.Authorization = '';
      }
    });
}

export function getAvatarColor(type) {
  switch (type.toLowerCase()) {
    case EVENT:
      return appResources.eventColor;
    case CHILD_EVENT:
      return appResources.eventColor;
    case RECEIVED_DOCUMENT:
      return appResources.received_document;
    case COUNCIL_ADDRESS:
      return appResources.council_address;
    case WRITTEN_QUESTION:
      return appResources.written_question;
    case FORMAT:
      return appResources.format;
    case MANAGEMENT_DOCUMENT:
      return appResources.management_document;
    case POLICY_DOCUMENT:
      return appResources.policy_document;
    case DOCUMENT:
      return appResources.documentColor;
    default:
      return appResources.documentColor;
  }
}

export function getItemDetailUrl(type, item_id, parent_id = 0) {
  switch (type) {
    case EVENT:
      return `/evenement/${item_id}`;
    case CHILD_EVENT:
      return `/evenement/${parent_id}/?zaal=${item_id}`;
    case DOCUMENT:
      return `/document/0/${item_id}`;
    case RECEIVED_DOCUMENT:
      return `/document/1/${item_id}`;
    case COUNCIL_ADDRESS:
      return `/document/2/${item_id}`;
    case WRITTEN_QUESTION:
      return `/document/3/${item_id}`;
    case FORMAT:
      return `/document/4/${item_id}`;
    case MANAGEMENT_DOCUMENT:
      return `/document/6/${item_id}`;
    case POLICY_DOCUMENT:
      return `/document/5/${item_id}`;
    case MOTION:
      return `/document/7/${item_id}`;
    case COMMITMENT:
      return `/document/8/${item_id}`;
    case FORMATED_EVENT:
      return `/evenement/${item_id}`;
    case FORMATED_DOCUMENT:
      return `/document/0/${item_id}`;
    case FORMATED_RECEIVED_DOC:
      return `/document/1/${item_id}`;
    case FORMATED_COUNCIL_ADDRESS:
      return `/document/2/${item_id}`;
    case FORMATED_WRITTEN_QUESTION:
      return `/document/3/${item_id}`;
    case FORMATED_FORMAT:
      return `/document/4/${item_id}`;
    case FORMATED_MANAGEMENT_DOCUMENT:
      return `/document/6/${item_id}`;
    case FORMATED_POLICY_DOCUMENT:
      return `/document/5/${item_id}`;
    case FORMATED_MOTION:
      return `/document/7/${item_id}`;
    case FORMATED_COMMITMENT:
      return `/document/8/${item_id}`;
    case FORMATED_CHILD_EVENT:
      return `/evenement/${parent_id}/?zaal=${item_id}`;
    case PUBLIC_DOSSIER:
      return `/publieke-dossiers/${item_id}`;
    default:
      return `#`;
  }
}

export function getItemCounts() {
  axios
    .get(`item_counts/`)
    .then(response => {
      sessionStorage.setItem('total_count', response.data[0].total_count);
      sessionStorage.setItem('events_count', response.data[0].events_count);
      sessionStorage.setItem('documents_count', response.data[0].documents_count);
      sessionStorage.setItem('received_documents_count', response.data[0].received_documents_count);
      sessionStorage.setItem('council_adress_count', response.data[0].council_adress_count);
      sessionStorage.setItem('written_questions_count', response.data[0].written_questions_count);
      sessionStorage.setItem('public_documents_count', response.data[0].public_documents_count);
      sessionStorage.setItem(
        'management_documents_count',
        response.data[0].management_documents_count,
      );
      sessionStorage.setItem('policy_documents_count', response.data[0].policy_documents_count);
    })
    .catch(error => {
      const status = error.message.substr(error.message.length - 3);
      if (parseInt(status, 10) === 401) {
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('notifications_count');
        sessionStorage.removeItem('dossiers_count');
        sessionStorage.removeItem('queries_count');
        sessionStorage.removeItem('favorites_count');
        axios.defaults.headers.common.Authorization = '';
      }
    });
}

export function getUserInfo() {
  axios
    .get(`accounts/user/`, {
      headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
    })
    .then(response => {
      sessionStorage.setItem('user_id', response.data.pk);
      sessionStorage.setItem('name', response.data.first_name);
      sessionStorage.setItem('user_name', response.data.username);
      sessionStorage.setItem('email', response.data.email);
      sessionStorage.setItem('last_name', response.data.last_name);
    })
    .catch(error => {});
}

export function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[[\]]/g, '\\$&');
  let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function removeParamByName(key, sourceURL = window.location.href) {
  let rtn = sourceURL.split('?')[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';
  if (queryString !== '') {
    params_arr = queryString.split('&');
    for (let i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = `${rtn}?${params_arr.join('&')}`;
  }
  return rtn;
}

export function generateID() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 35; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

export function genericSortBy(value, data) {
  let dat;
  switch (value) {
    case 'title':
      dat = _.sortBy(data, o => {
        try {
          return o.title.toLowerCase();
        } catch (e) {
          return o.title.title.toLowerCase();
        }
      });
      break;
    case '-title':
      dat = _.sortBy(data, o => {
        try {
          return o.title.toLowerCase();
        } catch (e) {
          return o.title.title.toLowerCase();
        }
      }).reverse();
      break;
    case 'date':
      dat = _.sortBy(data, o => {
        return o.created_at;
      });
      break;
    case '-date':
      dat = _.sortBy(data, o => {
        return o.created_at;
      }).reverse();
      break;
    case 'last_modified':
      dat = _.sortBy(data, o => {
        return o.last_modified;
      });
      break;
    case '-last_modified':
      dat = _.sortBy(data, o => {
        return o.last_modified;
      }).reverse();
      break;
    default:
      return data;
  }
  return dat;
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function getVisitCookie() {
  return getCookie('openedMenu') === '';
}

export function checkIfUserIsDossierOwnerOrShared(user_id, dossier_owner_id, shared_users) {
  const shared_users_ids = shared_users.map(user => {
    return user.id;
  });
  if (user_id === dossier_owner_id || shared_users_ids.indexOf(user_id) > -1) {
    return true;
  }
  return false;
}

export function getRoomEndTime(agendas) {
  let result = '';
  for (let i = 0; agendas.length > i; i++) {
    if (agendas[i].end_time !== null) {
      result = agendas[i].end_time.substr(0, 5);
    }
  }
  return result;
}

export function isArrayEqual(x, y) {
  return _(x)
    .xorWith(y, _.isEqual)
    .isEmpty();
}
