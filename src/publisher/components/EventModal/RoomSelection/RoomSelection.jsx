/* base */
import React from 'react';
import PropTypes from 'prop-types';
import EventSelectTime from '../EventDate/EventSelectTime';
import CheckBox from '../../../../components/CheckBox/CheckBox';
import { checkDateTimeAvailability } from './Helper';
import CancelIcon from '../../../../icons/cancel.svg';
/* styles */
import styles from './RoomSelection.module.scss';
/* mock */

const propTypes = {
  item: PropTypes.object,
};

const defaultProps = {
  item: {},
};

const dropdownContainerStyle = {
  width: 200,
  margin: '0 20px',
  verticalAlign: 'top',
};

class RoomSelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked,
      timeIsAvailable: true,
      showTimeError: false,
      showStartTime: true,
      showEndTime: true,
      showEventTimeError: false,
      startTime: props.startTime ? props.startTime : props.item.defaultStartTime,
      endTime: props.endTime ? props.endTime : props.item.defaultEndTime,
    };

    this.saveRoom = this.saveRoom.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.eventStartTime !== this.props.eventStartTime ||
      prevProps.eventEndTime !== this.props.eventEndTime
    ) {
      checkDateTimeAvailability(this);
    }
  }

  onButtonClick(type) {
    this.setState({ [type]: !this.state[type] }, () => {
      checkDateTimeAvailability(this);
      if (this.state.checked) {
        this.saveRoom('save');
      }
    });
  }

  onTimeChange(type, value) {
    this.setState({ [type]: value }, () => {
      checkDateTimeAvailability(this);
      if (this.state.checked) {
        this.saveRoom('save');
      }
    });
  }

  onCheckBoxChange() {
    this.setState({ checked: !this.state.checked }, () => {
      this.saveRoom(this.state.checked ? 'save' : 'delete');
      if (this.state.checked && (this.state.showStartTime || this.state.showEndTime)) {
        checkDateTimeAvailability(this);
      }
    });
  }

  deleteRoom() {
    this.saveRoom('delete');
  }

  saveRoom(saveType) {
    const showErrorIcon =
      ((this.state.showStartTime && this.state.showEndTime && this.state.showTimeError) ||
        !this.state.timeIsAvailable) &&
      this.state.checked;
    this.props.saveRoom(
      {
        id: this.props.item.id,
        title: this.props.item.title,
        start_time: this.state.showStartTime ? this.state.startTime : null,
        end_time: this.state.showEndTime ? this.state.endTime : null,
        error: showErrorIcon,
      },
      saveType,
    );
  }

  render() {
    const showErrorIcon =
      (this.state.showStartTime && this.state.showEndTime && this.state.showTimeError) ||
      !this.state.timeIsAvailable;
    return (
      <div>
        <div className={styles.component}>
          <div className={styles.checkbox}>
            <CheckBox
              withLabel
              id={this.props.item.id}
              name={this.props.item.title}
              checked={this.state.checked}
              value={this.props.item.value}
              label={this.props.item.title}
              onChange={this.onCheckBoxChange}
              customStyle={{ fontWeight: 'bold' }}
            />
          </div>
          <div className={styles.btnsContainer}>
            {!this.state.showStartTime && (
              <button
                className={styles.timeButton}
                onClick={() => this.onButtonClick('showStartTime')}
              >
                Kies een begintijd
              </button>
            )}
            {this.state.showStartTime && (
              <EventSelectTime
                disabled={false}
                showError={false}
                hasCheckBox={false}
                value={this.state.startTime}
                dropdownContainerStyle={dropdownContainerStyle}
                onChange={v => this.onTimeChange('startTime', v)}
              />
            )}
            {!this.state.showEndTime && (
              <button
                className={styles.timeButton}
                onClick={() => this.onButtonClick('showEndTime')}
              >
                Kies een eindtijd
              </button>
            )}
            {this.state.showEndTime && (
              <EventSelectTime
                disabled={false}
                showError={false}
                hasCheckBox={false}
                value={this.state.endTime}
                dropdownContainerStyle={dropdownContainerStyle}
                onChange={v => this.onTimeChange('endTime', v)}
              />
            )}
          </div>
        </div>
        {this.state.checked &&
          (this.state.showTimeError || showErrorIcon || this.state.showEventTimeError) && (
            <div className={styles.errorContainer}>
              <img alt="error" src={CancelIcon} width={22} height={22} />
              <span>
                {this.state.showTimeError
                  ? 'Starttijd moet kleiner zijn dan eindtijd'
                  : this.state.showEventTimeError
                    ? 'Zaal tijden mogen de tijden van het Evenement niet overlappen'
                    : !this.state.timeIsAvailable
                      ? 'De locatie is gereserveerd op deze datum en tijd, kies een andere datum en tijd'
                      : ''}
              </span>
            </div>
          )}
      </div>
    );
  }
}

RoomSelection.propTypes = propTypes;
RoomSelection.defaultProps = defaultProps;

export default RoomSelection;
