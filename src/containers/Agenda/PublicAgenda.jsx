import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import axios from 'axios';
import moment from 'moment';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { CircularProgress, Snackbar } from 'material-ui';
import ItemMenu from '../../components/OptionMenu/OptionMenu';
import CalendarComponent from '../../components/Agenda/CalendarComponent';
import WeekView from '../../components/Agenda/WeekView/WeekView';
import DayView from '../../components/Agenda/DayView/DayView';
import CalendarControlDropdown from '../../components/Agenda/CalendarControlDropdown/CalendarControlDropdown';
import { isLoggedIn } from '../../helpers';
import appResources from '../../appResources';
import { loadEvents, saveDate } from '../../actions/eventActions';
import { setEventModal, deleteEvent } from '../../actions/publisherActions';
import HeaderIcon from '../../components/icons/Agenda';
import PageHeader from '../../components/PageHeader/PageHeader';

const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const months = [
  { id: 0, name: 'januari' },
  { id: 1, name: 'februari' },
  { id: 2, name: 'maart' },
  {
    id: 3,
    name: 'april',
  },
  { id: 4, name: 'mei' },
  { id: 5, name: 'juni' },
  { id: 6, name: 'juli' },
  { id: 7, name: 'augustus' },
  {
    id: 8,
    name: 'september',
  },
  { id: 9, name: 'oktober' },
  { id: 10, name: 'november' },
  { id: 11, name: 'december' },
];
const years = [];
const current_date = new Date();
const timeRangeFormat = ({ start, end }, culture, local) => '';

