import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import isEqual from 'lodash/isEqual';
/* components */
import { Col, Row, Grid } from 'react-bootstrap';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import { CircularProgress, IconButton, IconMenu, Menu, MenuItem } from 'material-ui';
import Table from '../../components/Table/Table';
import Pagination from '../../components/general/Pagination';
import ItemMenu from '../../components/OptionMenu/OptionMenu';
import appResources from '../../appResources';
import PageHeader from '../../components/PageHeader/PageHeader';
import PubliekeDossier from '../../components/icons/PubliekeDossier';
/* actions */
import { getAllUsers, deleteAccount } from '../../actions/userActions';
import { setAddUserModal } from '../../actions/publisherActions';
/* styles */
import styles from './UserManagement.module.scss';

class UserManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allUsers: props.allUsers,
      sort_by: 'first_name',
      page: 1,
      page_size: 10,
    };
  }

  componentWillMount() {
    if (!this.props.is_admin || this.props.userType !== 'admin') browserHistory.push('/');
    this.props.getAllUsers();
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Griffie`;
    document.querySelector('#content-wrap').scrollTop = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.allUsers, nextProps.allUsers)) {
      this.setState({ allUsers: nextProps.allUsers });
    }
  }

  setSortBy(value) {
    this.setState({ sort_by: value });
    this.props.getAllUsers(1, value);
  }

  render() {
    const { isLoading, allUsersCount } = this.props;
    const { allUsers, page, page_size, sort_by } = this.state;

    const columns = [
      {
        Header: 'Naam',
        accessor: 'first_name',
        Cell: props => <div className={styles.name}>{props.value}</div>,
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Achternaam',
        accessor: 'last_name',
        Cell: props => <div className={styles.lastName}>{props.value}</div>,
        headerClassName: 'griffie-big-header',
        className: 'griffie-big-cell',
      },
      {
        Header: 'Type gebruiker',
        accessor: 'type',
        Cell: props => <div className={styles.type}>{props.value}</div>,
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Datum toegevoegd',
        accessor: 'date_joined',
        Cell: props => (
          <div className={styles.date}>{moment(props.value).format('DD-MM-YYYY')}</div>
        ),
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div className={styles.options}>
            <ItemMenu
              data={props.original}
              optionType={'griffie'}
              delName={'Verwijder Gebruiker'}
              editName={'Bewerk gebruiker'}
              editFunc={() => this.props.setAddUserModal(true, props.original)}
              removeFunc={() => this.props.deleteAccount(props.original.id)}
            />
          </div>
        ),
        headerClassName: 'avatar-header',
        className: 'avatar-cell',
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
          <MenuItem
            value="first_name"
            primaryText="Naam a/z"
            onClick={() => this.setSortBy('first_name')}
          />
          <MenuItem
            value="-first_name"
            primaryText="Naam z/a"
            onClick={() => this.setSortBy('-first_name')}
          />
          <MenuItem
            value="last_name"
            primaryText="Achternaam a/z"
            onClick={() => this.setSortBy('last_name')}
          />
          <MenuItem
            value="-last_name"
            primaryText="Achternaam z/a"
            onClick={() => this.setSortBy('-last_name')}
          />
          <MenuItem value="type" primaryText="Type a/z" onClick={() => this.setSortBy('type')} />
          <MenuItem value="-type" primaryText="Type z/a" onClick={() => this.setSortBy('-type')} />
          <MenuItem
            value="date_joined"
            primaryText="Datum oplopend"
            onClick={() => this.setSortBy('date_joined')}
          />
          <MenuItem
            value="-date_joined"
            primaryText="Datum aflopend"
            onClick={() => this.setSortBy('-date_joined')}
          />
        </Menu>
      </IconMenu>
    );

    return (
      <div className="folders-page-container">
        {isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Grid fluid>
          <PageHeader icon={<PubliekeDossier />} title="Griffie" />
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div>
                <div className="sort-by-outside">
                  <hr />
                  <div className="sort-by-inside">
                    <b>{allUsersCount}</b> gebruikers {sortByMenu}
                  </div>
                  <hr />
                </div>
                <Table type="agenda" data={allUsers} columns={columns} pageSize={page_size} />
                <Pagination
                  activePage={page}
                  onPageChange={page_num => {
                    this.setState({ page: page_num });
                    this.props.getAllUsers(page_num, this.state.sort_by);
                  }}
                  itemsCount={allUsersCount}
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
    allUsers: user.allUsers,
    allUsersCount: user.allUsersCount,
    is_admin: user.is_admin,
    userType: user.type,
  };
}

export default connect(mapStateToProps, {
  getAllUsers,
  deleteAccount,
  setAddUserModal,
})(UserManagement);
