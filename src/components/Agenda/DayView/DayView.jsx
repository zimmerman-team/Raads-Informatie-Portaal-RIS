import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import filter from 'lodash/filter';
import axios from 'axios';
import moment from 'moment';
import { Snackbar } from 'material-ui';
import ItemMenu from '../../OptionMenu/OptionMenu';
import dates from '../../../../node_modules/react-big-calendar/lib/utils/dates';
import localizer from '../../../../node_modules/react-big-calendar/lib/localizer';
import { navigate } from '../../../../node_modules/react-big-calendar/lib/utils/constants';
import { isLoggedIn } from '../../../helpers';
import appResources from '../../../appResources';
import { deleteEvent, setEventModal } from '../../../actions/publisherActions';
import { loadEvents } from '../../../actions/eventActions';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
_interopRequireDefault(localizer);

const timeslots = [
  { key: 0, name: '08:00', hour: 8 },
  { key: 1, name: '10:00', hour: 10 },
  { key: 2, name: '12:00', hour: 12 },
  { key: 3, name: '14:00', hour: 14 },
  { key: 4, name: '16:00', hour: 16 },
  { key: 5, name: '18:00', hour: 18 },
];

class DayView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      snackbarMessage: '',
      showEmptyEventMessage: false,
    };

    this.setSnackbar = this.setSnackbar.bind(this);
  }

  addFavorite(id) {
    const _this = this;
    if (isLoggedIn()) {
      axios
        .post(
          `favorite/add/`,
          {
            item: parseInt(id, 10),
          },
          { headers: { Authorization: `Token ${sessionStorage.getItem('token')}` } },
        )
        .then(response => {
          _this.setSnackbar('Item toegevoegd aan favorieten.', true);
        })
        .catch(error => {
          const status = error.message.substr(error.message.length - 3);
          if (parseInt(status, 10) === 403) {
            _this.setSnackbar('Item is al toegevoegd aan favorieten.', true);
          } else if (parseInt(status, 10) === 401) {
            _this.setSnackbar('Er is iets fout gegaan...', true);
          }
        });
    } else {
      this.setSnackbar('U moet ingelogd zijn voor deze optie.', true);
    }
  }

  setSnackbar(text, show) {
    this.setState({
      snackbarMessage: text,
      showEmptyEventMessage: show,
    });
  }

  getWeekDates() {
    const { date } = this.props;
    const startOfWeek = moment(date).startOf('isoWeek');
    const endOfWeek = moment(date).endOf('isoWeek');
    const days = [];
    let day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    return days;
  }

  getDayEvents() {
    const { events, date } = this.props;
    return filter(events, e => {
      if (moment(e.date).format('DD-MM-YYYY') === moment(date).format('DD-MM-YYYY')) {
        return e;
      }
    });
  }

  render() {
    const { date } = this.props;
    const { snackbarMessage, showEmptyEventMessage } = this.state;
    const events = this.getDayEvents();
    return (
      <div className="day-view-container">
        {timeslots.map(slot => {
          const time1 = moment(date)
            .hour(slot.hour)
            .minutes(0)
            .seconds(0);
          const time2 = moment(date)
            .hour(slot.hour + 2)
            .minutes(0)
            .seconds(0);
          const slotEvents = filter(events, e => {
            if (moment(e.date).isBetween(time1, time2, 'hour', '[)')) {
              return e;
            }
          });
          return (
            <Timeslot
              key={slot.key}
              data={slot}
              events={slotEvents}
              isAdmin={this.props.is_admin}
              dossiers={this.props.dossiers}
              setSnackbar={this.setSnackbar}
              addFavorite={this.addFavorite}
              getUserDossiers={this.getUserDossiers}
              setEventModal={this.props.setEventModal}
              deleteEvent={this.props.deleteEvent}
              getUrl={this.props.getUrl}
              loadEvents={this.props.loadEvents}
            />
          );
        })}
        <Snackbar
          open={showEmptyEventMessage}
          message={snackbarMessage}
          autoHideDuration={5000}
          action={'Dicht'}
          onActionClick={() => this.setSnackbar('', false)}
          onRequestClose={() => this.setSnackbar('', false)}
        />
      </div>
    );
  }
}

class Timeslot extends React.Component {
  eventStyleGetter(event) {
    return {
      backgroundColor: event.published ? appResources.in_content_color : '#ff7f00',
      opacity: (event.itemsCount > 0 && event.published) || this.props.isAdmin ? 1 : 0.5,
    };
  }

  onEventClick(event) {
    if (event.itemsCount > 0 || this.props.isAdmin) {
      browserHistory.push(`/evenement/${event.id}`);
    } else {
      this.props.setSnackbar('Dit onderdeel bevat geen data', true);
    }
  }

  render() {
    const { data, events, dossiers, setSnackbar, addFavorite } = this.props;
    return (
      <div className="day-timeslot-container">
        <div className="top-row">
          <label>{data.name}</label>
        </div>
        <div className="bottom-row">
          {events.map(e => {
            return (
              <div
                key={e.id}
                className="rbc-event"
                style={this.eventStyleGetter(e)}
                title={e.title}
              >
                <div className="rbc-event-content">
                  <div className="custom-event-container">
                    <div className="event-title" onClick={() => this.onEventClick(e)}>
                      <span>{moment(e.date).format('HH:mm')}</span>
                      {e.title}
                      <span className="classifcation">
                        {e.classification === e.title ? '' : e.classification}
                      </span>
                    </div>
                    <ItemMenu
                      optionType={'agenda'}
                      data={e}
                      dossiers={dossiers}
                      setSnackbar={setSnackbar}
                      favoriteMenuItemType={'Add'}
                      favoriteAction={addFavorite}
                      handleOpenNewDossier={this.handleOpenNewDossier}
                      edit={() => this.props.setEventModal(true, e.id)}
                      delete={() => {
                        this.props.deleteEvent(e.id, 'event', () => {
                          this.props.loadEvents(this.props.getUrl);
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

DayView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'day');

    case navigate.NEXT:
      return dates.add(date, 1, 'day');

    default:
      return date;
  }
};

DayView.title = (date, { formats, culture }) =>
  localizer.format(date, formats.dayHeaderFormat, culture);

function mapStateToProps(state) {
  return {
    is_admin: state.user.is_admin,
    dossiers: state.user.dossiers,
  };
}

export default connect(mapStateToProps, {
  loadEvents,
  setEventModal,
  deleteEvent,
})(DayView);
