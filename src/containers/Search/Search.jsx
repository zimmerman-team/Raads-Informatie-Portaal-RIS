import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';
import { Chip, CircularProgress, RadioButton, RadioButtonGroup, Toggle } from 'material-ui';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import appResources from '../../appResources';
import SearchBlock from '../../components/SearchField/SearchField';
import AppliedFilters from '../../components/filters/AppliedFilters';
import Table from '../../components/Table/Table';
import { TitleCell, GeneralTitleCell } from '../../components/Table/';
import ItemMenu from '../../components/OptionMenu/OptionMenu';
import Pagination from '../../components/general/Pagination';
import HorizontalTimeline from '../../components/HorizontalTimeline/HorizontalTimeline';
import { loadCombined, specifySearch } from '../../actions/combinedActions';
import { addFilter, removeFilter, removeAllFilters, setFilters } from '../../actions/filterActions';
import {
  setSortBy,
  setActivePage,
  setActiveTab,
  setDossierModal,
} from '../../actions/generalActions';
import {
  loadUserDossiers,
  addToDossier,
  addFavorite,
  addAgenda,
  addNotification,
} from '../../actions/userActions';
import HeaderIcon from '../../components/icons/Search';
import PageHeader from '../../components/PageHeader/PageHeader';
import styles from './Search.module.scss';
import { setURLfilters, getURLfilters, removeAddFilters } from './Helper';
import {
  deleteCouncilDoc,
  setDocumentModal,
  changeEventPublishStatus,
  changeDocumentPublishStatus,
  setPublicDossierPublishStatus,
} from '../../actions/publisherActions';
import {
  COMMITMENT,
  COUNCIL_ADDRESS,
  DOCUMENT,
  EVENT,
  FORMAT,
  MANAGEMENT_DOCUMENT,
  MOTION,
  POLICY_DOCUMENT,
  PUBLIC_DOSSIER,
  RECEIVED_DOCUMENT,
  WRITTEN_QUESTION,
} from '../../constants';

