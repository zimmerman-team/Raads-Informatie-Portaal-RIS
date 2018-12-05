import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import find from 'lodash/find';
import remove from 'lodash/remove';
import ItemMenu from '../../components/OptionMenu/OptionMenu';
import Table from '../../components/Table/Table';
import Pagination from '../../components/general/Pagination';
import Search from './components/Search';
import { Col, Row, Grid } from 'react-bootstrap';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import { CircularProgress, IconMenu, IconButton, MenuItem, Menu, Chip } from 'material-ui';
import { DossierTitleCell } from '../../components/Table/index';
import classNames from 'classnames';
import appResources from '../../appResources';
import PageHeader from '../../components/PageHeader/PageHeader';
import HeaderIcon from '../../components/icons/PubliekeDossier';
import { loadPublicDossiers } from '../../actions/folderActions';
import {
  setPublicDossierPublishStatus,
  deletePublicDossier,
  setPublicDossierModal,
} from '../../actions/publisherActions';
import Toggle from 'material-ui/Toggle';
import { browserHistory } from 'react-router';
import { share } from '../../helpers';

class PublicFolders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      chips: [],
      page_size: 10,
      sort_by: '-last_modified',
    };

    this.addChip = this.addChip.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.unsetFocus = this.unsetFocus.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Publieke dossiers`;
    document.querySelector('#content-wrap').scrollTop = 0;
    this.props.loadPublicDossiers();
  }

  setFocus() {
    this.setState({ focused: true });
  }

  unsetFocus() {
    this.setState({ focused: false });
  }

  addChip(chip) {
    const { page, page_size, sort_by } = this.state;
    const chips = this.state.chips;
    if (
      find(chips, c => {
        return c === chip;
      }) === undefined
    ) {
      chips.push(chip);
      this.setState({ chips }, () => {
        const q = chips.join(',');
        this.props.loadPublicDossiers(page, page_size, sort_by, q);
      });
    }
  }

  removeChip(chip) {
    const { page, page_size, sort_by } = this.state;
    const chips = this.state.chips;
    remove(chips, c => {
      return c === chip;
    });
    this.setState({ chips }, () => {
      const q = chips.join(',');
      this.props.loadPublicDossiers(page, page_size, sort_by, q);
    });
  }

  onPageChange(page) {
    this.setState({ page }, () => {
      this.props.loadPublicDossiers(
        this.state.page,
        this.state.page_size,
        this.state.sort_by,
        this.state.chips.join(','),
      );
    });
  }

  setSortBy(value) {
    this.setState({ sort_by: value }, () => {
      this.props.loadPublicDossiers(
        this.state.page,
        this.state.page_size,
        this.state.sort_by,
        this.state.chips.join(','),
      );
    });
  }

  onToggle(value, id) {
    this.props.setPublicDossierPublishStatus(id, value);
  }

  render() {
    const { isLoading } = this.props;
    const { sort_by, focused, page, page_size, chips } = this.state;

    const columns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <DossierTitleCell data={props} publicFolder />,
        headerClassName: 'public-folders-big-header',
        className: 'public-folders-big-cell',
      },
      {
        Header: 'Publicatie datum',
        accessor: 'created_at',
        Cell: props => <div>{moment(props.original.created_at).format('DD-MM-YYYY')}</div>,
        headerClassName: 'public-folders-generic-header',
        className: 'public-folders-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        Cell: props => <div>{moment(props.original.last_modified).format('DD-MM-YYYY')}</div>,
        headerClassName: 'public-folders-generic-header',
        className: 'public-folders-generic-cell',
      },
      {
        Header: 'Gepubliceerd op RIS portaal',
        accessor: 'published',
        Cell: props => (
          <Toggle
            label=""
            disabled={false}
            defaultToggled={props.original.published}
            style={{ width: 0, marginLeft: -8 }}
            onToggle={(e, value) => this.onToggle(value, props.original.id)}
          />
        ),
        headerClassName: 'public-folders-generic-header public-folder-toggle',
        className: 'public-folders-generic-cell public-folder-toggle',
        style: !(this.props.is_admin || this.props.is_author) ? { display: 'none' } : {},
        headerStyle: !(this.props.is_admin || this.props.is_author) ? { display: 'none' } : {},
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <ItemMenu
            data={props}
            optionType="public_folders"
            share={() => share(null, `/publieke-dossiers/${props.original.id}`, null, 'Link')}
            edit={() => this.props.setPublicDossierModal(true, props.original.id)}
            delete={() =>
              this.props.deletePublicDossier(props.original.id, () =>
                browserHistory.replace('/publieke-dossiers'),
              )
            }
          />
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

    const sortByMenu = (
      <IconMenu
        className="sort-by-menu"
        iconButtonElement={
          <IconButton style={{ marginBottom: -4 }}>
            <ContentFilter color={appResources.in_content_color} />
          </IconButton>
        }
      >
        <Menu
          value={sort_by}
          selectedMenuItemStyle={{ color: appResources.in_content_color }}
          desktop
        >
          <MenuItem value="title" primaryText="Naam a/z" onClick={() => this.setSortBy('title')} />
          <MenuItem
            value="-title"
            primaryText="Naam z/a"
            onClick={() => this.setSortBy('-title')}
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

    const folderPageClass = classNames('folders-page-container', {
      focused,
    });
    const folderResultsClass = classNames('show-grid', 'search-results', {
      hide: focused,
    });
    const renderChips = (
      <div className="search-chips-container">
        {chips.map(c => {
          return (
            <Chip
              key={c}
              onRequestDelete={() => {
                !isLoading && this.removeChip(c);
              }}
            >
              {c}
            </Chip>
          );
        })}
      </div>
    );

    return (
      <div className={folderPageClass}>
        {isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Grid fluid>
          <PageHeader icon={<HeaderIcon />} title="Publieke Dossiers" />
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <Search
                hintText="Zoek een Dossier"
                setFocus={this.setFocus}
                unsetFocus={this.unsetFocus}
                addChip={this.addChip}
                doSearch={this.props.loadPublicDossiers}
                isSearchPage
              />
              <div className="under-search">{chips.length > 0 && renderChips}</div>
            </Col>
          </Row>
          <br />
          <Row className={folderResultsClass}>
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside">
                <hr />
                <div className="sort-by-inside">
                  <b>{this.props.count}</b> Publieke Folders {sortByMenu}
                </div>
                <hr />
              </div>
              <div>
                <Table columns={columns} pageSize={page_size} data={this.props.dossiers} />
                <Pagination
                  activePage={page}
                  itemsCount={this.props.count}
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
  const { user, publicDossiers } = state;
  return {
    is_admin: user.is_admin,
    is_author: user.type === 'auteur',
    dossiers: publicDossiers.data,
    count: publicDossiers.resultsCount,
    isLoading: publicDossiers.isLoading,
    personalDossiers: user.dossiers,
  };
}

export default connect(mapStateToProps, {
  loadPublicDossiers,
  setPublicDossierModal,
  deletePublicDossier,
  setPublicDossierPublishStatus,
})(PublicFolders);
