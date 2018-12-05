import React from 'react';
import moment from 'moment';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import remove from 'lodash/remove';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import Chip from 'material-ui/Chip';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import CircularProgress from 'material-ui/CircularProgress';
import Table from '../../components/Table/Table';
import Pagination from '../../components/general/Pagination';
import SortByMenu from '../../components/general/SortByMenu';
import SearchBlock from '../../components/SearchField/SearchField';
import { FolderItemTitleCell } from '../../components/Table';
import appResources from '../../appResources';
import { share } from '../../helpers';
import {
  setPublicDossierModal,
  setPublicDossierPublishStatus,
  deletePublicDossier,
} from '../../actions/publisherActions';
import { loadPublicDossier } from '../../actions/folderActions';
import ItemMenu from '../../components/OptionMenu/OptionMenu';
import Toggle from 'material-ui/Toggle';
import HeaderIcon from '../../components/icons/Folder';
import styles from '../../components/PageHeader/PageHeader.module.scss';
import { dutchDateToIso } from './PublicFolderHelper';

class PublicFolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chips: [],
      page: 1,
      page_size: 10,
      suggestions: [],
      sort_by: '-last_modified',
      content: [],
      initialContent: [],
    };

    this.addChip = this.addChip.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.removeChip = this.removeChip.bind(this);
    this.changePage = this.changePage.bind(this);
    this._addToDossier = this._addToDossier.bind(this);
    this.getSuggestions = debounce(this.getSuggestions.bind(this), 500);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }

  componentWillMount() {
    const { page, page_size, sort_by, chips } = this.state;
    this.props.loadPublicDossier(this.props.params.id, page, page_size, sort_by, chips);
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Publieke dossier`;
  }

  componentDidUpdate(prevProps, prevState) {
    const { publicDossier, params } = this.props;
    const { page, page_size, sort_by, chips } = this.state;
    if (prevProps.params.id !== params.id) {
      this.props.loadPublicDossier(params.id, page, page_size, sort_by, chips);
    }
    if (!isEqual(prevProps.publicDossier, publicDossier)) {
      if (
        !publicDossier.isLoading &&
        !this.props.is_admin &&
        !this.props.is_author &&
        !this.props.is_raadslid &&
        !publicDossier.published
      )
        browserHistory.push('/publieke-dossiers');
      this.getContent(publicDossier.dossiers.concat(publicDossier.documents), true);
    }
  }

  componentWillUnmount() {
    this.setState({ chips: [], suggestions: [] });
  }

  getContent(data, initialLoad = false) {
    const { page, page_size, sort_by, chips } = this.state;

    let ordering = '';
    switch (true) {
      case sort_by.indexOf('name') !== -1:
        ordering = 'title.title';
        break;
      case sort_by.indexOf('date') !== -1:
        ordering = 'created_at';
        break;
      default:
        ordering = sort_by;
    }

    let content = data;
    content = sortBy(content, item => {
      if (sort_by.indexOf('date') !== -1 || sort_by.indexOf('last_modified') !== -1) {
        return dutchDateToIso(get(item, ordering, ''));
      }
      return get(item, ordering, '');
    });

    if (sort_by.indexOf('-') !== -1) {
      content = content.reverse();
    }

    let _content = chips.length > 0 ? [] : content;

    for (let i = 0; i < chips.length; i++) {
      _content = filter(content, item => {
        return item.title.title.indexOf(chips[i]) > -1;
      });
    }

    const sliceTo =
      page_size * (page + 1) > _content.length ? _content.length : page_size * (page + 1);

    _content = _content.slice(page_size * (page - 1), sliceTo);

    this.setState({
      content: _content,
      initialContent: initialLoad ? _content : this.state.initialContent,
    });
  }

  changePage(page) {
    const { publicDossier } = this.props;
    this.setState({ page }, () => {
      this.getContent(publicDossier.dossiers.concat(publicDossier.documents));
    });
  }

  setSortBy(value) {
    const { publicDossier } = this.props;
    this.setState({ sort_by: value }, () => {
      this.getContent(publicDossier.dossiers.concat(publicDossier.documents));
    });
  }

  addChip(chip) {
    const { content } = this.state;
    const chips = this.state.chips;
    if (
      find(chips, c => {
        return c === chip;
      }) === undefined
    ) {
      chips.push(chip);
      this.setState({ chips }, () => {
        this.getContent(content);
      });
    }
  }

  removeChip(chip) {
    const { initialContent } = this.state;
    const chips = this.state.chips;
    remove(chips, c => {
      return c === chip;
    });
    this.setState({ chips }, () => {
      this.getContent(initialContent);
    });
  }

  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  getSuggestionValue(suggestion) {
    return suggestion.id;
  }

  getSectionSuggestions(section) {
    return section.data;
  }

  getSuggestions(event) {
    const { content } = this.state;

    const suggestions = filter(content, item => {
      return item.title.title.indexOf(event.value) > -1;
    }).map(item => {
      return {
        id: item.id,
        name: item.title.title,
        date: item.created_at,
        type: item.type,
        item_id: item.id,
      };
    });

    this.setState({
      suggestions: [
        {
          title: 'Search',
          data: suggestions,
        },
      ],
    });
  }

  _addToDossier(dossierID, itemID) {
    this.props.addToDossier(dossierID, itemID);
  }

  onToggle(value, id) {
    this.props.setPublicDossierPublishStatus(id, value);
  }

  render() {
    const { publicDossier, personalDossiers } = this.props;
    const { page, chips, sort_by, content } = this.state;
    const customSearch = {
      onSearchClick: this.addChip,
      onEnter: this.addChip,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      getSectionSuggestions: this.getSectionSuggestions,
      getSuggestions: this.getSuggestions,
      suggestions: this.state.suggestions,
    };

    const columns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <FolderItemTitleCell data={props} />,
        headerClassName: 'public-folder-content-big-header',
        className: 'public-folder-content-big-cell',
      },
      {
        Header: 'Type document',
        accessor: 'formatted_type',
        headerClassName: 'public-folder-content-generic-header',
        className: 'public-folder-content-generic-cell',
      },
      {
        Header: 'Evenement datum',
        accessor: 'created_at',
        headerClassName: 'public-folder-content-generic-header',
        className: 'public-folder-content-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        headerClassName: 'public-folder-content-generic-header',
        className: 'public-folder-content-generic-cell',
      },
      {
        Header: 'Gepubliceerd op RIS portaal',
        accessor: 'published',
        Cell: props => {
          return (
            <div>
              {props.original.type === 'public_dossier' && (
                <Toggle
                  label=""
                  disabled={false}
                  defaultToggled={props.original.published}
                  style={{ width: 0, marginLeft: -8 }}
                  onToggle={(e, value) => this.onToggle(value, props.original.id)}
                />
              )}
            </div>
          );
        },
        headerClassName: 'public-folder-content-generic-header public-folder-toggle',
        className: 'public-folder-content-generic-cell public-folder-toggle',
        style: !(this.props.is_admin || this.props.is_author) ? { display: 'none' } : {},
        headerStyle: !(this.props.is_admin || this.props.is_author) ? { display: 'none' } : {},
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <ItemMenu optionType={'dossier_content'} dossiers={personalDossiers} data={props} />
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

    const renderChips = (
      <div className="search-chips-container">
        {chips.map(c => {
          return (
            <Chip key={c} onRequestDelete={() => this.removeChip(c)}>
              {c}
            </Chip>
          );
        })}
      </div>
    );

    return (
      <div className="basePage folders-page-container">
        <div className="opened-folder-header" style={{ paddingLeft: 10, paddingBottom: 0 }}>
          <div className="folderHeaderContainer">
            <div className={styles.headerIcon} style={{ marginRight: 0 }}>
              <HeaderIcon />
            </div>
            <div className="header-folder-title" style={{ marginLeft: 0 }}>
              <ItemMenu
                extraStyle={{
                  display: 'inline-flex',
                }}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'center',
                }}
                targetOrigin={{
                  horizontal: 'left',
                  vertical: 'top',
                }}
                optionType="public_folders"
                data={{ ...publicDossier, type: 'public_dossier' }}
                share={() => share(null, `/publieke-dossiers/${this.props.params.id}`, null, 'Link')}
                edit={() => this.props.setPublicDossierModal(true, this.props.params.id)}
                delete={() =>
                  this.props.deletePublicDossier(this.props.params.id, () =>
                    browserHistory.replace('/publieke-dossiers'),
                  )
                }
              />
              <div className="folder-text-title">Over Dossier: {publicDossier.title}</div>
              <div style={{ display: 'block' }}>
                <div className="header-opened-folder-component">
                  <div>
                    <label>Datum Aangemaakt:</label>{' '}
                    <p>{moment(publicDossier.created_at).format('DD-MM-YYYY')}</p>
                  </div>
                </div>
                <div className="header-opened-folder-component">
                  <div>
                    <label>Datum Laatst toegevoegd:</label>{' '}
                    <p>{moment(publicDossier.last_modified).format('DD-MM-YYYY')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {publicDossier.isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Grid fluid>
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <SearchBlock
                custom={customSearch}
                hintText={`Zoek in ${publicDossier.title}`}
                chips={chips}
                addChip={this.addChip}
                isSearchPage
              />
              <div className="under-search">{chips.length > 0 && renderChips}</div>
            </Col>
          </Row>
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside" style={{ marginTop: 10 }}>
                <hr style={{ marginBottom: '10px' }} />
                <div className="filterMenu">
                  <div
                    className="sort-by-inside"
                    style={{ marginLeft: '0', display: 'inline-block' }}
                  >
                    <b>{publicDossier.document_count} documenten</b> and{' '}
                    <b>{publicDossier.dossier_count} dossiers</b> in {publicDossier.title}
                    <SortByMenu setSortBy={this.setSortBy} selected={sort_by} />
                  </div>
                </div>
                <hr />
              </div>
              <div>
                <Table pageSize={10} columns={columns} data={content} />
                <Pagination
                  activePage={page}
                  itemsCount={parseInt(
                    publicDossier.document_count + publicDossier.dossier_count,
                    10,
                  )}
                  color={appResources.in_content_color}
                  onPageChange={this.changePage}
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
  const { user, publicDossier } = state;
  return {
    is_admin: user.is_admin,
    is_author: user.type === 'auteur',
    is_raadslid: user.type === 'raadslid',
    publicDossier,
    personalDossiers: user.dossiers,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    loadPublicDossier,
    deletePublicDossier,
    setPublicDossierModal,
    setPublicDossierPublishStatus,
  })(PublicFolder),
);
