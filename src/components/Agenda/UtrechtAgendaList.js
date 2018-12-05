import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import ItemMenu from '../OptionMenu/OptionMenu';
import appResources from '../../appResources';
import { getRoomEndTime } from '../../helpers';
import styles from './RoomTile/RoomTile.module.scss';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import { deleteAgendaItem, setAgendaItemModal } from '../../actions/publisherActions';
import cx from 'classnames';

class UtrechtAgendaList extends React.Component {
  stepperPrev(currentIndex) {
    const { eventData, agendas, changeAgendaItem } = this.props;

    if (currentIndex > 1) {
      const agenda = agendas[currentIndex - 2];
      changeAgendaItem(eventData.id, agenda.id);
    }
  }

  stepperNext(currentIndex) {
    const { eventData, agendas, changeAgendaItem } = this.props;

    if (currentIndex < agendas.length) {
      const agenda = agendas[currentIndex];
      changeAgendaItem(eventData.id, agenda.id);
    }
  }

  render() {
    const {
      room,
      agendas,
      showStepper,
      headerColor,
      changeRoom,
      changeAgendaItem,
      selectedAgendaItem,
      eventData,
    } = this.props;

    const menuData = {
      uid: eventData.combined_id,
      type: 'event',
      name: eventData.name,
      date: eventData.start_time,
      id: eventData.id,
      url: document.location.href,
    };

    let selectedAgendaIndex = agendas.indexOf(_.find(agendas, { id: selectedAgendaItem }));
    selectedAgendaIndex = selectedAgendaIndex === -1 ? 1 : selectedAgendaIndex + 1;

    const room_end_time = room.end_time
      ? moment(room.end_time).format('HH:mm')
      : getRoomEndTime(eventData.agenda);

    return (
      <div
        className="room-tile"
        style={{ backgroundColor: agendas.length % 2 === 0 ? '#eee' : '#fff' }}
      >
        <div
          className="room-header"
          style={!showStepper ? { borderBottom: `4px solid ${appResources.basicColor}` } : {}}
        >
          <div className="room-title">
            <ItemMenu optionType={'agenda'} data={menuData} />
            <label
              style={{ color: headerColor ? headerColor : appResources.basicColor }}
              onClick={() => changeRoom && changeRoom(room.id)}
            >
              {room.name}
            </label>
          </div>
          <div
            className="room-sub-title"
            style={{ marginTop: showStepper ? -5 : -10, paddingBottom: showStepper ? 13 : 0 }}
          >
            <label className="room-times">
              {moment(room.start_time).format('HH:mm')} - {room_end_time}
            </label>
            {!showStepper && <label>Agendapunten: {agendas.length}</label>}
          </div>
        </div>

        {showStepper && (
          <div
            className="agenda-list-stepper no-text-select"
            style={{ borderBottom: `4px solid ${appResources.basicColor}` }}
          >
            <i
              onClick={() => this.stepperPrev(selectedAgendaIndex)}
              className="material-icons"
              style={{ background: appResources.basicColor }}
            >
              keyboard_arrow_left
            </i>
            <label>
              <b>Agendapunt(en):</b> {selectedAgendaIndex} van {agendas.length}
            </label>
            <i
              onClick={() => this.stepperNext(selectedAgendaIndex)}
              className="material-icons"
              style={{ background: appResources.basicColor }}
            >
              keyboard_arrow_right
            </i>
          </div>
        )}
        <div
          className={cx(
            'room-agenda-list',
            agendas.length > 4 && !this.props.is_admin && 'bottom-fade',
            this.props.is_admin && styles.adminRoomAgendaList,
          )}
        >
          {agendas.map((a, i) => {
            return (
              <AgendaListItem
                item={a}
                eventData={eventData}
                index={i}
                key={a.id}
                is_admin={this.props.is_admin}
                edit={() => this.props.setAgendaItemModal(true, a.id, room.id)}
                delete={() => this.props.deleteAgendaItem(a.id, this)}
                changeAgendaItem={changeAgendaItem}
                bcolor={
                  selectedAgendaItem === -1 && i === 0
                    ? appResources.agenda_item_selected_color
                    : selectedAgendaItem !== a.id
                      ? i % 2 === 0
                        ? '#eee'
                        : '#fff'
                      : appResources.agenda_item_selected_color
                }
                time={moment(room.start_time).format('HH:mm')}
                timeColor={
                  selectedAgendaItem === -1 && i === 0
                    ? '#fff'
                    : selectedAgendaItem !== a.id
                      ? '#000'
                      : '#fff'
                }
                titleColor={
                  selectedAgendaItem === -1 && i === 0
                    ? '#fff'
                    : selectedAgendaItem !== a.id
                      ? appResources.basicColor
                      : '#fff'
                }
              />
            );
          })}
        </div>
        {this.props.is_admin && (
          <div className={styles.addAgendaItemBtnContainer}>
            <button
              onClick={() => this.props.setAgendaItemModal(true, null, room.id)}
              className={styles.addAgendaItemBtn}
              style={{ background: appResources.in_content_color }}
            >
              Agendapunt toevoegen aan vergadering
            </button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user, singleEvent } = state;
  return {
    is_admin: user.is_admin,
    hasChildEvents: singleEvent.childEventsData.length > 0,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    deleteAgendaItem,
    setAgendaItemModal,
  })(UtrechtAgendaList),
);

class AgendaListItem extends React.Component {
  render() {
    const {
      item,
      bcolor,
      timeColor,
      titleColor,
      changeAgendaItem,
      eventData,
      index,
      is_admin,
    } = this.props;

    const name = item.name ? item.name : item.notes;
    let time = '';

    if (eventData.agenda[index].start_time && eventData.agenda[index].end_time) {
      const start = eventData.agenda[index].start_time.substring(
        0,
        eventData.agenda[index].start_time.lastIndexOf(':'),
      );
      const end = eventData.agenda[index].end_time.substring(
        0,
        eventData.agenda[index].end_time.lastIndexOf(':'),
      );
      time = start.concat(' - ', end);
    }

    return (
      <div
        className="agenda-list-item"
        style={{ backgroundColor: bcolor }}
        onClick={() => changeAgendaItem(eventData.id, item.id)}
      >
        <div>
          <label style={{ color: timeColor }}>{time}</label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label
            onClick={() => changeAgendaItem(eventData.id, item.id)}
            title={name}
            style={{ color: titleColor }}
          >
            {name !== '-' && '-'} {name.length > 100 ? `${name.substring(0, 100)}...` : name}
          </label>
          {is_admin && (
            <ItemMenu
              data={null}
              iconColor={titleColor}
              edit={this.props.edit}
              delete={this.props.delete}
              optionType="agenda_point"
              extraStyle={{
                marginTop: -19,
                display: 'inline-flex',
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
