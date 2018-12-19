/* eslint-disable prettier/prettier */
import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Toggle from 'material-ui/Toggle';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import FileFolder from '@material-ui/icons/Folder';
import ContentAdd from '@material-ui/icons/Add';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import moment from 'moment';
import Notes from '../../components/Notes/Notes';
import { getParameterByName } from '../../helpers';
import appResources from '../../appResources';
import { loadMyNotes } from '../../actions/notesActions';
import {
  setSnackBar,
  setDossierModal,
  setAddNote,
  setSelectedCombinedItemID,
  removeSelectedCombinedItemID,
} from '../../actions/generalActions';
import { changeDocumentPublishStatus } from '../../actions/publisherActions';
import { loadUserDossiers, addToDossier, addFavorite } from '../../actions/userActions';
/* style */
import styles from './DocumentDetail.module.scss';
import ItemMenu from '../../components/OptionMenu/OptionMenu';

const small_breakpoint = 586;

class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageIndex: 0,
      totalPages: 0,
      prevDisabled: true,
      nextDisabled: false,
      docCombinedID: 0,
      docURL: '',
      docName: '',
      docDate: '',
      docType: '',
      docPublished: true,
      pdfMessage: 'Loading...',
      openSnackbar: false,
      messageSnackbar: 'Dit onderdeel bevat geen data',
      dossiers: [],
      openDossierModal: false,
      selectedColor: appResources.pickerColors[0],
      item_id_to_new_dossier: 0,
      docDetails: [],
      docStyle: styles.document_normal,
    };

    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.onDocumentError = this.onDocumentError.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getDocDetails = this.getDocDetails.bind(this);
    this.getDocBackendUrl = this.getDocBackendUrl.bind(this);
    this.setAddNoteModal = this.setAddNoteModal.bind(this);
    this.editNote = this.editNote.bind(this);
    this.handleDocScale = this.handleDocScale.bind(this);
  }

  getDocBackendUrl() {
    const { params } = this.props;
    switch (parseInt(params.type, 10)) {
      case 0:
        return `documents/${params.docID}`;
      case 1:
        return `received_documents/${params.docID}`;
      case 2:
        return `council_addresses/${params.docID}`;
      case 3:
        return `written_questions/${params.docID}`;
      case 4:
        return `public_documents/${params.docID}`;
      case 5:
        return `policy_documents/${params.docID}`;
      case 6:
        return `management_documents/${params.docID}`;
      case 7:
        return `motions/${params.docID}`;
      case 8:
        return `commitments/${params.docID}`;
      default:
        return '';
    }
  }

  getDocDetails(data) {
    const { params } = this.props;
    const isLocalHost = window.location.hostname === 'localhost';
    switch (parseInt(params.type, 10)) {
      case 0:
        return {
          id: data.id,
          category: 'Document',
          status: 'Onvoldoende Besproken',
          name: data.text,
          date: data.date,
          notes: data.notes,
          type: 'Document',
          type2: 'document',
          author: '',
          fileUrl:
            !isLocalHost && data.url.charAt(4) !== 's'
              ? data.url.replace('http', 'https')
              : data.url,
        };
      case 1:
        return {
          id: data.id,
          category: 'P&C Cyclus',
          status: 'Onvoldoende Besproken',
          name: data.document ? data.document.text : data.subject,
          date: data.date,
          notes: data.notes,
          type: 'P&C Cyclus',
          type2: 'received_document',
          author: '',
          fileUrl:
            data.document !== null
              ? !isLocalHost && data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 2:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.publication_date,
          notes: data.notes,
          type: 'Brief aan de raad',
          type2: 'council_address',
          author: '',
          fileUrl:
            data.question_document !== null
              ? !isLocalHost && data.question_document.url.charAt(4) !== 's'
                ? data.question_document.url.replace('http', 'https')
                : data.question_document.url
              : '',
        };
      case 3:
        return {
          id: data.id,
          category: 'Schriftelijke vragen',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.question_date,
          type: 'Schriftelijke vragen',
          type2: 'written_question',
          notes: data.notes,
          author: data.portfolio_holder || '',
          fileUrl:
            data.question_document !== null
              ? !isLocalHost && data.question_document.url.charAt(4) !== 's'
                ? data.question_document.url.replace('http', 'https')
                : data.question_document.url
              : '',
        };
      case 4:
        return {
          id: data.id,
          category: 'Formats',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.date_created,
          notes: data.notes,
          type: 'Formats',
          type2: 'format',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? !isLocalHost && data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 5:
        return {
          id: data.id,
          category: 'Presidium besluitenlijsten',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.publication_date,
          notes: data.notes,
          type: 'Presidium besluitenlijsten',
          type2: 'policy_document',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? !isLocalHost && data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 6:
        return {
          id: data.id,
          category: 'Raadsbrieven',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.publication_date,
          notes: data.notes,
          type: 'Raadsbrieven',
          type2: 'management_document',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? !isLocalHost && data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 7:
        return {
          id: data.id,
          category: 'Motie',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.date_created || data.meeting_date,
          notes: data.notes,
          type: 'Motie',
          type2: 'motion',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? !isLocalHost && data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 8:
        return {
          id: data.id,
          category: 'Toezeggingen',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.commitment_date,
          notes: data.notes,
          type: 'Toezeggingen',
          type2: 'commitment',
          author: data.portfolio_holder || '',
          fileUrl:
            data.new_document !== null
              ? !isLocalHost && data.new_document.url.charAt(4) !== 's'
                ? data.new_document.url.replace('http', 'https')
                : data.new_document.url
              : '',
        };
      default:
        return '';
    }
  }

  getDocumentInfo() {
    const url = `${appResources.backendUrl}${this.getDocBackendUrl()}/`;
    const _this = this;

    axios
      .get(url)
      .then(response => {
        if (!response.data.published && !_this.props.is_admin && !_this.props.is_author && !_this.props.is_raadslid) {
          browserHistory.push('/zoeken');
        }
        const docDetails = _this.getDocDetails(response.data);
        _this.setAddNoteModal(docDetails);
        _this.props.setSelectedCombinedItemID(response.data.combined_id);
        _this.setState({
          docDetails,
          docCombinedID: response.data.combined_id,
          docURL: appResources.municipality === 'Utrecht'
            ? "https://cors-anywhere.herokuapp.com/".concat(docDetails.fileUrl.replace('almere.notubiz.nl', 'api.notubiz.nl'))
            : docDetails.fileUrl.replace('almere.notubiz.nl', 'api.notubiz.nl'),
          downloadURL: docDetails.fileUrl.replace('almere.notubiz.nl', 'api.notubiz.nl'),
          docName: docDetails.name,
          docDate: moment(docDetails.date).format('DD-MM-YYYY'),
          docType: docDetails.type,
          docType2: docDetails.type2,
          docAuthor: docDetails.author,
          docPublished: response.data.published,
          // docNotes: docDetails.notes
        });
      })
      .catch(error => {
        _this.setState({
          pdfMessage: 'Geen gegevens in dit document.',
        });
      });
  }

  setAddNoteModal(document) {
    this.props.setAddNote(document);
  }

  onDocumentLoad(pdf) {
    this.setState({ totalPages: pdf.numPages });
  }

  onDocumentError(error) {
    this.setState({ pdfMessage: error.message });
  }

  changePage(direction) {
    switch (direction) {
      case 'prev':
        if (this.state.pageIndex !== 0) {
          browserHistory.replace(
            `/document/${this.props.params.type}/${this.props.params.docID}?p=${
              this.state.pageIndex
            }`,
          );
          this.setState({ pageIndex: this.state.pageIndex - 1, prevDisabled: false });
        } else {
          this.setState({ prevDisabled: true, nextDisabled: false });
        }
        if (this.state.pageIndex !== this.state.totalPages - 1) {
          this.setState({ nextDisabled: false });
        } else {
          this.setState({ nextDisabled: true });
        }
        break;
      case 'next':
        if (this.state.pageIndex !== this.state.totalPages - 1) {
          browserHistory.replace(
            `/document/${this.props.params.type}/${this.props.params.docID}?p=${this.state
              .pageIndex + 2}`,
          );
          this.setState({ pageIndex: this.state.pageIndex + 1, nextDisabled: false });
        } else {
          this.setState({ nextDisabled: true, prevDisabled: false });
        }
        if (this.state.pageIndex !== 0) {
          this.setState({ prevDisabled: false });
        } else {
          this.setState({ prevDisabled: true });
        }
        break;
      default:
        break;
    }
  }

  componentWillUnmount() {
    this.props.setAddNote([], false, []);
    this.props.removeSelectedCombinedItemID();
  }

  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Document`;
    this.props.loadMyNotes();
    this.props.loadUserDossiers();
  }

  componentWillMount() {
    this.getDocumentInfo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.totalPages !== this.state.totalPages) {
      const pageParam = getParameterByName('p');
      if (
        pageParam &&
        parseInt(pageParam, 10) - 1 < this.state.totalPages &&
        parseInt(pageParam, 10) - 1 > 0
      ) {
        this.setState({ pageIndex: parseInt(pageParam, 10) - 1 });
      }
    }
  }

  handleDocScale() {
    if (window.innerWidth <= small_breakpoint) {
      switch (this.state.docStyle) {
        case styles.document_normal:
          this.setState({
            docStyle: styles.document_increased,
          });
          break;
        case styles.document_increased:
          this.setState({
            docStyle: styles.document_double_increased,
          });
          break;
        case styles.document_double_increased:
          this.setState({
            docStyle: styles.document_normal,
          });
          break;
        default:
          break;
      }
    }
  }

  editNote(note) {
    const url = `${appResources.backendUrl}${this.getDocBackendUrl(note)}`;
    const _this = this;

    axios
      .get(url)
      .then(response => {
        const data = response.data;
        const docDetails = _this.getDocDetails(data, note.type);
        _this.props.setAddNote(docDetails, true, note);
      })
      .catch(error => {});
  }

  render() {
    const { notes, params, dossiers } = this.props;
    const { docURL, downloadURL, docDate, docCombinedID, docName, docType } = this.state;

    const docNotes = filter(notes, n => {
      return parseInt(params.docID, 10) === n.doc_id && parseInt(params.type, 10) === n.type;
    });

    const dossiers_menu = this.props.dossiers.map(dossier => {
      return (
        <MenuItem
          primaryText={dossier.title}
          leftIcon={<FileFolder color={dossier.color} />}
          onClick={() => this.props.addToDossier(dossier.id, this.state.docCombinedID)}
        />
      );
    });
    dossiers_menu.push(
      <MenuItem
        primaryText="Add new map"
        leftIcon={<ContentAdd />}
        onClick={() => this.props.setDossierModal(this.state.docCombinedID)}
      />,
    );

    const icon_menu = (
      <ItemMenu
        optionType={'doc_detail'}
        data={{
          date: docDate,
          id: parseInt(params.docID, 10),
          uid: docCombinedID,
          title: docName,
          type: docType,
          download_url: downloadURL,
          url: `/document/${params.type}/${params.docID}`,
        }}
        dossiers={dossiers}
      />
    );

    return (
      <div className="basePage document-detail-container">
        <Grid fluid>
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              {this.props.is_admin && (
                <div className={styles.adminDivControls}>
                  <Toggle
                    toggled={this.state.docPublished}
                    labelPosition="right"
                    labelStyle={{
                      fontSize: 21,
                      color: '#0c74d5',
                      width: 'calc(100% - 30px)',
                    }}
                    label="publiceren naar RIS portaal"
                    onToggle={(e, value) => {
                      this.props.changeDocumentPublishStatus(parseInt(params.docID, 10), this.state.docType2, value);
                      this.setState({ docPublished: value });
                    }}
                    style={{
                      display: 'inline-flex',
                      marginRight: 20,
                      width: 'fit-content',
                      height: 'fit-content',
                    }}
                  />
                </div>
              )}
              <header className="detailHeaderContainer">
                <Glyphicon glyph="file" className="detail-header-container-icon" />

                <div className="titleGroup">
                  <div className="detail-header-title">
                    <h2 className="detailHeaderTitle">{this.state.docName}</h2>
                  </div>

                  <div className="detailSubHeader">
                    <div className="detailSubHeaderText">
                      <span className="documentDetailLabel">Document type:</span>
                      <span>{this.state.docType}</span>
                    </div>
                    <div className="detailSubHeaderText">
                      <span className="documentDetailLabel">Datum Aangemaakt:</span>
                      <span>{this.state.docDate}</span>
                    </div>
                  </div>
                </div>

                <div className="detailHeaderControl">{icon_menu}</div>
              </header>

              <hr />

              {this.state.docURL !== '' && (
                <div className="documentContainer">
                  <div className="pusher" />

                  <div className="canvasContainer">
                    {this.state.totalPages > 0 && (
                      <div className="footer-pagination no-text-select">
                        <div className="nav-btn" onClick={() => this.changePage('prev')}>
                          <i className="material-icons">keyboard_arrow_left</i>
                        </div>
                        <div className="page-div">
                          Pagina {this.state.pageIndex + 1} van {this.state.totalPages}
                        </div>
                        <div className="nav-btn" onClick={() => this.changePage('next')}>
                          <i className="material-icons">keyboard_arrow_right</i>
                        </div>
                      </div>
                    )}
                    <div className={this.state.docStyle} onClick={this.handleDocScale}>
                      <Document
                        file={docURL}
                        onLoadSuccess={this.onDocumentLoad}
                        loading={<div className={styles.documentLoading}>PDF laden ...</div>}
                        noData={<div className={styles.documentLoading}>{this.state.pdfMessage}</div>}
                        error={
                          <div className={styles.documentLoading}>
                            Dit type document kunt u niet in deze applicatie openen,{' '}
                            <a target="_blank" href={downloadURL}>
                              download
                            </a>{' '}
                            het Word document om het verder te kunnen bekijken.
                          </div>
                        }
                      >
                        <Page
                          pageIndex={this.state.pageIndex}
                          pageNumber={this.state.pageIndex + 1}
                        />
                      </Document>
                    </div>
                  </div>

                  {/*{docNotes.length > 0 && (*/}
                  <Notes menu={icon_menu} notes={docNotes} editNote={this.editNote} />
                  {/*)}*/}
                </div>
              )}
              {this.state.docURL === '' && <div>No document.</div>}
            </Col>
          </Row>
        </Grid>

        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.messageSnackbar}
          autoHideDuration={100000}
          onRequestClose={() => this.setState({ openSnackbar: false })}
          action="DICHT"
          onActionTouchTap={() => this.setState({ openSnackbar: false })}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    notes: user.notes,
    dossiers: user.dossiers,
    is_admin: user.is_admin,
    is_author: user.type === 'auteur',
    is_raadslid: user.type === 'raadslid',
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
  addFavorite,
  addToDossier,
  setDossierModal,
  setAddNote,
  loadUserDossiers,
  loadMyNotes,
  setSelectedCombinedItemID,
  removeSelectedCombinedItemID,
  changeDocumentPublishStatus,
})(DocumentDetail);
