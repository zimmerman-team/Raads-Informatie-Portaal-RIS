import axios from 'axios';
import moment from 'moment';
import appResources from '../../../appResources';
import { getParameterByName } from '../../../helpers';

export function timeValidation(that) {
  const x = `${moment(that.state.event.start_time).format('YYYY-MM-DD')} ${that.state.startTime}`;
  const y = `${moment(that.state.event.start_time).format('YYYY-MM-DD')} ${that.state.endTime}`;
  if (!moment(x).isBefore(moment(y))) {
    that.setState({
      timeError: true,
    });
  } else {
    that.setState({
      timeError: false,
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
        axios.get(`${appResources.backendUrl}events/${that.props.selectedEventID}`),
        axios.get(`${appResources.backendUrl}get-next-agenda-item-id/`),
      ];
    } else {
      requests = [
        axios.get(`${appResources.backendUrl}events/${eventID}`),
        axios.get(`${appResources.backendUrl}get-next-agenda-item-id/`),
      ];
    }
  } else {
    requests = [
      axios.get(`${appResources.backendUrl}events/${roomParam}`),
      axios.get(`${appResources.backendUrl}get-next-agenda-item-id/`),
    ];
  }
  axios
    .all(requests)
    .then(response => {
      that.setState({
        event: response[0].data,
        nextAgendaID: response[1].data.value,
      });
    })
    .catch(e => {});
}
