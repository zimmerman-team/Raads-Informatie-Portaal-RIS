import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-bootstrap';
import { CircularProgress } from 'material-ui';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/general/Pagination';
import FolderShare from '../../../components/folder/FolderShare';
import { DossierTitleCell, GeneralTitleCell } from '../../../components/Table';
import appResources from '../../../appResources';
import { genericSortBy } from '../../../helpers';
import ItemMenu from '../../../components/OptionMenu/OptionMenu';
import { setDossierModal, setActivePage } from '../../../actions/generalActions';
import {
  loadUserDossiers,
  createUserDossier,
  deleteDossier,
  removeFavorite,
  loadFavorites,
  unshareDossier,
} from '../../../actions/userActions';
import HeaderIcon from '../../../components/icons/Folder';
import PageHeader from '../../../components/PageHeader/PageHeader';
import MyFolderFilterMenu from './components/MyFolderFilterMenu/MyFolderFilterMenu';

class MyFolders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'list',
      activePage: 1,
      isLoading: false,
      resultsCount: sessionStorage.getItem('dossiers_count'),
      dossiers: this.props.dossiers ? this.props.dossiers : [],
      openSnackbar: false,
      messageSnackbar: '',
      openDossierModal: false,
      item_id_to_new_dossier: 0,
      page: 1,
      page_size: 10,
      sort_by: 'title',
      folderToShare: {},
      showShareComponent: false,
    };

    this.onDelete = this.onDelete.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.getOrderedDossiers = this.getOrderedDossiers.bind(this);
    this.handleOpenNewDossier = this.handleOpenNewDossier.bind(this);
  }

  componentWillMount() {
    this.props.loadUserDossiers(this.state.page, this.state.page_size);
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Mijn folders`;
    document.querySelector('#content-wrap').scrollTop = 0;
  }

  setSortBy(value) {
    this.setState({ sort_by: value, dossiers: genericSortBy(value, this.state.dossiers) });
  }

  handleOpenNewDossier(itemID) {
    this.props.setDossierModal(itemID);
  }

  onPageChange(page) {
    const { page_size } = this.state;
    this.setState({ page }, () => {
      this.props.loadUserDossiers(page, page_size);
    });
  }

  getOrderedDossiers() {
    const { sort_by } = this.state;
    const { dossiers } = this.props;
    return genericSortBy(sort_by, dossiers);
  }

  onDelete(folder) {
    const { userID } = this.props;
    if (folder.owner.id === userID) {
      this.props.deleteDossier(folder.id, folder.owner.id);
    } else {
      this.props.unshareDossier(folder.id);
    }
  }

  render() {
    const { isLoading, dossierCount } = this.props;
    const { sort_by, page, page_size, folderToShare, showShareComponent } = this.state;

    const columns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <DossierTitleCell data={props} />,
        headerClassName: 'folders-big-header',
        className: 'folders-big-cell',
      },
      {
        Header: 'Publicatie datum',
        accessor: 'created_at',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={8}
            hasDescription={false}
            value={moment(props.value).format('DD-MM-YYYY')}
          />
        ),
        headerClassName: 'folders-generic-header',
        className: 'folders-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={8}
            hasDescription={false}
            value={moment(props.value).format('DD-MM-YYYY')}
          />
        ),
        headerClassName: 'folders-generic-header',
        className: 'folders-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div style={{ paddingTop: 10, marginBottom: -10 }}>
            <ItemMenu
              optionType={'my_folders'}
              data={props.original}
              extraFunction={() =>
                this.setState({
                  showShareComponent: true,
                  folderToShare: props.original,
                })
              }
            />
          </div>
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

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
            title="Folders"
            description="In mijn folders kunt u Documentatie en Dossiers linken om de
                        besluitvorming omtrent voor u interessante onderwerpen te volgen."
          />
          {showShareComponent && (
            <Row className="show-grid">
              <Col sm={12} md={12} lg={12}>
                <div>
                  <FolderShare
                    folder={folderToShare}
                    cancel={() => this.setState({ showShareComponent: false })}
                  />
                </div>
              </Col>
            </Row>
          )}
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside">
                <hr />
                <div className="sort-by-inside">
                  <b>{dossierCount}</b> Folders{' '}
                  <MyFolderFilterMenu sort_by={sort_by} sortBy={this.setSortBy} />
                  <div className="new-folder-div" onClick={() => this.props.setDossierModal(null)}>
                    <i className="material-icons">create_new_folder</i>
                    <span>Nieuw folder</span>
                  </div>
                </div>
                <hr />
              </div>
              <div>
                <Table
                  type="folder"
                  pageSize={page_size}
                  data={this.getOrderedDossiers()}
                  columns={columns}
                />
                <Pagination
                  activePage={page}
                  itemsCount={dossierCount ? dossierCount : 0}
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
    userID: user.userID,
    dossiers: user.dossiers,
    isLoading: user.isLoading,
    dossierCount: user.dossierCount,
  };
}

export default connect(mapStateToProps, {
  loadFavorites,
  removeFavorite,
  setActivePage,
  setDossierModal,
  loadUserDossiers,
  deleteDossier,
  createUserDossier,
  unshareDossier,
})(MyFolders);
