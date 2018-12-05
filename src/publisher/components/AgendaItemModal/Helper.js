import axios from 'axios';
import moment from 'moment';
import find from 'lodash/find';
import filter from 'lodash/filter';
import appResources from '../../../appResources';
import { getParameterByName } from '../../../helpers';

export function timeValidation(that) {
  const parentEventStart = moment(that.state.event.start_time);
  const parentEventEnd = that.state.event.end_time
    ? moment(that.state.event.end_time)
    : that.state.event.end_time;
  const x = `${parentEventStart.format('YYYY-MM-DD')} ${that.state.startTime}`;
  const y = `${parentEventStart.format('YYYY-MM-DD')} ${that.state.endTime}`;

  if (moment(x).isSameOrAfter(moment(y))) {
    that.setState({
      timeError: true,
      timeErrorText: 'Starttijd moet vóór eindtijd zijn',
    });
  } else if (
    !moment(parentEventStart).isSameOrBefore(moment(x)) ||
    !moment(parentEventStart).isBefore(moment(y)) ||
    (parentEventEnd &&
      (moment(parentEventEnd).isBefore(moment(x)) || moment(parentEventEnd).isBefore(moment(y))))
  ) {
    that.setState({
      timeError: true,
      timeErrorText: 'Agendapunt tijden mogen de tijden van het Evenement niet overlappen',
    });
  } else {
    that.setState({
      timeError: false,
      timeErrorText: '',
    });
  }
}

export function getEventDetails(that) {
  const roomParam = getParameterByName('zaal');
  const eventID = that.props.params.eventId;
  let requests = [];
  if (!roomParam) {
    if (that.props.selectedEventID) {
      requests = [
        axios.get(`${appResources.backendUrl}events/${that.props.selectedEventID}/?basicData=True`),
      ];
      if (!that.state.editMode) {
        requests.push(axios.get(`${appResources.backendUrl}get-next-agenda-item-id/`));
      }
    } else {
      requests = [axios.get(`${appResources.backendUrl}events/${eventID}/?basicData=True`)];
      if (!that.state.editMode) {
        requests.push(axios.get(`${appResources.backendUrl}get-next-agenda-item-id/`));
      }
    }
  } else {
    requests = [axios.get(`${appResources.backendUrl}events/${roomParam}/?basicData=True`)];
    if (!that.state.editMode) {
      requests.push(axios.get(`${appResources.backendUrl}get-next-agenda-item-id/`));
    }
  }
  axios
    .all(requests)
    .then(response => {
      that.setState({
        event: response[0].data,
        nextAgendaID: that.state.editMode
          ? that.props.selectedAgendaItemID
          : response[1].data.value,
      });
    })
    .catch(e => {});
}

export function getAgendaItemDetails(that) {
  const roomID = getParameterByName('zaal');
  let agendaItem = {};
  if (appResources.municipality === 'Utrecht' && roomID === that.props.params.eventId) {
    agendaItem = find(that.props.singleEvent.eventData.agenda, a => {
      return a.id === that.props.selectedAgendaItemID;
    });
  } else {
    if (roomID && that.props.singleEvent.childEventsData.length > 0) {
      const room = find(that.props.singleEvent.childEventsData, c => {
        return c.id === parseInt(roomID, 10);
      });
      agendaItem = find(room.agenda, a => {
        return a.id === that.props.selectedAgendaItemID;
      });
    } else if (that.props.selectedRoomID && that.props.singleEvent.childEventsData.length > 0) {
      const room = find(that.props.singleEvent.childEventsData, c => {
        return c.id === parseInt(that.props.selectedRoomID, 10);
      });
      agendaItem = find(room.agenda, a => {
        return a.id === that.props.selectedAgendaItemID;
      });
    } else {
      agendaItem = find(that.props.singleEvent.eventData.agenda, a => {
        return a.id === that.props.selectedAgendaItemID;
      });
    }
  }
  that.setState({
    editMode: true,
    title: agendaItem.notes,
    description: agendaItem.description,
    order: that.props.selectedIndex,
    startTime: agendaItem.start_time ? agendaItem.start_time.substr(0, 5) : that.state.startTime,
    endTime: agendaItem.end_time
      ? agendaItem.end_time.substr(0, 5)
      : agendaItem.start_time
        ? agendaItem.start_time.substr(0, 5)
        : that.state.endTime,
    showStartTime: !!agendaItem.start_time,
    showEndTime: !!agendaItem.end_time,
    toEditAgendaItem: agendaItem,
    toEditAgendaItemItems: getAgendaItemDocDossiers(agendaItem.media),
    selectedGriffier: agendaItem.griffier
      ? {
          id: agendaItem.griffier.id,
          name: `${agendaItem.griffier.first_name} ${agendaItem.griffier.last_name}`,
        }
      : null,
    selectedMedewerker: agendaItem.medewerker
      ? {
          id: agendaItem.medewerker.id,
          name: `${agendaItem.medewerker.first_name} ${agendaItem.medewerker.last_name}`,
        }
      : null,
  });
}

function getAgendaItemDocDossiers(mediaArr) {
  const documents = [];
  const dossiers = [];
  for (let i = 0; i < mediaArr.length; i++) {
    if (mediaArr[i].link_item_type !== 'public_dossier') {
      documents.push({
        id: mediaArr[i].id,
        combined_id: mediaArr[i].links[0].combined_id,
        item_id: mediaArr[i].links[0].item_id,
        name: mediaArr[i].note,
      });
    } else {
      dossiers.push({
        id: mediaArr[i].id,
        combined_id: mediaArr[i].links[0].combined_id,
        item_id: mediaArr[i].links[0].item_id,
        name: mediaArr[i].note,
      });
    }
  }
  return {
    documents,
    dossiers,
  };
}

export function getExistingAgendaItem(id, that) {
  axios
    .get(`${appResources.backendUrl}agenda_items/${id}/`)
    .then(response => {
      const docs = filter(response.data.media, m => {
        return m.link_item_type !== 'public_dossier';
      }).map(d => {
        return {
          id: d.links[0].combined_id,
          name: d.links[0].text,
          type: d.link_item_type,
        };
      });
      const dossiers = filter(response.data.media, m => {
        return m.link_item_type === 'public_dossier';
      }).map(d => {
        return {
          id: d.links[0].item_id,
          name: d.links[0].text,
          type: 'public_dossier',
        };
      });
      that.props.setAgendaItemSelectedDocuments(docs);
      that.props.setAgendaItemSelectedDossiers(dossiers);
      that.setState({
        name: response.data.notes,
        description: response.data.description,
        loadingExistingAgendaItem: false,
        selectedGriffier: response.data.griffier
          ? {
              id: response.data.griffier.id,
              name: `${response.data.griffier.first_name} ${response.data.griffier.last_name}`,
            }
          : null,
        selectedMedewerker: response.data.medewerker
          ? {
              id: response.data.medewerker.id,
              name: `${response.data.medewerker.first_name} ${response.data.medewerker.last_name}`,
            }
          : null,
        order: response.data.order,
      });
    })
    .catch(error => {});
}
