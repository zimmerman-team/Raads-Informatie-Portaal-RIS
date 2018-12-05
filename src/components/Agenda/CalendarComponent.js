import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/nl';

require('../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css');

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class CalendarComponent extends React.Component {
  render() {
    return <BigCalendar culture="nl-NL" {...this.props} />;
  }
}

export default CalendarComponent;
