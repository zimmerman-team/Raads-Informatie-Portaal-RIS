import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import shortid from 'shortid';
import TimePicker from 'material-ui/TimePicker';
import CheckBox from '../../../../components/CheckBox/CheckBox';
import styles from './EventDate.module.scss';
import CancelIcon from '../../../../icons/cancel.svg';
// import mock from './EventDate.mock';

const propTypes = {
  value: PropTypes.string,
  fullWidth: PropTypes.bool,
};

const defaultProps = {
  value: '00:00',
  fullWidth: false,
};

class EventTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      time: new Date(`01/01/2001 ${props.value}:00`),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, time) {
    this.setState({ time });
    this.props.onChange(moment(time).format('HH:mm'));
  }

  render() {
    const disabled = this.state.disabled && !this.props.required && this.props.hasCheckBox;
    return (
      <div className={cx(styles.container, this.props.fullWidth && styles.fullWidthContainer)}>
        {this.props.title && (
          <div className={styles.title}>
            {!this.props.required && (
              <CheckBox
                withLabel
                id={this.props.title}
                name={this.props.title}
                value={this.props.title}
                label={this.props.title}
                checked={!this.state.disabled}
                onChange={() => {
                  this.setState({ disabled: !disabled });
                  this.props.extraCheckboxAction(!disabled);
                }}
              />
            )}
            {this.props.required && (
              <React.Fragment>
                {this.props.title}
                <span className={styles.asterisk}>*</span>
              </React.Fragment>
            )}
          </div>
        )}
        {!this.props.fullWidth && (
          <div
            style={this.props.dropdownContainerStyle}
            className={cx(
              styles.dropdownContainer,
              disabled && styles.disabledDropdownContainer,
              styles.datePickerMd,
            )}
          >
            <TimePicker
              format="24hr"
              okLabel="OK"
              id={shortid.generate()}
              cancelLabel="Annuleren"
              onChange={this.handleChange}
              className={styles.datePicker}
              defaultTime={this.state.time}
            />
          </div>
        )}
        {this.props.fullWidth && (
          <React.Fragment>
            <TimePicker
              format="24hr"
              id={shortid.generate()}
              onChange={this.handleChange}
              className={cx(styles.datePicker, disabled && styles.disabledDropdownContainer)}
              defaultTime={this.state.time}
            />
            {this.props.showError && (
              <div className={styles.errorContainer}>
                <img alt="error" src={CancelIcon} width={22} height={22} />
                <span>Start tijd moet kleiner zijn dan eindtijd</span>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

EventTime.propTypes = propTypes;
EventTime.defaultProps = defaultProps;

export default EventTime;
