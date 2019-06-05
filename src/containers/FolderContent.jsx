import React from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import remove from 'lodash/remove';
import moment from 'moment';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Table from '../components/Table/Table';
import Pagination from '../components/general/Pagination';
import SortByMenu from '../components/general/SortByMenu';
import SearchBlock from '../components/SearchField/SearchField';
import FolderShare from '../components/folder/FolderShare';
import { FolderItemTitleCell, GeneralTitleCell } from '../components/Table';
import appResources from '../appResources';
import { generateID } from '../helpers';
import { formatFileResults } from '../data-formatters/SearchResultsDataFormatter';
import {
  addFavorite,
  removeFavorite,
  addToDossier,
  deleteDossier,
  addNotification,
  uploadFile,
  deleteFile,
  removeFromDossier,
  unshareDossier,
  loadDossierContents,
  removeNoteFromDossier
} from '../actions/userActions';
import { setDossierModal, setAddNote } from '../actions/generalActions';
import ItemMenu from '../components/OptionMenu/OptionMenu';
import { getDocBackendUrl, getDocDetails } from './Dashboard/MyNotes/Helper';

class FolderContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chips: [],
      activePage: 1,
      suggestions: [],
      isLoading: false,
      files: [],
      showAllUsers: false,
      sort_by: '-last_modified',
      folder: {
        color: '#fff',
        created_at: '2000-01-01T00:00:00',
        id: 0,
        last_modified: '2000-01-01T00:00:00',
        owner: { id: -1, username: '', email: '', first_name: '', last_name: '' },
        shared_users: [],
        title: '_none_'
      },
      publicFolder: false,
      showUploadDialog: false,
      inputLabelColor: '#000',
      showShareComponent: false
    };

    this.onEnter = this.onEnter.bind(this);
    this.addChip = this.addChip.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.deleteChip = this.deleteChip.bind(this);
    this._addToDossier = this._addToDossier.bind(this);
    this.filterContent = this.filterContent.bind(this);
    this.searchBtnClick = this.searchBtnClick.bind(this);
    this.getSuggestions = debounce(this.getSuggestions.bind(this), 500);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.changePage = this.changePage.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  componentWillMount() {
    if (this.props.location.pathname.indexOf('publieke-dossiers') !== -1) {
      this.setState({
        folder: find(appResources.sampleDossiers, { id: parseInt(this.props.params.id, 10) }),
        publicFolder: true
      });
    } else {
      if (this.props.dossiers.length > 0) {
        this.props.loadDossierContents(
          parseInt(this.props.params.id, 10),
          this.state.activePage,
          this.state.sort_by,
          this.state.chips
        );
        this.setState({
          folder: find(this.props.dossiers, { id: parseInt(this.props.params.id, 10) })
        });
      } else {
        browserHistory.push('/folders');
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { content } = this.props;
    if (!isEqual(prevProps.content, content)) {
      this.setState({
        files: formatFileResults(content)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { content } = this.props;
    if (!isEqual(nextProps.content, content)) {
      this.setState({
        files: formatFileResults(nextProps.content)
      });
    }
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Mijn Folder`;
    const { content } = this.props;
    this.setState({
      files: formatFileResults(content)
    });
  }

  componentWillUnmount() {
    this.setState({ chips: [], suggestions: [] });
  }

  setSortBy(value) {
    this.setState({ sort_by: value });
    this.props.loadDossierContents(
      parseInt(this.props.params.id, 10),
      this.state.activePage,
      value,
      this.state.chips
    );
  }

  addChip(type, value, label) {
    const chips = this.state.chips;
    chips.push({
      id: generateID(),
      type,
      value,
      label
    });
    this.setState({ chips }, this.filterContent);
  }

  deleteChip(id, type) {
    const { chips } = this.state;
    const _chips = remove(chips, c => {
      return c.id !== id;
    });
    this.setState({ chips: _chips }, this.filterContent);
  }

  filterContent() {
    const { chips } = this.state;
    this.props.loadDossierContents(
      parseInt(this.props.params.id, 10),
      this.state.activePage,
      this.state.sort_by,
      chips
    );
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
    let suggestions = [];
    const _this = this;

    axios
      .get(
        `/dossier/content/${this.state.folder.id}/?page_size=${5}&page=${1}&ordering=${
          this.state.sort_by
        }&q=${[event.value]}`
      )
      .then(response => {
        const filtered = formatFileResults(response.data.results);
        suggestions = filtered.map(r => {
          return {
            id: r.id,
            name: r.title.title,
            date: r.date,
            type: r.type,
            item_id: r.id
          };
        });
        _this.setState({
          suggestions: [
            {
              title: 'Search',
              data: suggestions
            }
          ]
        });
      });
  }

  onEnter(value) {
    this.addChip('Zoekterm', value, value);
  }

  searchBtnClick(value) {
    this.addChip('Zoekterm', value, value);
  }

  _addToDossier(dossierID, itemID) {
    this.props.addToDossier(dossierID, itemID);
  }

  handleFileUpload(event) {
    if (event.target.files[0] && parseInt(event.target.files[0].size, 10) > 10000000) {
      this.setState({
        inputLabelColor: '#FF0000'
      });
    } else if (event.target.files[0]) {
      this.props.uploadFile(
        event.target.files[0],
        this.state.folder.id,
        this.state.activePage,
        this.state.sort_by,
        this.state.chips
      );
      this.setState({ showUploadDialog: false, inputLabelColor: '#000000' });
    }
  }

  changePage(pagez) {
    this.props.loadDossierContents(
      parseInt(this.props.params.id, 10),
      pagez,
      this.state.sort_by,
      this.state.chips
    );
    this.setState({
      activePage: pagez
    });
  }

  onDelete(folder) {
    const { userID } = this.props;
    if (folder.owner.id === userID) {
      this.props.deleteDossier(folder.id, folder.owner.id);
    } else {
      this.props.unshareDossier(folder.id);
    }
  }

  editNote(note) {
    const url = `${appResources.backendUrl}${getDocBackendUrl(note)}`;
    const _this = this;

    axios
      .get(url)
      .then(response => {
        const data = response.data;
        const docDetails = getDocDetails(data, note.type);
        _this.props.setAddNote(docDetails, true, note);
      })
      .catch(error => {});
  }

  render() {
    const {
      isLoading,
      activePage,
      files,
      chips,
      sort_by,
      folder,
      publicFolder,
      showShareComponent,
      showUploadDialog,
      inputLabelColor,
      showAllUsers
    } = this.state;

    const customSearch = {
      onSearchClick: this.searchBtnClick,
      onEnter: this.onEnter,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      getSectionSuggestions: this.getSectionSuggestions,
      getSuggestions: this.getSuggestions,
      suggestions: this.state.suggestions
    };

    const columns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <FolderItemTitleCell data={props} editNote={this.editNote} />,
        headerClassName: 'folder-content-big-header',
        className: 'folder-content-big-cell'
      },
      {
        Header: 'Type document',
        accessor: 'formatted_type',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'folder-content-generic-header',
        className: 'folder-content-generic-cell'
      },
      {
        Header: 'Evenement datum',
        accessor: 'event_date',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'folder-content-generic-header',
        className: 'folder-content-generic-cell'
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'folder-content-generic-header',
        className: 'folder-content-generic-cell'
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div style={{ paddingTop: 10, marginBottom: -10 }}>
            <ItemMenu
              optionType={
                props.original.options.type === 'note' ? 'folder_note_content' : 'folder_content'
              }
              data={props}
              extraFunction={() => {
                props.original.options.type === 'Geupload document'
                  ? this.props.deleteFile(props.original.options.origin_id, folder.id)
                  : props.original.content_id
                  ? this.props.removeFromDossier(folder.id, props.original.content_id)
                  : this.props.removeNoteFromDossier(folder.id, props.original.id);
              }}
            />
          </div>
        ),
        headerClassName: 'small-header',
        className: 'small-cell'
      }
    ];

    const renderChips = (
      <div className="search-chips-container">
        {chips.map(c => {
          return (
            <Chip key={c.id} onRequestDelete={() => this.deleteChip(c.id, c.type)}>
              {c.label}
            </Chip>
          );
        })}
      </div>
    );

    const menu = (
      <ItemMenu
        optionType={'opened_folder'}
        data={folder}
        extraFunction={() =>
          this.setState({
            showShareComponent: true
          })
        }
      />
    );

    return (
      <div className="basePage folders-page-container">
        <div className="opened-folder-header">
          <div className="folderHeaderContainer">
            <Glyphicon glyph="file" className="header-open-folder-icon" />
            <div className="header-folder-title">
              {' '}
              {publicFolder ? 'Over Dossier:' : 'Mijn Folder:'} {folder.title}{' '}
            </div>
            {menu}
          </div>
          <div style={{ paddingTop: '30px' }}>
            <div className="header-opened-folder-component">
              <div>
                <label>Datum Aangemaakt:</label>{' '}
                <p>{moment(folder.created_at).format('DD-MM-YYYY')}</p>
              </div>
              {/*<hr />*/}
            </div>
            <div className="header-opened-folder-component">
              <div>
                <label>Datum Laatst toegevoegd:</label>{' '}
                <p>{moment(folder.last_modified).format('DD-MM-YYYY')}</p>
              </div>
              {/*<hr />*/}
            </div>
          </div>
        </div>
        {(isLoading || this.props.loading) && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Dialog
          title="Maximale bestandsgrootte 10MB"
          modal={false}
          titleStyle={{ color: inputLabelColor }}
          open={showUploadDialog}
          onRequestClose={() => this.setState({ showUploadDialog: false })}
        >
          <input
            type="file"
            name="file"
            id="file"
            className="inputfile"
            onChange={this.handleFileUpload}
          />
          <label htmlFor="file">Kies een bestand</label>
        </Dialog>
        <Grid fluid>
          {folder && folder.owner.id === this.props.userID && folder.shared_users.length > 0 && (
            <Row className="show-grid shared-users-list">
              <Col sm={12} md={12} lg={12}>
                <label>Shared users:</label>
                <ul>
                  {folder.shared_users.slice(0, 5).map(user => {
                    return (
                      <li key={user.id}>
                        <b>{user.username}</b> - {user.email}
                      </li>
                    );
                  })}
                  {showAllUsers &&
                    folder.shared_users.slice(5).map(user => {
                      return (
                        <li key={user.id}>
                          <b>{user.username}</b> - {user.email}
                        </li>
                      );
                    })}
                </ul>
                {folder.shared_users.length > 5 && (
                  <a onClick={() => this.setState({ showAllUsers: !showAllUsers })}>
                    {showAllUsers ? 'Minder' : 'Meer'}...
                  </a>
                )}
              </Col>
            </Row>
          )}

          {showShareComponent && (
            <Row className="show-grid">
              <Col sm={12} md={12} lg={12}>
                <div>
                  <FolderShare
                    folder={folder}
                    cancel={() => this.setState({ showShareComponent: false })}
                  />
                </div>
              </Col>
            </Row>
          )}

          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <SearchBlock
                custom={customSearch}
                hintText={`Zoek in ${folder.title}`}
                chips={chips}
                addChip={this.addChip}
                isSearchPage
              />
              <div className="under-search">{chips.length > 0 && renderChips}</div>
            </Col>
          </Row>
          <br />
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside">
                <hr style={{ marginBottom: '10px' }} />
                <div className="filterMenu">
                  <div
                    className="sort-by-inside"
                    style={{ marginLeft: '0', marginBottom: '8px', display: 'inline-block' }}
                  >
                    <b>
                      {this.props.count} {publicFolder ? 'documenten' : 'gelinkte documenten'}
                    </b>{' '}
                    in {folder.title}
                    <SortByMenu setSortBy={this.setSortBy} selected={sort_by} />
                  </div>
                  {!publicFolder && (
                    <RaisedButton
                      onClick={() => this.setState({ showUploadDialog: true })}
                      label={'Upload Document'}
                      style={appResources.normalButtonStyle}
                      backgroundColor={appResources.color_normal}
                      labelStyle={appResources.boldBigLabel}
                    />
                  )}
                </div>
                <hr />
              </div>
              <div>
                <Table pageSize={10} columns={columns} data={files} />
                <Pagination
                  activePage={activePage}
                  itemsCount={this.props.count ? this.props.count : 0}
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
  const { user } = state;
  return {
    dossiers: user.dossiers,
    userID: user.userID,
    loading: user.isLoading,
    content: user.content,
    count: user.count
  };
}

export default connect(
  mapStateToProps,
  {
    setAddNote,
    addFavorite,
    addToDossier,
    deleteDossier,
    removeFavorite,
    addNotification,
    uploadFile,
    deleteFile,
    removeFromDossier,
    unshareDossier,
    loadDossierContents,
    setDossierModal,
    removeNoteFromDossier
  }
)(FolderContent);