function EventWeek({ event }) {
  return (
    <div style={{ fontSize: '0.9rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>
      {event.title}
    </div>
  );
}

class PublicAgenda extends React.Component {
  constructor(props) {
    super(props);

    for (let i = 2001; i <= 2019; i++) {
      years.push({
        id: i,
        name: i,
      });
    }
    this.state = {
      eventsUrl: `${appResources.backendUrl}events/?no_parent=True`,
      calendarDate: props.calendarDate ? new Date(props.calendarDate) : current_date,
      monthValue: props.calendarDate
        ? new Date(props.calendarDate).getMonth()
        : current_date.getMonth(),
      yearValue: props.calendarDate
        ? new Date(props.calendarDate).getFullYear()
        : current_date.getFullYear(),
      currentView: window.innerWidth > 992 ? 'month' : 'week',
      showLoader: false,
      showEmptyEventMessage: false,
      snackbarMessage: '',
      dossiers: [],
    };

    this.addFavorite = this.addFavorite.bind(this);
    this.setSnackbar = this.setSnackbar.bind(this);
    this.eventSelection = this.eventSelection.bind(this);
    this.getUserDossiers = this.getUserDossiers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }

  getUserDossiers() {
    const _this = this;

    if (isLoggedIn()) {
      axios
        .get('/dossier/list/', {
          headers: { Authorization: `Token ${_this.props.token}` },
        })
        .then(response => {
          _this.setState({
            dossiers: response.data.results,
          });
        })
        .catch(error => {});
    }
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

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getUrl() {
    const date = this.state.calendarDate;
    // let start_date =
    //   date.getMonth() === 0
    //     ? `${date.getFullYear() - 1}-11-01`
    //     : `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() - 1}-01`;
    // let end_date =
    //   date.getMonth() === 10
    //     ? `${date.getFullYear() + 1}-01-01`
    //     : `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 3}-01`;
    // start_date = date.getMonth() === 1 ? `${date.getFullYear() - 1}-12-01` : start_date;
    // end_date = date.getMonth() === 11 ? `${date.getFullYear() + 1}-02-01` : end_date;
    const start_date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() +
      1}-01`;
    const end_date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() +
      1}-${this.daysInMonth(date.getMonth() + 1, date.getFullYear())}`;
    const url = `${
      this.state.eventsUrl
    }&page_size=100&start_date=${start_date}&end_date=${end_date}&ordering=-start_time`;

    return url;
  }

  eventStyleGetter(event, start, end, isSelected) {
    return {
      style: {
        backgroundColor: event.published ? appResources.in_content_color : '#ff7f00',
        opacity:
          (event.itemsCount > 0 && event.published) ||
          this.props.is_admin ||
          this.props.is_author ||
          this.props.is_raadslid
            ? 1
            : 0.5,
        display: 'block',
        marginBottom: '0.5rem',
      },
    };
  }

  eventSelection(data) {
    if (
      data.itemsCount > 0 ||
      this.props.is_admin ||
      this.props.is_author ||
      this.props.is_raadslid
    ) {
      browserHistory.push(`/evenement/${data.id}`);
    } else {
      this.setSnackbar('Dit onderdeel bevat geen data', true);
    }
  }

  componentWillMount() {
    moment.locale('nl');
  }

  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Agenda`;
    this.props.loadEvents(this.getUrl());
    this.getUserDossiers();
    this.setState({ showLoader: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.calendarDate !== this.state.calendarDate) {
      this.setState({ showLoader: true });
      this.props.loadEvents(this.getUrl());
      this.setState({ showLoader: false });
    }
  }

  setSnackbar(text, show) {
    this.setState({
      snackbarMessage: text,
      showEmptyEventMessage: show,
    });
  }

  handleChange(date) {
    this.setState({ calendarDate: date });
    this.props.saveDate(date);
  }

  handleNavigate(date) {
    this.setState({
      calendarDate: date,
      yearValue: date.getFullYear(),
      monthValue: date.getMonth(),
    });
    this.props.saveDate(date);
  }

  render() {
    const { events, loading } = this.props;
    const { dossiers, calendarDate, snackbarMessage, showEmptyEventMessage } = this.state;
    const _EventComponent = props => {
      const { event, title } = props;
      return (
        <div className="custom-event-container">
          <div className="event-title" onClick={() => this.eventSelection(event)}>
            <span>{moment(event.start).format('HH:mm')}</span>
            {title}
          </div>
          <ItemMenu
            optionType={'agenda'}
            data={event}
            dossiers={dossiers}
            favoriteMenuItemType={'Add'}
            edit={() => this.props.setEventModal(true, event.id)}
            delete={() => {
              this.props.deleteEvent(event.id, 'event', () => {
                this.props.loadEvents(this.getUrl());
              });
            }}
          />
        </div>
      );
    };
    const Toolbar = toolbar => {
      return (
        <CustomToolbar
          events={events}
          toolbar={toolbar}
          loading={loading}
          date={calendarDate}
          setCurrentView={view => this.setState({ currentView: view })}
        />
      );
    };

    const HeaderTitle = `Raads kalender Gemeente ${appResources.municipality
      .substring(0, 1)
      .toUpperCase()}${appResources.municipality.substring(1)}`;

    return (
      <div className="basePage public-agenda-container">
        <Grid fluid>
          <PageHeader icon={<HeaderIcon />} title={HeaderTitle} />
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <div className="calendar-controls">
                <CalendarControlDropdown
                  type="month"
                  width="176px"
                  items={months}
                  date={calendarDate}
                  selectedValue={moment(calendarDate).month()}
                  handleChange={this.handleChange}
                />
                <CalendarControlDropdown
                  type="year"
                  width="176px"
                  items={years}
                  date={calendarDate}
                  selectedValue={moment(calendarDate).year()}
                  handleChange={this.handleChange}
                />
              </div>
              <CalendarComponent
                onNavigate={this.handleNavigate}
                date={calendarDate}
                view={this.state.currentView}
                onView={view => this.setState({ currentView: view })}
                events={events}
                eventPropGetter={this.eventStyleGetter}
                getUrl={this.getUrl()}
                views={{
                  month: true,
                  week: WeekView,
                  day: DayView,
                  work_week: true,
                }}
                popup
                components={{
                  toolbar: Toolbar,
                  week: {
                    event: EventWeek,
                  },
                  event: _EventComponent,
                }}
                formats={{
                  eventTimeRangeFormat: timeRangeFormat,
                }}
                min={new Date(2017, 10, 0, 8, 0, 0)}
                max={new Date(2017, 10, 0, 20, 0, 0)}
                style={{ height: '100%' }}
              />
            </Col>
          </Row>
        </Grid>
        <Snackbar
          open={showEmptyEventMessage}
          message={snackbarMessage}
          autoHideDuration={5000}
          action={'Dicht'}
          onRequestClose={() => this.setSnackbar('', false)}
        />
      </div>
    );
  }
}

PublicAgenda.propTypes = {
  events: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    is_admin: state.user.is_admin,
    is_author: state.user.type === 'auteur',
    is_raadslid: state.user.type === 'raadslid',
    token: state.user.token,
    events: state.events.data,
    loading: state.events.isLoading,
    calendarDate: state.events.date,
  };
}

export default connect(mapStateToProps, {
  loadEvents,
  saveDate,
  setEventModal,
  deleteEvent,
})(PublicAgenda);

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.goToBack = this.goToBack.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.goToCurrent = this.goToCurrent.bind(this);
    this.goToDayView = this.goToDayView.bind(this);
    this.goToWeekView = this.goToWeekView.bind(this);
    this.getTabCounts = this.getTabCounts.bind(this);
    this.goToMonthView = this.goToMonthView.bind(this);
  }

  goToBack() {
    this.props.toolbar.onNavigate('PREV');
  }

  goToNext() {
    this.props.toolbar.onNavigate('NEXT');
  }

  goToCurrent() {
    this.props.toolbar.onNavigate('TODAY');
    this.goToDayView();
  }

  goToDayView() {
    this.props.toolbar.onViewChange('day');
    this.props.setCurrentView('day');
  }

  goToWeekView() {
    this.props.toolbar.onViewChange('week');
    this.props.setCurrentView('week');
  }

  goToMonthView() {
    this.props.toolbar.onViewChange('month');
    this.props.setCurrentView('month');
  }

  getTabCounts() {
    const { events, date } = this.props;
    let monthCount = 0,
      weekCount = 0,
      dayCount = 0;

    for (let i = 0; i < events.length; i++) {
      if (moment(events[i].date).isSame(date, 'month')) {
        monthCount++;
      }
      if (moment(events[i].date).isSame(date, 'week')) {
        weekCount++;
      }
      if (moment(events[i].date).isSame(date, 'day')) {
        dayCount++;
      }
    }
    return {
      month: monthCount,
      week: weekCount,
      day: dayCount,
    };
  }

  getLabel(toolbar) {
    let label = '';
    switch (toolbar.view) {
      case 'month':
        label = (
          <div>
            <b>{months[moment(toolbar.date).month()].name}</b> {moment(toolbar.date).format('YYYY')}
          </div>
        );
        break;
      case 'week':
        label = (
          <div>
            <b>Week {moment(toolbar.date).isoWeek()}</b> |{' '}
            {moment(toolbar.date)
              .startOf('isoWeek')
              .format('DD')}{' '}
            t/m{' '}
            {moment(toolbar.date)
              .endOf('isoWeek')
              .format('DD')}{' '}
            {moment(toolbar.date)
              .endOf('isoWeek')
              .format('MMMM')}
          </div>
        );
        break;
      case 'day':
        label = `${days[moment(toolbar.date).weekday()]} - ${moment(toolbar.date).format(
          'DD MMMM',
        )}`;
        break;
      case 'today':
        label = `${days[moment(toolbar.date).weekday()]} - ${moment(toolbar.date).format(
          'DD MMMM',
        )}`;
        break;
      default:
        label = toolbar.label;
    }
    return label;
  }

  render() {
    const { date, toolbar, loading } = this.props;
    const normalStyle = 'agenda-toolbar-item';
    const selectedStyle = 'agenda-toolbar-item selected';
    const today_selected = moment(date).isSame(Date.now(), 'day');

    return (
      <div className="agenda-toolbar no-text-select">
        <div>
          <div
            className={toolbar.view === 'month' ? selectedStyle : normalStyle}
            onClick={this.goToMonthView}
          >
            Maand
          </div>
          <div
            className={toolbar.view === 'week' ? selectedStyle : normalStyle}
            onClick={this.goToWeekView}
          >
            Week
          </div>
          <div
            className={toolbar.view === 'day' && !today_selected ? selectedStyle : normalStyle}
            onClick={this.goToDayView}
          >
            Dag
          </div>
          <div
            className={toolbar.view === 'day' && today_selected ? selectedStyle : normalStyle}
            onClick={this.goToCurrent}
          >
            Vandaag
          </div>
        </div>
        <hr />
        <div className="agenda-nav-control">
          <i
            style={{ backgroundColor: appResources.basicColor }}
            className="material-icons"
            onClick={this.goToBack}
          >
            keyboard_arrow_left
          </i>
          <div>{this.getLabel(toolbar)}</div>
          <i
            style={{ backgroundColor: appResources.basicColor }}
            className="material-icons"
            onClick={this.goToNext}
          >
            keyboard_arrow_right
          </i>
        </div>
        <div
          className="justify-text"
          style={{
            width: '100%',
            margin: '10px 0',
            visibility: loading ? 'visible' : 'hidden',
          }}
        >
          <CircularProgress size={50} thickness={5} color={appResources.basicColor} />
        </div>
      </div>
    );
  }
}
