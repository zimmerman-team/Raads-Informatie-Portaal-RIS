import axios from 'axios';
import moment from 'moment';
import find from 'lodash/find';
import filter from 'lodash/filter';
import mock from '../TextField/TextField.mock';
import appResources from '../../../appResources';

export function checkDateTimeAvailability(that) {
  const startTime = `${moment(that.state.date).format('YYYY-MM-DD')} ${that.state.start_time}`;
  const endTime = `${moment(that.state.date).format('YYYY-MM-DD')} ${that.state.end_time}`;
  axios
    .post(
      `${appResources.backendUrl}check-time-room-allocated/`,
      {
        event_id: that.props.toEditEventID,
        room: that.state.location,
        start_time: startTime,
        end_time: that.state.endTimeDisabled ? null : endTime,
      },
      { headers: { Authorization: `Token ${that.props.token}` } },
    )
    .then(response => {
      that.setState({
        dateIsAvailable: !response.data.allocated,
        showTimeError:
          moment(moment(startTime)).isSameOrAfter(moment(endTime)) && !that.state.endTimeDisabled,
      });
    })
    .catch(e => {
      that.setState({ dateIsAvailable: false });
    });
}

export function getNextPolitiekeMarktNumber(that) {
  axios
    .get(`${appResources.backendUrl}get-next-politieke-markt-number/`)
    .then(response => {
      that.setState({
        politiekeMarktNumber: response.data.value,
      });
    })
    .catch(e => {});
}

export function validRoomTimes(that, date, rooms) {
  const event_start_time = moment(`${moment(date).format('YYYY-MM-DD')} ${that.state.start_time}`);
  const event_end_time = moment(`${moment(date).format('YYYY-MM-DD')} ${that.state.end_time}`);
  let check1,
    check2 = false;
  let start_time,
    end_time = null;
  for (let i = 0; i < rooms.length; i++) {
    start_time = moment(`${moment(date).format('YYYY-MM-DD')} ${rooms[i].start_time}`);
    if (rooms[i].end_time) {
      end_time = moment(`${moment(date).format('YYYY-MM-DD')} ${rooms[i].end_time}`);
      check1 = start_time.isBefore(end_time);
      check2 =
        event_start_time.isSameOrBefore(start_time) &&
        event_start_time.isBefore(end_time) &&
        (that.state.endTimeDisabled ||
          (event_end_time.isAfter(start_time) && event_end_time.isSameOrAfter(end_time)));
    } else {
      check1 = true;
      check2 =
        event_start_time.isSameOrBefore(start_time) &&
        (that.state.endTimeDisabled || event_end_time.isAfter(start_time));
    }
    checkRoomDateTimeAvailability(that, rooms[i], date, start_time, end_time, check1, check2);
  }
}

export function checkRoomDateTimeAvailability(
  that,
  room,
  date,
  start_time,
  end_time,
  check1,
  check2,
) {
  const savedRoom = find(that.state.initialRooms, r => {
    return r.title === room.title;
  });
  axios
    .post(
      `${appResources.backendUrl}check-time-room-allocated/`,
      { room: room.title, start_time, end_time, event_id: savedRoom ? savedRoom.originID : null },
      { headers: { Authorization: `Token ${that.props.token}` } },
    )
    .then(response => {
      that.setState({
        validRooms: !response.data.allocated && check1 && check2,
      });
    })
    .catch(e => {
      that.setState({
        validRooms: check1 && check2,
      });
    });
}

export function getEvent(id, that) {
  if (that.props.location.pathname.indexOf('/evenement') > -1) {
    const { childEventsData, eventData } = that.props;
    const savedRooms = [];
    for (let i = 0; i < childEventsData.length; i++) {
      const room = find(that.state.availableRooms, r => {
        return r.title === childEventsData[i].name;
      });
      if (room) {
        savedRooms.push({
          ...room,
          originID: childEventsData[i].id,
          start_time: childEventsData[i].start_time
            ? moment(childEventsData[i].start_time).format('HH:mm')
            : null,
          end_time: childEventsData[i].end_time
            ? moment(childEventsData[i].end_time).format('HH:mm')
            : null,
        });
      }
    }
    that.setState({
      editMode: true,
      loadingExistingEvent: false,
      selectedEvent: childEventsData.length > 0 ? mock.eventTemplates[1] : mock.eventTemplates[0],
      toEditEvent: {
        ...eventData,
        childEventsData,
      },
      title: eventData.name,
      date: moment(eventData.start_time).format('YYYY-MM-DD'),
      location: eventData.location,
      description: eventData.description,
      start_time: moment(eventData.start_time).format('HH:mm'),
      end_time: eventData.end_time
        ? moment(eventData.end_time).format('HH:mm')
        : moment(eventData.start_time)
            .add(1, 'minutes')
            .format('HH:mm'),
      initialRooms: [...savedRooms],
      savedRooms,
    });
  } else {
    axios
      .all([
        axios.get(`${appResources.backendUrl}events/${id}/`),
        axios.get(`${appResources.backendUrl}child_events/${id}/`),
      ])
      .then(response => {
        const eventData = response[0].data;
        const childEventsData = response[1].data.results;
        const savedRooms = [];
        for (let i = 0; i < childEventsData.length; i++) {
          const room = find(that.state.availableRooms, r => {
            return r.title === childEventsData[i].name;
          });
          if (room) {
            savedRooms.push({
              ...room,
              originID: childEventsData[i].id,
              start_time: childEventsData[i].start_time
                ? moment(childEventsData[i].start_time).format('HH:mm')
                : null,
              end_time: childEventsData[i].end_time
                ? moment(childEventsData[i].end_time).format('HH:mm')
                : null,
            });
          }
        }
        that.setState({
          editMode: true,
          loadingExistingEvent: false,
          selectedEvent:
            childEventsData.length > 0 ? mock.eventTemplates[1] : mock.eventTemplates[0],
          toEditEvent: {
            ...eventData,
            childEventsData,
          },
          title: eventData.name,
          date: moment(eventData.start_time).format('YYYY-MM-DD'),
          location: eventData.location,
          description: eventData.description,
          start_time: moment(eventData.start_time).format('HH:mm'),
          end_time: eventData.end_time
            ? moment(eventData.end_time).format('HH:mm')
            : moment(eventData.start_time)
                .add(1, 'minutes')
                .format('HH:mm'),
          initialRooms: savedRooms,
          savedRooms,
        });
      })
      .catch(e => {});
  }
}

export function getFormattedSavedRooms(savedRooms, initialRooms) {
  let rooms = [];
  if (savedRooms.length === 0) {
    for (let x = 0; x < initialRooms.length; x++) {
      rooms.push({
        ...initialRooms[x],
        action: 'delete',
      });
    }
  } else {
    for (let x = 0; x < savedRooms.length; x++) {
      let add = true;
      for (let y = 0; y < initialRooms.length; y++) {
        if (savedRooms[x].title === initialRooms[y].title) {
          rooms.push({
            ...savedRooms[x],
            action: 'edit',
            originID: initialRooms[y].originID,
          });
          initialRooms[y].status = 'edit';
          add = false;
        }
      }
      if (add) {
        rooms.push({
          ...savedRooms[x],
          action: 'add',
        });
      }
    }
  }
  rooms = [
    ...rooms,
    ...filter(initialRooms, r => {
      return r.status !== 'edit';
    }),
  ];
  return rooms;
}
