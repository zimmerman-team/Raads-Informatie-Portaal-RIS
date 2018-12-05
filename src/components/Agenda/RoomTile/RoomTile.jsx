import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import find from 'lodash/find';
import moment from 'moment';
import cx from 'classnames';
import ItemMenu from '../../OptionMenu/OptionMenu';
import appResources from '../../../appResources';
import { loadUserDossiers } from '../../../actions/userActions';
import { setAgendaItemModal, deleteAgendaItem } from '../../../actions/publisherActions';
import { getParameterByName, getRoomEndTime } from '../../../helpers';
import styles from './RoomTile.module.scss';

class RoomTile extends React.Component {
  componentWillMount() {
    if (this.props.dossiers.length === 0) this.props.loadUserDossiers();
  }

  stepperPrev(currentIndex) {
    const { room, changeAgendaItem } = this.props;

    if (currentIndex > 1) {
      const agenda = room.agenda[currentIndex - 2];
      changeAgendaItem(room.id, agenda.id);
    }
  }

  stepperNext(currentIndex) {
    const { room, changeAgendaItem } = this.props;

    if (currentIndex < room.agenda.length) {
      const agenda = room.agenda[currentIndex];
      changeAgendaItem(room.id, agenda.id);
    }
  }

  render() {
    const {
      room,
      showStepper,
      headerColor,
      changeRoom,
      changeAgendaItem,
      selectedAgendaItem,
    } = this.props;

    const menuData = {
      uid: room.combined_id,
      type: 'event',
      name: room.name,
      date: room.start_time,
      id: room.id,
      url: document.location.href,
    };

    let selectedAgendaIndex = room.agenda.indexOf(find(room.agenda, { id: selectedAgendaItem }));
    selectedAgendaIndex = selectedAgendaIndex === -1 ? 1 : selectedAgendaIndex + 1;

    const room_end_time = getRoomEndTime(room.agenda);

    return (
      <div
        className="room-tile"
        style={{ backgroundColor: room.agenda_count % 2 === 0 ? '#eee' : '#fff' }}
      >
        <div
          className="room-header"
          style={!showStepper ? { borderBottom: `4px solid ${appResources.basicColor}` } : {}}
        >
          <div className="room-title">
            <ItemMenu
              data={menuData}
              optionType="agenda_room"
              favoriteMenuItemType={'Add'}
              dossiers={this.props.dossiers}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              targetOrigin={{ vertical: 'top', horizontal: 'left' }}
            />
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
              {room.start_time && moment(room.start_time).format('HH:mm')}
              {(room.end_time || room_end_time) && ' - '}
              {room.end_time ? moment(room.end_time).format('HH:mm') : room_end_time}
            </label>
            {!showStepper && (
              <label className="room-agendas-count">Agendapunten: {room.agenda.length}</label>
            )}
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
              <b>Agendapunt(en):</b> {selectedAgendaIndex} van {room.agenda.length}
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
            room.agenda_count > 4 && !this.props.is_admin && 'bottom-fade',
            getParameterByName('zaal') &&
              this.props.is_admin &&
              !this.props.hasChildEvents &&
              styles.adminRoomAgendaList,
            getParameterByName('zaal') &&
              this.props.is_admin &&
              this.props.hasChildEvents &&
              styles.adminRoomAgendaList,
            !getParameterByName('zaal') &&
              this.props.is_admin &&
              !this.props.hasChildEvents &&
              styles.adminRoomAgendaList,
            !getParameterByName('zaal') &&
              this.props.is_admin &&
              this.props.hasChildEvents &&
              styles.adminChildEventAgendaList,
          )}
          style={
            !getParameterByName('zaal') && this.props.hasChildEvents
              ? { minHeight: 410, maxHeight: 410 }
              : {}
          }
        >
          {// _.orderBy(room.agenda, 'order', 'asc').map((a, i) => {
          room.agenda.map((a, i) => {
            return (
              <AgendaListItem
                item={a}
                index={i}
                key={a.id}
                is_admin={this.props.is_admin}
                edit={() => this.props.setAgendaItemModal(true, a.id, room.id, a.order)}
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
    dossiers: user.dossiers,
    hasChildEvents: singleEvent.childEventsData.length > 0,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    loadUserDossiers,
    deleteAgendaItem,
    setAgendaItemModal,
  })(RoomTile),
);

class AgendaListItem extends React.Component {
  render() {
    const { item, bcolor, timeColor, titleColor, changeAgendaItem, is_admin } = this.props;

    const start_time =
      item.start_time !== null && item.start_time !== undefined ? item.start_time.substr(0, 5) : '';
    const end_time =
      item.end_time !== null && item.end_time !== undefined ? item.end_time.substr(0, 5) : '';

    // start_time = start_time === '' && item.order === 1 ? time : start_time;

    const griffier = item.griffier
      ? `${item.griffier.first_name} ${item.griffier.last_name}`
      : null;
    const medewerker = item.medewerker
      ? `${item.medewerker.first_name} ${item.medewerker.last_name}`
      : null;

    return (
      <div
        className="agenda-list-item"
        style={{ backgroundColor: bcolor }}
        onClick={() => changeAgendaItem(item.event, item.id)}
      >
        <div>
          <label style={{ color: timeColor }}>
            {start_time} {start_time !== '' && end_time !== '' ? '-' : ''} {end_time}
            {griffier &&
              (start_time !== '' || end_time !== '') && (
                <span className={styles.verticalDivider}>|</span>
              )}
            {griffier && `Griffier: ${griffier}`}
            {medewerker &&
              (start_time !== '' || end_time !== '' || griffier) && (
                <span className={styles.verticalDivider}>|</span>
              )}
            {medewerker && `Medewerker: ${medewerker}`}
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label
            onClick={() => changeAgendaItem(item.event, item.id)}
            title={item.notes}
            style={{ color: titleColor }}
          >
            {item.order !== null && item.order} {item.notes[0] !== '-' && '-'}{' '}
            {item.notes.length > 100 ? `${item.notes.substring(0, 100)}...` : item.notes}
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
