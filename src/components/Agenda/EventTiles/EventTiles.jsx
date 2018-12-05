import React from 'react';
import { withRouter } from 'react-router';
import get from 'lodash/get';
import find from 'lodash/find';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import RoomTile from '../RoomTile/RoomTile';
import RoomsDropdown from '../RoomsDropdown/RoomsDropdown';
import UtrechtAgendaList from '../UtrechtAgendaList';
import AgendaTile from './AgendaTile/AgendaTile';
import { municipality } from '../../../config';

class EventTiles extends React.Component {
  render() {
    const {
      speakers,
      location,
      childEventsData,
      selectedRoom,
      selectedAgendaItem,
      changeRoom,
      changeAgendaItem,
      loadEventSpeakers,
      eventData,
    } = this.props;

    return (
      <div className="event-tiles">
        {childEventsData &&
          municipality !== 'Utrecht' && (
            <RoomsDropdown
              rooms={childEventsData}
              selectedRoom={selectedRoom}
              changeRoom={changeRoom}
            />
          )}
        {selectedRoom === -1 &&
          childEventsData &&
          municipality !== 'Utrecht' && (
            <Rooms
              eventData={eventData}
              rooms={childEventsData}
              changeRoom={changeRoom}
              changeAgendaItem={changeAgendaItem}
            />
          )}
        {(((selectedRoom !== -1 || municipality === 'Utrecht') && childEventsData) ||
          (selectedRoom === -1 && !childEventsData) ||
          (selectedRoom !== -1 && !childEventsData && eventData.agenda_count > 0)) && (
          <RoomDetailView
            speakers={speakers}
            selectedAgendaItem={selectedAgendaItem}
            changeAgendaItem={changeAgendaItem}
            loadEventSpeakers={loadEventSpeakers}
            currentURL={location.pathname + location.search}
            childEventsData={childEventsData}
            selectedRoom={selectedRoom}
            eventData={eventData}
          />
        )}
      </div>
    );
  }
}

export default withRouter(EventTiles);

class Rooms extends React.Component {
  render() {
    const { rooms, eventData, changeRoom, changeAgendaItem } = this.props;

    return (
      <Grid fluid>
        <Row>
          {rooms.map(e => {
            return (
              <Col key={e.id} sm={12} md={6} lg={4}>
                <RoomTile room={e} changeRoom={changeRoom} changeAgendaItem={changeAgendaItem} />
              </Col>
            );
          })}
          <Col key={10} sm={12} md={6} lg={4}>
            <AgendaTile
              publisherAddBtn
              room={eventData}
              tileType={'generic_docs'}
              listStyle={{ maxHeight: 313, minHeight: 313 }}
              extraStyle={{ maxHeight: 539, minHeight: 477 }}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export class RoomDetailView extends React.Component {
  render() {
    const {
      childEventsData,
      selectedRoom,
      selectedAgendaItem,
      changeAgendaItem,
      speakers,
      loadEventSpeakers,
      currentURL,
      eventData,
    } = this.props;

    let room;

    if (!childEventsData) {
      room = eventData;
    } else if (municipality === 'Utrecht') {
      room =
        selectedAgendaItem !== undefined && selectedAgendaItem !== -1
          ? find(childEventsData, { id: selectedAgendaItem })
          : childEventsData[0];
    } else {
      room = find(childEventsData, { id: selectedRoom });
    }

    return (
      <Grid fluid className="room-detail-view">
        <Row>
          <Col sm={12} md={6} lg={4}>
            {childEventsData || eventData.agenda_count > 0 ? (
              municipality === 'Utrecht' ? (
                <UtrechtAgendaList
                  eventData={eventData}
                  agendas={eventData.agenda}
                  showStepper
                  room={eventData}
                  headerColor={'#444'}
                  changeAgendaItem={changeAgendaItem}
                  selectedAgendaItem={selectedAgendaItem}
                />
              ) : (
                <RoomTile
                  room={room}
                  showStepper
                  headerColor={'#444'}
                  changeAgendaItem={changeAgendaItem}
                  selectedAgendaItem={selectedAgendaItem}
                />
              )
            ) : (
              <AgendaTile
                room={room}
                publisherAddBtn
                tileType={'generic_docs'}
                listStyle={{ maxHeight: 313, minHeight: 313 }}
                extraStyle={{ maxHeight: 539, minHeight: 477 }}
              />
            )}
          </Col>
          <Col sm={12} md={6} lg={4}>
            {(childEventsData || (eventData.agenda_count > 0 && !childEventsData)) && (
              <AgendaTile
                tileType={'document'}
                room={
                  municipality === 'Utrecht' &&
                  get(childEventsData, 'length', 0) === eventData.agenda.length
                    ? eventData
                    : room
                }
                selectedAgendaItem={selectedAgendaItem}
              />
            )}
            <AgendaTile
              tileType={'public_dossier'}
              room={
                municipality === 'Utrecht' &&
                get(childEventsData, 'length', 0) === eventData.agenda.length
                  ? eventData
                  : room
              }
              selectedAgendaItem={selectedAgendaItem}
            />
            {(childEventsData || (eventData.agenda_count > 0 && !childEventsData)) && (
              <AgendaTile
                room={room}
                publisherAddBtn
                tileType={'generic_docs'}
                listStyle={{ maxHeight: 313 }}
                extraStyle={{ maxHeight: 539 }}
              />
            )}
          </Col>
          <Col sm={12} md={6} lg={4}>
            <AgendaTile
              tileType={'video'}
              room={
                municipality === 'Utrecht' &&
                get(childEventsData, 'length', 0) === eventData.agenda.length
                  ? eventData
                  : room
              }
              selectedAgendaItem={selectedAgendaItem}
              speakers={speakers}
              loadEventSpeakers={loadEventSpeakers}
              currentURL={currentURL}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