const radioStyle = {
  width: 'fit-content',
  display: 'inline-flex',
  whiteSpace: 'nowrap',
  marginRight: 30,
};

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      goBackToToday: 0,
      filters: props.filters ? props.filters : [],
    };

    this.onCheck = this.onCheck.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.unsetFocus = this.unsetFocus.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.onPublishToggle = this.onPublishToggle.bind(this);
    this.removeAllFilters = this.removeAllFilters.bind(this);
    this.handleOpenNewDossier = this.handleOpenNewDossier.bind(this);
  }

  componentWillMount() {
    getURLfilters(this);
    setTimeout(() => {
      browserHistory.replace(setURLfilters(this.props.filters, this.props.sortBy, this.props.page));
    }, 1000);
  }

  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Zoek`;
    this.props.loadUserDossiers();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.filters, nextProps)) {
      this.setState({
        filters: this.props.filters,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      removeAddFilters(this);
    }
  }

  componentWillUnmount() {
    this.props.removeAllFilters();
  }

  setFocus() {
    this.setState({ focused: true });
  }

  unsetFocus() {
    this.setState({ focused: false });
  }

  handleOpenNewDossier(itemID) {
    this.props.setDossierModal(itemID);
  }

  addFilter(type, value, label) {
    this.props.setActivePage(1, false);
    this.props.addFilter(type, value, label);
    this.setState({
      filters: this.props.filters,
    });
    browserHistory.push(setURLfilters(this.props.filters, this.props.sortBy, 1));
  }

  removeFilter(type, id) {
    this.props.removeFilter(type, id);
    browserHistory.push(setURLfilters(this.props.filters, this.props.sortBy, this.props.page));
  }

  removeAllFilters() {
    this.props.removeAllFilters();
    browserHistory.push(setURLfilters([], this.props.sortBy, this.props.page));
  }

  onPageChange(page) {
    this.props.setActivePage(page);
    browserHistory.push(setURLfilters(this.props.filters, this.props.sortBy, page));
  }

  setSortBy(value) {
    this.props.setSortBy(value);
    browserHistory.push(setURLfilters(this.props.filters, value, this.props.page));
  }

  onCheck(e, value) {
    this.props.specifySearch(value);
    this.props.loadCombined();
  }

  onPublishToggle(type, value, id) {
    switch (type) {
      case EVENT:
        this.props.changeEventPublishStatus(id, value);
        break;
      case DOCUMENT:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case RECEIVED_DOCUMENT:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case COUNCIL_ADDRESS:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case WRITTEN_QUESTION:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case FORMAT:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case MANAGEMENT_DOCUMENT:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case POLICY_DOCUMENT:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case MOTION:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case COMMITMENT:
        this.props.changeDocumentPublishStatus(id, type, value);
        break;
      case PUBLIC_DOSSIER:
        this.props.setPublicDossierPublishStatus(id, value);
        break;
      default:
        break;
    }
  }

  render() {
    const { focused, filters } = this.state;

    const {
      data,
      page,
      tab,
      sortBy,
      resultsCount,
      timelineData,
      timelineStart,
      dossiers,
      isLoading,
      searchType,
    } = this.props;

    const isSearch = filter(filters, f => {
      return f.type === 'search';
    });

    const hideComp4Timeline = tab === 'timeline' && window.innerWidth < 768;

    const columns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => (
          <TitleCell data={props} isSearch={isSearch} showExcerpt={searchType === 'q'} />
        ),
        headerClassName: !(this.props.is_admin || this.props.is_author)
          ? 'search-big-header'
          : 'search-big-header-admin',
        className: !(this.props.is_admin || this.props.is_author)
          ? 'search-big-cell'
          : 'search-big-cell-admin',
      },
      {
        Header: 'Type document',
        accessor: 'type',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={10}
            value={props.value}
            hasDescription={props.original.title.description !== ''}
          />
        ),
        headerClassName: 'search-generic-header',
        className: 'search-generic-cell',
      },
      {
        Header: 'Evenement datum',
        accessor: 'event_date',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={10}
            value={props.value}
            hasDescription={props.original.title.description !== ''}
          />
        ),
        headerClassName: 'search-generic-header',
        className: 'search-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={10}
            value={props.value}
            hasDescription={props.original.title.description !== ''}
          />
        ),
        headerClassName: 'search-generic-header',
        className: 'search-generic-cell',
      },
      {
        Header: 'Gepubliceerd op RIS portaal',
        accessor: 'published',
        Cell: props => (
          <Toggle
            label=""
            disabled={false}
            defaultToggled={props.value}
            style={{ width: 0, marginLeft: -8 }}
            onToggle={(e, value) => {
              this.onPublishToggle(
                props.original.options.type,
                value,
                props.original.options.origin_id,
              );
            }}
          />
        ),
        headerClassName: 'search-generic-header search-toggle',
        className: 'search-generic-cell search-toggle',
        style: !(this.props.is_admin || this.props.is_author) ? { display: 'none' } : {},
        headerStyle: !(this.props.is_admin || this.props.is_author) ? { display: 'none' } : {},
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div style={{ paddingTop: props.original.title.description !== '' ? 3 : 13 }}>
            <ItemMenu
              optionType={'search'}
              data={props}
              dossiers={dossiers}
              favoriteMenuItemType={'Add'}
              editDocFunc={() => this.props.setDocumentModal(true, props.original.docData)}
              delDocFunc={() =>
                this.props.deleteCouncilDoc(props.original.docData.id, props.original.docData.type)
              }
            />
          </div>
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

    const searchPageClass = classNames('search-page-container', {
      focused,
    });
    const searchResultsClass = classNames('show-grid', 'search-results', {
      hide: focused,
    });
    const renderChips = (
      <div className={styles.searchChipsContainer}>
        {filters.map(c => {
          return (
            <Chip
              key={c.id}
              onRequestDelete={() => {
                !isLoading && this.removeFilter(c.type, c.id);
              }}
            >
              {c.label}
            </Chip>
          );
        })}
      </div>
    );

    const HeaderTitle = `Zoek Raadsinformatie in Gemeente ${appResources.municipality
      .substring(0, 1)
      .toUpperCase()}${appResources.municipality.substring(1)}`;

    return (
      <div
        className={classNames('basePage', searchPageClass)}
        style={window.innerWidth < 768 ? { paddingBottom: 15 } : {}}
      >
        {isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Grid fluid>
          {!hideComp4Timeline && (
            <span>
              <PageHeader icon={<HeaderIcon />} title={HeaderTitle} />
              <Row className="show-grid">
                <Col sm={12} md={12} lg={12}>
                  <SearchBlock
                    setFocus={this.setFocus}
                    unsetFocus={this.unsetFocus}
                    isSearchPage
                    hintText="Zoek op motie’s, agenda’s, of documenten"
                    addURLParam={() => {
                      browserHistory.push(
                        setURLfilters(this.props.filters, this.props.sortBy, this.props.page),
                      );
                    }}
                  />
                  <div className={styles.searchCheckboxDiv}>
                    <RadioButtonGroup
                      name="search_type"
                      onChange={this.onCheck}
                      defaultSelected={searchType}
                    >
                      <RadioButton
                        value="q"
                        label="Alle raadsinformatie doorzoeken"
                        labelStyle={{ color: '#717171' }}
                        iconStyle={{
                          fill: searchType === 'q' ? appResources.in_content_color : '#ccc',
                          marginRight: 6,
                        }}
                        style={radioStyle}
                      />
                      <RadioButton
                        value="name__icontains"
                        label="Alleen titels doorzoeken"
                        labelStyle={{ color: '#717171' }}
                        iconStyle={{
                          fill:
                            searchType === 'name__icontains'
                              ? appResources.in_content_color
                              : '#ccc',
                          marginRight: 6,
                        }}
                        style={radioStyle}
                      />
                    </RadioButtonGroup>
                    {filters.length > 0 && renderChips}
                  </div>
                </Col>
              </Row>
              <br />
            </span>
          )}
          <Row className={searchResultsClass}>
            <Col sm={12} md={12} lg={12}>
              <AppliedFilters
                activeTab={tab}
                isLoading={isLoading}
                setActiveTab={this.props.setActiveTab}
                resultsCount={resultsCount}
                filters={JSON.parse(JSON.stringify(filters))}
                setFilter={this.addFilter}
                removeFilter={this.removeFilter}
                clearFilters={this.removeAllFilters}
                setSortBy={this.setSortBy}
                selectedsortby={sortBy}
                keepInitialFilters={filters => {
                  this.props.setFilters(filters);
                  setTimeout(() => {
                    browserHistory.replace(
                      setURLfilters(this.props.filters, this.props.sortBy, this.props.page),
                    );
                  }, 1000);
                }}
                goBackToTodayTimeline={() =>
                  this.setState({ goBackToToday: this.state.goBackToToday + 1 })
                }
                hideComp4Timeline={hideComp4Timeline}
              />
              {tab === 'list' && (
                <div>
                  <Table data={data} columns={columns} pageSize={10} />
                  <Pagination
                    activePage={page}
                    itemsCount={parseInt(resultsCount, 10)}
                    color={appResources.in_content_color}
                    onPageChange={this.onPageChange}
                  />
                </div>
              )}
              {tab === 'timeline' && (
                <HorizontalTimeline
                  height="500px"
                  start={timelineStart}
                  timelineData={timelineData}
                  goBackToToday={this.state.goBackToToday}
                />
              )}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { tab, page, user, sortBy, combined, filters } = state;
  return {
    is_admin: user.is_admin,
    is_author: user.type === 'auteur',
    resultsCount: combined.resultsCount,
    data: combined.data,
    timelineData: combined.timelineData,
    timelineStart: combined.timelineStart,
    timelineEnd: combined.timelineEnd,
    isLoading: combined.isLoading,
    filters,
    sortBy,
    page,
    tab,
    dossiers: user.dossiers,
    searchType: combined.searchType,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    addFilter,
    setSortBy,
    setFilters,
    addFavorite,
    loadCombined,
    removeFilter,
    addToDossier,
    setActiveTab,
    setActivePage,
    specifySearch,
    setDossierModal,
    removeAllFilters,
    addAgenda,
    loadUserDossiers,
    addNotification,
    setDocumentModal,
    deleteCouncilDoc,
    changeEventPublishStatus,
    changeDocumentPublishStatus,
    setPublicDossierPublishStatus,
  })(Search),
);
