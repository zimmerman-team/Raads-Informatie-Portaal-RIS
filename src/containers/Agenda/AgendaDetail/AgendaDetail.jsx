/* base */
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import EventTiles from '../../../components/Agenda/EventTiles/EventTiles';
/* third party visual components */
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import { Glyphicon } from 'react-bootstrap';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
/* state */
import { loadSingleEvent, loadEventSpeakers } from '../../../actions/eventActions';
import { removeSelectedCombinedItemID } from '../../../actions/generalActions';
import { getEventPublishStatus, changeEventPublishStatus } from '../../../actions/publisherActions';
/* vars */
import appResources from '../../../appResources';
import { getParameterByName } from '../../../helpers';
import styles from './AgendaDetail.module.scss';

class AgendaDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      published: true,
      selectedRoom: -1,
      selectedAgendaItem: -1,
    };

    this.loadEvent = this.loadEvent.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
    this.checkURLParams = this.checkURLParams.bind(this);
    this.changeAgendaItem = this.changeAgendaItem.bind(this);
  }

  componentWillMount() {
    this.loadEvent();
    this.checkURLParams();
  }

  componentDidMount() {
    moment.locale('nl');
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Evenement`;
    if (this.props.is_admin) {
      const curEventID = getParameterByName('zaal')
        ? getParameterByName('zaal')
        : this.props.params.eventId;
      this.props.getEventPublishStatus(curEventID, this);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkURLParams();
    if (
      !this.props.isLoading &&
      !this.props.eventData.published &&
      !this.props.is_admin &&
      !this.props.is_author &&
      !this.props.is_raadslid
    ) {
      browserHistory.push('/agenda');
    }
    if (this.props.is_admin) {
      if (prevProps.location.search !== this.props.location.search) {
        const curEventID = getParameterByName('zaal')
          ? getParameterByName('zaal')
          : this.props.params.eventId;
        this.props.getEventPublishStatus(curEventID, this);
      }
    }
  }

  componentWillUnmount() {
    this.props.removeSelectedCombinedItemID();
  }

  getFormattedData(data) {
    if (data) {
      return {
        name: data.name,
        date: moment(data.start_time).format('DD-MM-YYYY'),
        location: data.location,
        description:
          data.description && data.description !== 'n/a'
            ? data.description
                .replace('<p>', '')
                .replace('</p>', '')
                .replace('<br>', ' ')
                .replace('<br>*', ' ')
                .replace('s<br>*', 's')
            : '',
        start_time: moment(data.start_time).format('HH:mm'),
      };
    }
    return {
      name: '',
      date: '',
      location: '',
      description: '',
      start_time: '',
    };
  }

  loadEvent() {
    const url = `${appResources.backendUrl}events/${this.props.params.eventId}/`;
    const c_url = `${appResources.backendUrl}child_events/${this.props.params.eventId}/`;
    this.props.loadSingleEvent([url, c_url]);
  }

  changeRoom(room) {
    const { params } = this.props;

    if (room === -1) {
      browserHistory.push(`/evenement/${params.eventId}/`);
    } else {
      browserHistory.push(`/evenement/${params.eventId}/?zaal=${room}`);
    }

    this.setState({
      selectedRoom: room,
      selectedAgendaItem: -1,
    });
  }

  changeAgendaItem(room, agenda) {
    const { params } = this.props;

    browserHistory.push(`/evenement/${params.eventId}/?zaal=${room}&agenda=${agenda}`);
    this.setState({
      selectedRoom: room,
      selectedAgendaItem: agenda,
    });
  }

  checkURLParams() {
    const selectedRoom =
      getParameterByName('zaal') === null || getParameterByName('zaal') === ''
        ? -1
        : parseInt(getParameterByName('zaal'), 10);
    const selectedAgendaItem =
      getParameterByName('agenda') === null || getParameterByName('agenda') === ''
        ? -1
        : parseInt(getParameterByName('agenda'), 10);

    if (selectedRoom !== this.state.selectedRoom) this.setState({ selectedRoom });

    if (selectedAgendaItem !== this.state.selectedAgendaItem) this.setState({ selectedAgendaItem });
  }

  render() {
    const { selectedRoom, selectedAgendaItem } = this.state;
    const {
      dossiers,
      isLoading,
      eventData,
      childEventsData,
      loadEventSpeakers,
      speakers,
    } = this.props;
    const formattedEventData = this.getFormattedData(eventData);
    const curEventID = getParameterByName('zaal')
      ? getParameterByName('zaal')
      : this.props.params.eventId;
    return (
      <div className="basePage agenda-detail-container" style={{ paddingTop: 20 }}>
        {isLoading && (
          <div className="center-loader">
            <CircularProgress color={appResources.basicColor} size={80} thickness={5} />
          </div>
        )}

        {!isLoading &&
          (childEventsData.length > 0 || !isEmpty(eventData)) && (
            <Grid fluid>
              <Row className="show-grid">
                <Col sm={12} md={12} lg={12}>
                  {(this.props.is_admin || this.props.is_author) && (
                    <div className={styles.adminDivControls}>
                      <Toggle
                        toggled={this.state.published}
                        labelPosition="right"
                        labelStyle={{
                          fontSize: 21,
                          color: '#0c74d5',
                          width: 'calc(100% - 30px)',
                        }}
                        label="publiceren naar RIS portaal"
                        onToggle={(e, value) => {
                          this.props.changeEventPublishStatus(parseInt(curEventID, 10), value);
                          this.setState({ published: value });
                        }}
                        style={{
                          display: 'inline-flex',
                          marginRight: 20,
                          width: 'fit-content',
                          height: 'fit-content',
                          paddingTop: 17,
                        }}
                      />
                    </div>
                  )}
                  <div className="main-container">
                    <div className="title">
                      <Glyphicon glyph="calendar" className="agenda-icon" />
                      <h2>Agenda Punten in de {formattedEventData.name}</h2>
                    </div>
                    <div className="sub-title">
                      <div className="sub-title-text">
                        <b>Datum:</b> {formattedEventData.date}
                        <div className="divider">|</div>
                      </div>
                      <div className="sub-title-text">
                        <b>Locatie:</b> {formattedEventData.location}
                        <div className="divider">|</div>
                      </div>
                      <div className="sub-title-text">
                        <b>Starttijd:</b> {formattedEventData.start_time} uur
                      </div>
                    </div>
                    <div className="description">
                      {/<[a-z][\s\S]*>/i.test(formattedEventData.description)
                        ? ''
                        : formattedEventData.description}
                    </div>
                    <EventTiles
                      dossiers={dossiers}
                      speakers={speakers}
                      eventData={eventData}
                      selectedRoom={selectedRoom}
                      changeRoom={this.changeRoom}
                      childEventsData={childEventsData.length !== 0 ? childEventsData : false}
                      eventID={this.props.params.eventId}
                      loadEventSpeakers={loadEventSpeakers}
                      selectedAgendaItem={selectedAgendaItem}
                      changeAgendaItem={this.changeAgendaItem}
                    />
                    <br />
                  </div>
                </Col>
              </Row>
            </Grid>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { singleEvent, user } = state;
  return {
    is_admin: user.is_admin,
    is_author: user.type === 'auteur',
    is_raadslid: user.type === 'raadslid',
    dossiers: user.dossiers,
    isLoading: singleEvent.isLoading,
    eventData: singleEvent.eventData,
    childEventsData: singleEvent.childEventsData,
    speakers: singleEvent.speakers,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    loadSingleEvent,
    loadEventSpeakers,
    getEventPublishStatus,
    changeEventPublishStatus,
    removeSelectedCombinedItemID,
  })(AgendaDetail),
);
