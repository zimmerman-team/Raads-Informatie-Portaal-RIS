import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import shortid from 'shortid';
import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';
import styles from './EventDate.module.scss';
import CancelIcon from '../../../../icons/cancel.svg';
// import mock from './EventDate.mock';

let DateTimeFormat;

if (areIntlLocalesSupported(['nl'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/nl');
}

class EventSelectDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(props.initDate),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, date) {
    this.setState({ date });
    this.props.onChange('date', moment(date));
  }

  render() {
    return (
      <div className={cx(styles.container, styles.fullWidthContainer)}>
        <div className={styles.title}>
          {this.props.title}
          {this.props.required && <span className={styles.asterisk}>*</span>}
        </div>
        <DatePicker
          locale="nl"
          okLabel="OK"
          cancelLabel="Annuleren"
          DateTimeFormat={DateTimeFormat}
          id={shortid.generate()}
          onChange={this.handleChange}
          defaultDate={this.state.date}
          className={styles.datePicker}
          formatDate={date => moment(date).format('DD - MM - YYYY')}
        />
        {this.props.showError && (
          <div className={styles.errorContainer}>
            <img alt="error" src={CancelIcon} width={22} height={22} />
            <span>
              De locatie is gereserveerd op deze datum en tijd, kies een andere datum en tijd
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default EventSelectDate;
