import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import axios from 'axios';
import { Snackbar } from 'material-ui';
import filter from 'lodash/filter';
import moment from 'moment';
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
const _localizer = _interopRequireDefault(localizer);

const weekDays = [
  { key: 1, name: 'Maandag' },
  { key: 2, name: 'Dinsdag' },
  { key: 3, name: 'Woensdag' },
  { key: 4, name: 'Donderdag' },
  { key: 5, name: 'Vrijdag' },
  { key: 6, name: 'Zaterdag' },
  { key: 0, name: 'Zondag' },
];

class WeekView extends React.Component {
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

  getWeekDaysEvents() {
    const { events } = this.props;
    const days = this.getWeekDates();
    const results = [];
    for (let i = 0; i < events.length; i++) {
      for (let y = 0; y < days.length; y++) {
        const eventDate = moment(events[i].date).format('DD-MM-YYYY');
        const weekDate = moment(days[y]).format('DD-MM-YYYY');
        if (eventDate === weekDate) {
          results.push(events[i]);
        }
      }
    }
    return results;
  }

  render() {
    const { snackbarMessage, showEmptyEventMessage } = this.state;
    const events = this.getWeekDaysEvents();
    return (
      <div className="weekly-view-container">
        {weekDays.map(day => {
          const dayEvents = filter(events, e => {
            if (moment(e.date).day() === day.key) {
              return e;
            }
          });
          return (
            <WeekDay
              key={day.key}
              data={day}
              events={dayEvents}
              isAdmin={this.props.is_admin}
              dossiers={this.props.dossiers}
              setSnackbar={this.setSnackbar}
              addFavorite={this.addFavorite}
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

class WeekDay extends React.Component {
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
    const { data, events, dossiers, getUserDossiers, setSnackbar, addFavorite } = this.props;
    return (
      <div className="week-day-container">
        <div className="top-row">
          <label>{data.name}</label>
          <label className="events-count">
            {events.length > 0
              ? `- ${events.length} Agenda ${events.length > 1 ? 'punten' : 'punt'}`
              : ''}
          </label>
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
                      <div>{e.title}</div>
                    </div>
                    <ItemMenu
                      optionType={'agenda'}
                      data={e}
                      dossiers={dossiers}
                      setSnackbar={setSnackbar}
                      favoriteMenuItemType={'Add'}
                      favoriteAction={addFavorite}
                      getUserDossiers={getUserDossiers}
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

WeekView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'week');
    case navigate.NEXT:
      return dates.add(date, 1, 'week');
    default:
      return date;
  }
};

WeekView.range = (date, { culture }) => {
  const firstOfWeek = localizer.startOfWeek(culture);
  const start = dates.startOf(date, 'week', firstOfWeek);
  const end = dates.endOf(date, 'week', firstOfWeek);

  return dates.range(start, end);
};

WeekView.title = (date, { formats, culture }) => {
  let weekrange = WeekView.range(date, { culture }),
    start = weekrange[0],
    rest = weekrange.slice(1);

  return _localizer.default.format(
    { start, end: rest.pop() },
    formats.dayRangeHeaderFormat,
    culture,
  );
};

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
})(WeekView);
