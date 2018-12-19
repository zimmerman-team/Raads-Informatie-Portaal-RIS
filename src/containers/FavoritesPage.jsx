import React from 'react';
import sortBy from 'lodash/sortBy';
import { connect } from 'react-redux';
import Table from '../components/Table/Table';
import Pagination from '../components/general/Pagination';
import { Col, Row, Grid } from 'react-bootstrap';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import { CircularProgress, IconMenu, IconButton, MenuItem, Menu } from 'material-ui';
import { FavoriteTitleCell, GeneralTitleCell } from '../components/Table';
import { isLoggedIn } from '../helpers';
import appResources from '../appResources';
import { loadFavorites, removeFavorite, loadUserDossiers } from '../actions/userActions';
import { setDossierModal, setActivePage } from '../actions/generalActions';
import { genericSortBy } from '../helpers';
import ItemMenu from '../components/OptionMenu/OptionMenu';
import HeaderIcon from '../components/icons/Favorite';
import PageHeader from '../components/PageHeader/PageHeader';
import { getFormattedType } from '../helpers';

class FavoritesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      isLoading: false,
      favorites: this.props.favorites ? this.props.favorites : [],
      resultsCount: sessionStorage.getItem('favorites_count'),
      openSnackbar: false,
      messageSnackbar: '',
      sort_by: '-last_modified',
      item_id_to_new_dossier: 0,
    };

    this.setSortBy = this.setSortBy.bind(this);
    this.setSnackbar = this.setSnackbar.bind(this);
    this._addToDossier = this._addToDossier.bind(this);
    this.handleOpenNewDossier = this.handleOpenNewDossier.bind(this);
  }

  componentWillMount() {
    if (isLoggedIn()) {
      this.props.loadFavorites();
      this.props.loadUserDossiers();
    }
  }

  handleOpenNewDossier(itemID) {
    this.props.setDossierModal(itemID);
  }

  _addToDossier(dossierID, itemID) {
    this.props.addToDossier(dossierID, itemID);
    this.onPageChange = this.onPageChange.bind(this);
    this.getOrderedFavorites = this.getOrderedFavorites.bind(this);
  }

  componentDidMount() {
    const { page, page_size } = this.state;
    window.addEventListener('resize', this.resize);
    document.title = `${appResources.documentTitle} | Mijn Favorieten`;
    document.querySelector('#content-wrap').scrollTop = 0;
    this.props.loadFavorites(page, page_size);
  }

  setSortBy(value) {
    this.setState({ sort_by: value, favorites: genericSortBy(value, this.state.favorites) });
  }

  setSnackbar(message) {
    this.setState({
      openSnackbar: true,
      messageSnackbar: message,
    });
  }

  onPageChange(page) {
    const { page_size } = this.state;
    this.setState({ page }, () => {
      this.props.loadFavorites(page, page_size);
    });
  }

  getOrderedFavorites() {
    const { sort_by } = this.state;
    const { favorites } = this.props;
    const sortField = sort_by[0] === '-' ? sort_by.substring(1) : sort_by;

    let result = sortBy(favorites, sortField);
    result = sort_by[0] !== '-' ? result : result.reverse();
    return result;
  }

  render() {
    const { isLoading, favoriteCount } = this.props;
    const { sort_by, page, page_size } = this.state;

    const columns = [
      {
        Header: 'Type',
        accessor: 'type',

        Cell: props => (
          <GeneralTitleCell
            paddingTop={8}
            value={getFormattedType(props.value)}
            hasDescription={false}
          />
        ),
        headerClassName: 'favorite-generic-header',
        className: 'favorite-generic-cell',
      },
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <FavoriteTitleCell data={props} />,
        headerClassName: 'favorite-big-header',
        className: 'favorite-big-cell',
      },
      {
        Header: 'Evenement datum',
        accessor: 'event_date',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'favorite-generic-header',
        className: 'favorite-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'favorite-generic-header',
        className: 'favorite-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div style={{ paddingTop: 10, marginBottom: -10 }}>
            <ItemMenu optionType={'fav'} data={props} />
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
            value="created_at"
            primaryText="Publicatie datum oplopend"
            onClick={() => this.setSortBy('created_at')}
          />
          <MenuItem
            value="-created_at"
            primaryText="Publicatie datum aflopend"
            onClick={() => this.setSortBy('-created_at')}
          />
          <MenuItem
            value="last_modified"
            primaryText="Wijzigings datum oplopend"
            onClick={() => this.setSortBy('last_modified')}
          />
          <MenuItem
            value="-last_modified"
            primaryText="Wijzigings datum aflopend"
            onClick={() => this.setSortBy('-last_modified')}
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
          <PageHeader
            icon={<HeaderIcon />}
            title="Mijn Favorieten"
            description="In Mijn Favorieten kunt u Documentatie, Dossiers en Agenda’s volgen om op de hoogte te blijven van besluitvorming omtrent voor u relevante onderwerpen."
          />
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside">
                <hr />
                <div className="sort-by-inside">
                  <b>{favoriteCount}</b> Favorieten {sortByMenu}
                </div>
                <hr />
              </div>
              <div>
                <Table columns={columns} pageSize={page_size} data={this.getOrderedFavorites()} />
                <Pagination
                  activePage={page}
                  itemsCount={favoriteCount}
                  color={appResources.in_content_color}
                  onPageChange={page => this.props.setActivePage(page)}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { user } = state;
  return {
    favorites: user.favorites,
    isLoading: user.isLoading,
    favoriteCount: user.favoriteCount,
  };
}

export default connect(mapStateToProps, {
  loadFavorites,
  removeFavorite,
  setActivePage,
  setDossierModal,
  loadUserDossiers,
})(FavoritesPage);
