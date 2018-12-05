import React from 'react';
import { RadioButton, RadioButtonGroup, DatePicker, Checkbox } from 'material-ui';
import Collapse from 'react-collapse';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutline from '@material-ui/icons/CheckBoxOutlineBlank';
import moment from 'moment';
import _ from 'lodash';
import areIntlLocalesSupported from 'intl-locales-supported';

let DateTimeFormat;
if (areIntlLocalesSupported(['nl', 'nl-NL'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/nl');
  require('intl/locale-data/jsonp/nl-NL');
}

class FilterExpandableBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      selectedValue: props.type !== 'date' ? props.selectedValue : 'none',
      startDate: '01-01-1900',
      endDate: moment().add(1, 'years'),
    };

    this.getFilter = this.getFilter.bind(this);
    this.radioChange = this.radioChange.bind(this);
    this.checkboxClick = this.checkboxClick.bind(this);
    this.startDateChange = this.startDateChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
  }

  getFilter(value, label = '') {
    const { type } = this.props;
    let filter = {};
    if (type === 'date') {
      if (value === 'custom_date_range') {
        filter = {
          type,
          value: `start_date=${moment(this.state.startDate).format('YYYY-MM-DD')}&end_date=${moment(
            this.state.endDate,
          ).format('YYYY-MM-DD')}`,
          label: `Van ${moment(this.state.startDate).format('DD-MM-YYYY')} tot ${moment(
            this.state.endDate,
          ).format('DD-MM-YYYY')}`,
        };
      } else {
        filter = {
          type,
          value: `start_date=${value[0].format('YYYY-MM-DD')}&end_date=${value[1].format(
            'YYYY-MM-DD',
          )}`,
          label,
        };
      }
    }
    if (type === 'item_type') {
      filter = {
        type,
        value,
        label: `Type: ${label}`,
      };
    }
    return filter;
  }

  startDateChange(e, date) {
    this.setState({ startDate: date }, () => {
      const filter = this.getFilter('custom_date_range');
      this.props.setFilter(filter.type, filter.value, filter.label);
    });
  }

  endDateChange(e, date) {
    this.setState({ endDate: date }, () => {
      const filter = this.getFilter('custom_date_range');
      this.props.setFilter(filter.type, filter.value, filter.label);
    });
  }

  radioChange(e, obj) {
    this.setState({ selectedValue: obj });
    if (obj.value !== 'custom_date_range') {
      const filter = this.getFilter(obj.value, obj.label);
      this.props.setFilter(filter.type, filter.value, filter.label);
    }
  }

  checkboxClick(value, obj, type) {
    const { filters, setFilter, removeFilter } = this.props;
    const foundSameFilter = _.find(filters, f => {
      return f.type === type && f.value === obj.value;
    });
    if (foundSameFilter === undefined) {
      const filter = this.getFilter(obj.value, obj.label);
      setFilter(filter.type, filter.value, filter.label);
    } else {
      removeFilter(foundSameFilter.type, foundSameFilter.id);
    }
  }

  formatDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  getSelectedFilter(filters, type) {
    const result = filters.map(f => {
      if (type === f.type) {
        return f.value;
      }
      return undefined;
    });
    return result;
  }

  render() {
    const { expanded, selectedValue } = this.state;
    const { filters, text, options, type } = this.props;
    const datePicker1 = (
      <DatePicker
        className="datepicker"
        hintText="begin datum"
        container="inline"
        formatDate={this.formatDate}
        onChange={this.startDateChange}
        cancelLabel="ANNULEREN"
        DateTimeFormat={DateTimeFormat}
        locale="nl"
      />
    );
    const datePicker2 = (
      <DatePicker
        className="datepicker"
        hintText="eind datum"
        container="inline"
        formatDate={this.formatDate}
        onChange={this.endDateChange}
        cancelLabel="ANNULEREN"
        DateTimeFormat={DateTimeFormat}
        locale="nl"
      />
    );
    const selectedFilters = this.getSelectedFilter(filters, type);
    const optionComponents = options.map((o, i) => {
      if (type === 'date') {
        return (
          <RadioButton
            key={i}
            label={o.label}
            value={o.obj}
            onClick={() => {
              const foundSameFilter = _.find(filters, f => {
                return f.type === type && f.label === o.label;
              });
              if (this.state.selectedValue.key === i && foundSameFilter !== undefined) {
                this.setState({ selectedValue: 'none' });
                this.props.removeFilter(this.props.type, foundSameFilter.id);
              }
            }}
            checkedIcon={<CheckBoxIcon />}
            uncheckedIcon={<CheckBoxOutline />}
          />
        );
      }
      return (
        <Checkbox
          key={i}
          label={o.label}
          checkedIcon={<CheckBoxIcon />}
          uncheckedIcon={<CheckBoxOutline />}
          onCheck={(e, value) => this.checkboxClick(value, o.obj, type)}
          defaultChecked={
            _.find(selectedFilters, f => {
              return f === o.obj.value;
            }) !== undefined
          }
        />
      );
    });
    return (
      <div className="filter-expandable-block">
        <label className="filter-name" onClick={() => this.setState({ expanded: !expanded })}>
          {text}
          <i className="material-icons">{expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
        </label>
        <Collapse isOpened={expanded} style={{ marginTop: 10 }}>
          <div className="options-div">
            {type === 'date' && (
              <RadioButtonGroup
                name={`${text}-radio`}
                valueSelected={selectedValue}
                onChange={this.radioChange}
              >
                {optionComponents}
              </RadioButtonGroup>
            )}
            {type !== 'date' && optionComponents}
          </div>
          {selectedValue.value === 'custom_date_range' && (
            <div>
              {datePicker1}
              {datePicker2}
            </div>
          )}
        </Collapse>
      </div>
    );
  }
}

export default FilterExpandableBlock;
