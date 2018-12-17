import React from 'react';
import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import moment from 'moment';
import { connect } from 'react-redux';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import { Col, Row, Grid } from 'react-bootstrap';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import { CircularProgress, IconMenu, IconButton, MenuItem, Menu, RaisedButton } from 'material-ui';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/general/Pagination';
import { GeneralTitleCell, TitleCell } from '../../../components/Table';
import appResources from '../../../appResources';
import { getFormattedType, getItemDetailUrl } from '../../../helpers';
import {
  loadNotifications,
  deleteNotifications,
  setNotificationStatus,
} from '../../../actions/userActions';
import HeaderIcon from '../../../components/icons/Notification';
import PageHeader from '../../../components/PageHeader/PageHeader';
import styles from './MyNotifications.module.scss';

class MyNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort_by: '-date_added',
      checked: [],
    };

    this.onToggle = this.onToggle.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onDeleteCheck = this.onDeleteCheck.bind(this);
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Mijn notificaties`;
    document.querySelector('#content-wrap').scrollTop = 0;
    this.props.loadNotifications();
  }

  onPageChange(page) {
    const { page_size } = this.state;
    this.setState({ page }, () => {
      this.props.loadUserDossiers(page, page_size);
    });
  }

  setSortBy(value) {
    this.setState({ sort_by: value });
  }

  onToggle(value, item_id) {
    this.props.setNotificationStatus(item_id, value);
  }

  onDeleteCheck(isChecked, item_id) {
    const array = this.state.checked;
    if (isChecked) {
      array.push(item_id);
    } else {
      remove(array, a => {
        return a === item_id;
      });
    }
    this.setState({ checked: array });
  }

  onDeletePressed() {
    this.props.deleteNotifications(this.state.checked);
    this.setState({ checked: [] });
  }

  getFormattedData(items) {
    const { sort_by } = this.state;
    const sortField = sort_by[0] === '-' ? sort_by.substring(1) : sort_by;
    const noties = items.map(i => {
      return {
        status: i.active,
        title: {
          title: i.name,
          description: '',
          link: getItemDetailUrl(i.item_type, i.item_origin_id, i.parent_id),
        },
        name: i.name,
        date_added: moment(i.date_added).format('DD-MM-YYYY'),
        created_at: moment(i.date).format('DD-MM-YYYY'),
        last_modified: moment(i.last_modified).format('DD-MM-YYYY'),
        url: getItemDetailUrl(i.item_type, i.item_origin_id, i.parent_id),
        type: getFormattedType(i.item_type),
        options: {
          combined_id: i.id,
          type: i.item_type,
          origin_id: i.item_origin_id,
        },
      };
    });
    let result = sortBy(noties, sortField);
    result = sort_by[0] !== '-' ? result : result.reverse();
    return result;
  }

  render() {
    const { isLoading } = this.props;
    const { sort_by, page, checked } = this.state;

    const columns = [
      {
        Header: 'Actief',
        accessor: 'activate',
        Cell: props => (
          <div className={styles.toggle}>
            <Toggle
              label={''}
              disabled={false}
              defaultToggled={props.original.status}
              onToggle={(e, value) => this.onToggle(value, props.original.options.combined_id)}
            />
          </div>
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
      {
        Header: 'Naam',
        accessor: 'title',
        Cell: props => <TitleCell data={props} marginTop={5} />,
        headerClassName: 'notif-big-header',
        className: 'notif-big-cell',
      },
      {
        Header: 'Datum Toegevoegd',
        accessor: 'date_added',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'notif-generic-header',
        className: 'notif-generic-cell',
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'notif-generic-header',
        className: 'notif-generic-cell',
      },
      {
        Header: 'Verwijder',
        accessor: 'delete',
        Cell: props => (
          <div className={styles.checkbox}>
            <Checkbox
              style={{ width: '0', margin: 'auto', marginLeft: '38%' }}
              onCheck={(e, value) => this.onDeleteCheck(value, props.original.options.combined_id)}
            />
          </div>
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

    const sortByMenu = (
      <IconMenu
        className="sort-by-menu"
        iconButtonElement={
          <IconButton>
            <ContentFilter color={appResources.in_content_color} />
          </IconButton>
        }
      >
        <Menu
          value={sort_by}
          selectedMenuItemStyle={{ color: appResources.in_content_color }}
          desktop
        >
          <MenuItem value="name" primaryText="Naam a/z" onClick={() => this.setSortBy('name')} />
          <MenuItem
            value="-name"
            primaryText="Naam z/a"
            onClick={() => this.setSortBy('-name')}
          />
          <MenuItem
            value="date_added"
            primaryText="Datum toegevoegd oplopend"
            onClick={() => this.setSortBy('date_added')}
          />
          <MenuItem
            value="-date_added"
            primaryText="Datum toegevoegd aflopend"
            onClick={() => this.setSortBy('-date_added')}
          />
        </Menu>
      </IconMenu>
    );

    return (
      <div className="folders-page-container">
        <Grid fluid>
          <PageHeader
            icon={<HeaderIcon />}
            title="Mijn Notificaties"
            description="Hier kunt u uw notificaties beheren."
          />
          {isLoading && (
            <div className="general-loader">
              <CircularProgress size={80} thickness={5} />
            </div>
          )}
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside" style={{ marginLeft: 0 }}>
                <hr />
                <div>
                  <div
                    className="sort-by-inside"
                    style={{ marginLeft: '0', display: 'inline-block' }}
                  >
                    <b>{this.props.notifications.length}</b> Notificaties {sortByMenu}
                  </div>
                  {checked.length > 0 && (
                    <RaisedButton
                      id="my-notifications-delete-btn"
                      onClick={() => this.onDeletePressed()}
                      label={'Verwijderen'}
                      style={{ ...appResources.deleteButtonStyle, marginTop: '-1px' }}
                      backgroundColor={'#b91e2f'}
                      labelStyle={appResources.normalWhiteLabel}
                    />
                  )}
                </div>
                <hr />
              </div>
              <div>
                <Table
                  pageSize={10}
                  columns={columns}
                  data={this.getFormattedData(this.props.notifications)}
                />
                <Pagination
                  activePage={page}
                  itemsCount={this.props.notifications.length}
                  onPageChange={this.onPageChange}
                  color={appResources.in_content_color}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    notifications: user.notifications,
  };
}

export default connect(mapStateToProps, {
  loadNotifications,
  deleteNotifications,
  setNotificationStatus,
})(MyNotifications);
