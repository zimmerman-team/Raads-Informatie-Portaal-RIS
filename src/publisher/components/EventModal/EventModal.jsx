import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import { Tooltip } from 'react-tippy';
import HeaderIcon from '../../../components/icons/Agenda';
import PageHeader from '../../../components/PageHeader/PageHeader';
import TextField from '../TextField/TextField';
import RoomSelection from './RoomSelection/RoomSelection';
import EventSelectDate from './EventDate/EventSelectDate';
import EventSelectTime from './EventDate/EventSelectTime';
import {
  checkDateTimeAvailability,
  getEvent,
  getFormattedSavedRooms,
  getNextPolitiekeMarktNumber,
  validRoomTimes,
} from './Helper';
import { loadSingleEvent } from '../../../actions/eventActions';
import { setSnackBar } from '../../../actions/generalActions';
import {
  editEvent,
  setEventModal,
  createNewEvent,
  clearEventModalData,
} from '../../../actions/publisherActions';
import appResources from '../../../appResources';
import styles from './EventModal.module.scss';
import mock from './EventModal.mock';
import genericStyles from '../../../components/modals/PublisherModal.module.scss';

const defState = {
  title: 'Nieuw evenement toevoegen',
  initialState: {
    date: moment().format('YYYY-MM-DD'),
    title: '',
    location: '',
    description: '',
    timeError: false,
    editMode: false,
    selectedEvent: null,
    toEditEvent: null,
    start_time: moment().format('HH:mm'),
    end_time: moment().format('HH:mm'),
    dateIsAvailable: true,
    showTimeError: false,
    endTimeDisabled: true,
    loadingExistingEvent: false,
    politiekeMarktNumber: null,
    isLoading: false,
    availableRooms: [
      {
        id: 0,
        title: 'Plenair',
        value: 'Plenair',
        start_time: '19:00',
        end_time: '21:30',
        defaultStartTime: '19:00',
        defaultEndTime: '21:30',
      },
      {
        id: 1,
        title: 'Zaal Hout',
        value: 'Zaal Hout',
        start_time: '19:00',
        end_time: '21:00',
        defaultStartTime: '19:00',
        defaultEndTime: '21:00',
      },
      {
        id: 2,
        title: 'Zaal Haven',
        value: 'Zaal Haven',
        start_time: '19:00',
        end_time: '21:00',
        defaultStartTime: '19:00',
        defaultEndTime: '21:00',
      },
      {
        id: 3,
        title: 'Zaal Stad',
        value: 'Zaal Stad',
        start_time: '19:00',
        end_time: '21:00',
        defaultStartTime: '19:00',
        defaultEndTime: '21:00',
      },
      {
        id: 4,
        title: 'Zaal Buiten',
        value: 'Zaal Buiten',
        start_time: '19:00',
        end_time: '21:00',
        defaultStartTime: '19:00',
        defaultEndTime: '21:00',
      },
    ],
    savedRooms: [],
    initialRooms: [],
  },
};

class EventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...mock.initialState,
    };

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.saveRoom = this.saveRoom.bind(this);
    this.loadEvent = this.loadEvent.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onEventSelection = this.onEventSelection.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  componentWillMount() {
    if (this.props.show) {
      getNextPolitiekeMarktNumber(this);
    }
  }

  componentDidMount() {
    const that = this;
    window.onbeforeunload = function(e) {
      that.close();
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.show !== this.props.show && this.props.show && this.props.toEditEventID) {
      this.setState({ loadingExistingEvent: true });
      getEvent(this.props.toEditEventID, this);
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.close();
    }
    if (prevProps.show !== this.props.show && this.props.show) {
      getNextPolitiekeMarktNumber(this);
    }
  }

  loadEvent() {
    const url = `${appResources.backendUrl}events/${this.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${this.props.params.eventId}/`;
    this.props.loadSingleEvent([url, c_url]);
  }

  onEventSelection(selectedEvent) {
    this.setState({
      title: selectedEvent.id === 0 ? '' : this.state.title,
      selectedEvent,
    });
    if (selectedEvent.id !== 0) {
      const title = this.state.politiekeMarktNumber
        ? `${this.state.politiekeMarktNumber} Politieke Markt`
        : 'Politieke Markt';
      this.setState({ title });
      if (!this.props.toEditEventID) {
        this.setState({ savedRooms: this.state.availableRooms });
      }
    }
  }

  onTitleChange(title) {
    this.setState({ title });
  }

  onLocationChange(location) {
    this.setState({ location });
  }

  onDescriptionChange(description) {
    this.setState({ description });
  }

  onDateChange(type, date) {
    this.setState({ [type]: date }, () => {
      checkDateTimeAvailability(this);
      validRoomTimes(this, this.state.date, this.state.savedRooms);
    });
  }

  saveRoom(room, saveType) {
    let savedRooms = [...this.state.savedRooms];
    if (
      find(savedRooms, i => {
        return i.id === room.id;
      })
    ) {
      savedRooms = filter(savedRooms, i => {
        return i.id !== room.id;
      });
    }
    if (saveType !== 'delete') {
      savedRooms.push({
        ...room,
        error:
          room.error ||
          moment(`${moment(this.state.date).format('YYYY-MM-DD')} ${room.start_time}`) >
            moment(`${moment(this.state.date).format('YYYY-MM-DD')} ${this.state.end_time}`),
      });
    }
    this.setState({ savedRooms }, () => {
      validRoomTimes(this, this.state.date, savedRooms);
    });
  }

  onSubmit(published) {
    this.setState({ isLoading: true });
    if (this.state.editMode) {
      this.props.editEvent(
        this,
        mock,
        this.state.toEditEvent.id,
        this.state.title,
        this.state.selectedEvent.id !== 0 ? '' : this.state.description,
        this.state.selectedEvent.id !== 0 ? 'Stadhuis' : this.state.location,
        `${moment(this.state.date).format('YYYY-MM-DD')} ${this.state.start_time}`,
        this.state.endTimeDisabled
          ? null
          : `${moment(this.state.date).format('YYYY-MM-DD')} ${this.state.end_time}`,
        published,
        getFormattedSavedRooms(this.state.savedRooms, this.state.initialRooms),
        `${moment(this.state.date).format('YYYY-MM-DD')}`,
        this.loadEvent,
      );
    } else {
      this.props.createNewEvent(
        this,
        mock,
        this.state.title,
        this.state.selectedEvent.id !== 0 ? '' : this.state.description,
        this.state.selectedEvent.id !== 0 ? 'Stadhuis' : this.state.location,
        `${moment(this.state.date).format('YYYY-MM-DD')} ${this.state.start_time}`,
        this.state.endTimeDisabled
          ? null
          : `${moment(this.state.date).format('YYYY-MM-DD')} ${this.state.end_time}`,
        published,
        this.state.savedRooms,
        `${moment(this.state.date).format('YYYY-MM-DD')}`,
      );
    }
  }

  close() {
    const newState = defState;
    newState.initialState.politiekeMarktNumber = this.state.politiekeMarktNumber;
    this.props.clearEventModalData();
    this.props.setEventModal();
    this.setState({
      ...newState.initialState,
    });
  }

  render() {
    const submitBtnEnable =
      ((get(this.state.selectedEvent, 'id', 0) !== 0 && this.state.title !== '') ||
        (this.state.title !== '' && this.state.location !== '')) &&
      this.state.dateIsAvailable &&
      !this.state.showTimeError &&
      this.state.validRooms;
    const titleComponent = (
      <div>
        <PageHeader
          title={
            this.state.editMode || this.state.loadingExistingEvent
              ? mock.editTitle
              : mock.createTitle
          }
          icon={<HeaderIcon />}
        />
      </div>
    );
    let actions = [
      <button
        onClick={this.close}
        className={styles.button}
        style={{ background: '#fa5858', borderColor: '#fa5858' }}
      >
        Annuleren
      </button>,
      <Tooltip
        style={{ paddingTop: 0 }}
        title="Moet alle verplichte velden invullen OF er zijn veldfouten"
        position="top"
        trigger="mouseenter"
        disabled={submitBtnEnable}
        duration={200}
      >
        <button
          onClick={() => this.onSubmit(true)}
          className={styles.button}
          disabled={!submitBtnEnable}
          style={{
            background: appResources.in_content_color,
            borderColor: appResources.in_content_color,
            cursor: submitBtnEnable ? 'pointer' : 'not-allowed',
          }}
        >
          {this.state.editMode ? 'Wijzigingen opslaan' : 'Toevoegen'}
        </button>
      </Tooltip>,
    ];

    if (!this.state.editMode) {
      actions = [
        ...actions,
        <Tooltip
          style={{ paddingTop: 0 }}
          title="Moet alle verplichte velden invullen OF er zijn veldfouten"
          position="top"
          trigger="mouseenter"
          disabled={submitBtnEnable}
          duration={200}
        >
          <button
            onClick={() => this.onSubmit(false)}
            className={styles.button}
            disabled={!submitBtnEnable}
            style={{
              background: '#ff7f00',
              borderColor: '#ff7f00',
              cursor: submitBtnEnable ? 'pointer' : 'not-allowed',
            }}
          >
            Bewaren als draft
          </button>
        </Tooltip>,
      ];
    }

    return (
      <Dialog
        open={this.props.show}
        modal
        title={titleComponent}
        actions={this.state.loadingExistingEvent ? [] : actions}
        contentStyle={{
          width: '70%',
          maxWidth: 'none',
        }}
        autoScrollBodyContent
        className={genericStyles.modal}
        actionsContainerClassName={styles.btnContainer}
        contentClassName={styles.modalContent}
        titleClassName={styles.title}
        bodyClassName={styles.modalBody}
        onRequestClose={this.close}
      >
        {this.state.loadingExistingEvent && (
          <div className={styles.loadingDiv}>Loading event data...</div>
        )}
        {this.state.isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        {!this.state.loadingExistingEvent && (
          <React.Fragment>
            <div className={genericStyles.asteriskMeaning}>
              <span className={genericStyles.asteriskText}>
                <span className={genericStyles.asterisk}>*</span>
                Verplichte velten
              </span>
            </div>
            {!this.state.editMode && (
              <TextField
                required={false}
                type="event_template"
                template={this.state.selectedEvent}
                hintText="Selecteer een evenement"
                reduxItemsAdd={this.onEventSelection}
              />
            )}
            {this.state.selectedEvent && (
              <React.Fragment>
                <TextField
                  required
                  type="title"
                  hintText="Titel nieuwe evenement"
                  reduxItemsAdd={this.onTitleChange}
                  template={{ name: this.state.title }}
                  politiekeMarktNumber={this.state.politiekeMarktNumber}
                />
                {this.state.selectedEvent.id === 0 && (
                  <React.Fragment>
                    <TextField
                      required
                      type="title"
                      hintText="Nieuwe locatie"
                      reduxItemsAdd={this.onLocationChange}
                      template={{ name: this.state.location }}
                    />
                    <TextField
                      type="location"
                      required={false}
                      hintText="Bestaande locatie"
                      reduxItemsAdd={this.onLocationChange}
                    />
                    <TextField
                      required={false}
                      type="description"
                      hintText="Toelichting geven"
                      reduxItemsAdd={this.onDescriptionChange}
                      template={{ name: this.state.description }}
                    />
                  </React.Fragment>
                )}
                <hr className={styles.divider} />
                <EventSelectDate
                  required
                  title="Kies datum evenement"
                  onChange={this.onDateChange}
                  initDate={this.state.date}
                  showError={!this.state.dateIsAvailable}
                />
                <EventSelectTime
                  required
                  fullWidth
                  hasCheckBox
                  title="Kies starttijd"
                  value={this.state.start_time}
                  onChange={v => this.onDateChange('start_time', v)}
                  showError={this.state.showTimeError}
                />
                <EventSelectTime
                  fullWidth
                  hasCheckBox
                  title="Heeft een eindtijd"
                  value={this.state.end_time}
                  onChange={v => this.onDateChange('end_time', v)}
                  extraCheckboxAction={v => {
                    this.setState({ endTimeDisabled: v }, () => {
                      checkDateTimeAvailability(this);
                      validRoomTimes(this, this.state.date, this.state.savedRooms);
                    });
                  }}
                  showError={false}
                />
                {this.state.selectedEvent.id !== 0 && (
                  <React.Fragment>
                    <hr className={styles.divider} />
                    <div className={styles.roomSelectionTitle}>
                      Beschikbare zalen selecteren <span className={styles.asterisk}>*</span>
                    </div>
                    {this.state.availableRooms.map(room => {
                      const savedRoom = find(this.state.initialRooms, r => {
                        return r.title === room.title;
                      });
                      const checked =
                        savedRoom !== undefined ||
                        find(this.state.savedRooms, r => {
                          return r.id === room.id;
                        }) !== undefined;
                      return (
                        <RoomSelection
                          item={room}
                          key={room.id}
                          checked={checked}
                          savedRoom={savedRoom}
                          date={this.state.date}
                          eventStartTime={this.state.start_time}
                          eventEndTime={this.state.end_time}
                          eventEndTimeDisabled={this.state.endTimeDisabled}
                          token={this.props.token}
                          saveRoom={this.saveRoom}
                          startTime={get(savedRoom, 'start_time', null)}
                          endTime={get(savedRoom, 'end_time', null)}
                        />
                      );
                    })}
                  </React.Fragment>
                )}
                <hr className={styles.divider} style={{ marginBottom: 0 }} />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { user, publisher, singleEvent } = state;
  return {
    token: user.token,
    show: publisher.newEventModalVisibility,
    dossierID: publisher.publicDossierSelectedID,
    documents: publisher.publicDossierSelectedDocuments,
    dossiers: publisher.publicDossierSelectedDossiers,
    toEditEventID: publisher.newEventSelectedID,
    childEventsData: singleEvent.childEventsData,
    eventData: singleEvent.eventData,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    editEvent,
    setSnackBar,
    setEventModal,
    createNewEvent,
    loadSingleEvent,
    clearEventModalData,
  })(EventModal),
);
