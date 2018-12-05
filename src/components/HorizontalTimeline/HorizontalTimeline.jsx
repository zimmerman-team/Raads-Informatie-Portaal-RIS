import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import vis from 'vis';
import cx from 'classnames';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Snackbar from 'material-ui/Snackbar/Snackbar';
import { setSnackBar } from '../../actions/generalActions';
import { getTimelineGroup, getItemDetailUrl, getHorizontalTimelineItemStyle } from '../../helpers';
import appResources from '../../appResources';
import styles from './HorizontalTimeline.module.scss';
import '../../../node_modules/vis/dist/vis.css';

const secDay = 86400000;
let options, timeline, _this;

class HorizontalTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counts: [],
      openSnackBar: false,
      items: props.timelineData,
      start: props.start ? props.start : new Date(2000, 1, 1),
      end: moment(props.start).add(7, 'days'),
    };

    _this = this;

    options = {
      width: '100%',
      showMajorLabels: true,
      showCurrentTime: true,
      zoomMin: 86400000,
      zoomable: false,
      start: props.start ? props.start : new Date(2000, 1, 1),
      end: props.end ? props.end : new Date(new Date().getFullYear() + 2, 1, 1),
      type: 'box',
      height: props.height || '180px',
      locale: 'nl',
      verticalScroll: true,
      // horizontalScroll: true,
      zoomKey: 'ctrlKey',
      // hiddenDates: {
      //   start: '2017-04-01 00:00:00',
      //   end: '2017-04-03 00:00:00',
      //   repeat: 'weekly',
      // },
    };

    this.updateData = this.updateData.bind(this);
  }

  updateData(start_date, end_date) {
    const { filters } = this.props;
    const page_size = 500;
    const start = new Date(
      new Date(start_date).getFullYear(),
      new Date(start_date).getMonth(),
      new Date(start_date).getDate(),
    )
      .toISOString()
      .substring(0, 10);
    const end = new Date(
      new Date(end_date).getFullYear(),
      new Date(end_date).getMonth(),
      new Date(end_date).getDate(),
    )
      .toISOString()
      .substring(0, 10);
    const search_text = _.filter(filters, { type: 'search' })
      .map(f => f.value)
      .join();
    const typeParameter = _.filter(filters, { type: 'type' });

    const combinedUrl = `${
      appResources.backendUrl
    }combined/?start_date=${start}&end_date=${end}&page_size=${page_size}&item_type=${
      typeParameter.length > 0 ? typeParameter.value : ''
    }&q=${search_text.trim()}`;

    axios
      .get(combinedUrl)
      .then(response => {
        const items = response.data.results.map(i => {
          return {
            id: i.item_id,
            content: i.name.length > 50 ? `${i.name.substring(0, 35)}...` : i.name,
            title: i.name,
            start: i.date.substring(0, 10),
            has_content: i.has_content,
            link: getItemDetailUrl(i.item_type, i.item_id),
            style:
              i.has_content !== false
                ? getHorizontalTimelineItemStyle(i.item_type)
                : `border-radius: 15px;background-color: ${
                    appResources.emptyEventColor
                  };border-color: ${appResources.emptyEventColor};cursor: pointer;color: ${
                    appResources.darkGreyTextColor
                  };`,
            group: getTimelineGroup(i.item_type),
          };
        });
        _this.setTimelineData(items, start, end);
        _this.setState({
          items,
        });
      })
      .catch(error => {});
  }

  getGroups() {
    const result = [];
    const groups = appResources.timelineGroups;
    const muniItemTypes = appResources.documentTypes;
    for (let i = 0; i < groups.length; i++) {
      for (let x = 0; x < muniItemTypes.length; x++) {
        if (groups[i].content === muniItemTypes[x].label) {
          result.push(groups[i]);
        }
      }
    }
    return result;
  }

  setTimelineData(items, start, end) {
    timeline.setItems(items);
    // timeline.setWindow(start, end);
  }

  componentDidMount() {
    this.updateData(moment().subtract(3, 'days'), moment().add(3, 'days'));
    const { start, end } = this.state;
    const date = new Date();
    date.setHours(0);
    const items = this.updateData(start, end);
    const container = document.getElementById('timeline');

    if (window.innerWidth > 768) {
      options.moveable = true;
      options.start = start;
      options.end = end;
    } else {
      options.moveable = false;
      options.start = date;
      options.end = date;
    }

    timeline = new vis.Timeline(container, items, options);
    timeline.setWindow(start, end);
    if (window.innerWidth > 768) {
      const groups = this.getGroups();
      timeline.setGroups(groups);
    }
    timeline.on('click', properties => {
      if (properties.what === 'item') {
        const item = _.find(_this.state.items, { id: properties.item });
        if (item.has_content || item.group !== 1) {
          browserHistory.push(item.link);
        } else {
          _this.setState({
            openSnackBar: true,
            selectedItemLink: item.link,
          });
        }
      }
    });
    timeline.on('rangechanged', properties => {
      if (properties.byUser) {
        _this.updateData(properties.start, properties.end);
      }
    });
  }

  areFiltersSame(prevFilters, thisFilters) {
    let result = true;
    if (prevFilters.length !== thisFilters.length) {
      for (let i = 0; i < prevFilters.length; i++) {
        for (let x = 0; x < thisFilters.length; x++) {
          if (
            prevFilters[i].type !== thisFilters[x].type &&
            prevFilters[i].id !== thisFilters[x].id
          ) {
            result = false;
          }
        }
      }
    } else {
      return false;
    }
    return result;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.goBackToToday < this.props.goBackToToday) {
      this.updateData(moment().subtract(3, 'days'), moment().add(3, 'days'));
      timeline.setWindow(moment().subtract(3, 'days'), moment().add(3, 'days'));
    }
  }

  move(type, days) {
    const range = timeline.getWindow();
    const interval = secDay * days;

    const win =
      type === '+'
        ? { start: range.start.valueOf() + interval, end: range.end.valueOf() + interval }
        : { start: range.start.valueOf() - interval, end: range.end.valueOf() - interval };

    const dates = {
      start: range.start.valueOf() - interval,
      end: range.end.valueOf() + secDay * 3,
    };

    this.updateData(dates.start, dates.end);
    timeline.setWindow(win);
  }

  render() {
    return (
      <div>
        <div id="timeline" />
        <div className={styles.timelineBtnsContainer}>
          <div style={{ float: 'left' }}>
            <button
              title={'maand'}
              className={cx(styles.timelineNavBtn, styles.big)}
              onClick={() => this.move('-', 30)}
            >
              {'<<<'}
            </button>
            <button
              title={'week'}
              className={cx(styles.timelineNavBtn, styles.medium)}
              onClick={() => this.move('-', 7)}
            >
              {'<<'}
            </button>
            <button
              title={'daag'}
              className={cx(styles.timelineNavBtn, styles.small)}
              onClick={() => this.move('-', 1)}
            >
              {'<'}
            </button>
          </div>
          <div style={{ float: 'right' }}>
            <button
              title={'daag'}
              className={cx(styles.timelineNavBtn, styles.small)}
              onClick={() => this.move('+', 1)}
            >
              {'>'}
            </button>
            <button
              title={'week'}
              className={cx(styles.timelineNavBtn, styles.medium)}
              onClick={() => this.move('+', 7)}
            >
              {'>>'}
            </button>
            <button
              title={'maand'}
              className={cx(styles.timelineNavBtn, styles.big)}
              onClick={() => this.move('+', 30)}
            >
              {'>>>'}
            </button>
          </div>
        </div>
        <Snackbar
          action="Open"
          autoHideDuration={10000}
          open={this.state.openSnackBar}
          message="Dit onderdeel bevat geen data"
          onRequestClose={() => this.setState({ openSnackBar: false })}
          onActionClick={() => browserHistory.push(this.state.selectedItemLink)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { filters } = state;
  return {
    filters,
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
})(HorizontalTimeline);
