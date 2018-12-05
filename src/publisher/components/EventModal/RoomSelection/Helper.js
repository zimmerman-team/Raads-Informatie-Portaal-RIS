import axios from 'axios';
import moment from 'moment';
import appResources from '../../../../appResources';

export function checkDateTimeAvailability(that) {
  const start_time = that.state.showStartTime
    ? `${moment(that.props.date).format('YYYY-MM-DD')} ${that.state.startTime}`
    : null;
  const end_time = that.state.showEndTime
    ? `${moment(that.props.date).format('YYYY-MM-DD')} ${that.state.endTime}`
    : null;
  const event_start_time = moment(
    `${moment(that.props.date).format('YYYY-MM-DD')} ${that.props.eventStartTime}`,
  );
  const event_end_time = moment(
    `${moment(that.props.date).format('YYYY-MM-DD')} ${that.props.eventEndTime}`,
  );
  let check2 = true;
  if (that.state.showStartTime && that.state.showEndTime) {
    check2 =
      event_start_time.isSameOrBefore(start_time) &&
      event_start_time.isBefore(end_time) &&
      (that.props.eventEndTimeDisabled ||
        (event_end_time.isAfter(start_time) && event_end_time.isSameOrAfter(end_time)));
  } else if (that.state.showStartTime && !that.state.showEndTime) {
    check2 =
      event_start_time.isSameOrBefore(start_time) &&
      (that.props.eventEndTimeDisabled || event_end_time.isAfter(start_time));
  } else if (!that.state.showStartTime && that.state.showEndTime) {
    check2 =
      event_start_time.isBefore(end_time) &&
      (that.props.eventEndTimeDisabled || event_end_time.isSameOrAfter(end_time));
  }
  that.setState({
    showTimeError:
      that.state.showStartTime && that.state.showEndTime
        ? !moment(start_time).isBefore(moment(end_time))
        : false,
    showEventTimeError: !check2,
  });
  axios
    .post(
      `${appResources.backendUrl}check-time-room-allocated/`,
      {
        room: that.props.item.title,
        start_time,
        end_time,
        event_id: that.props.savedRoom ? that.props.savedRoom.originID : null,
      },
      { headers: { Authorization: `Token ${that.props.token}` } },
    )
    .then(response => {
      that.setState({
        timeIsAvailable: !response.data.allocated,
      });
    })
    .catch(e => {
      that.setState({ timeIsAvailable: false });
    });
}
