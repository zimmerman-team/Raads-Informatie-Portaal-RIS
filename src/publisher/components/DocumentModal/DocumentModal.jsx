import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import shortid from 'shortid';
import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import Dialog from 'material-ui/Dialog';
import { Tooltip } from 'react-tippy';
import Toggle from 'material-ui/Toggle';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import TextField from '../TextField/TextField';
import CheckBox from '../../../components/CheckBox/CheckBox';
import PageHeader from '../../../components/PageHeader/PageHeader';
import {
  setDocumentModal,
  createNewDocuments,
  editDocument,
} from '../../../actions/publisherActions';
import UploadIcon from '../../../components/icons/Upload';
import appResources from '../../../appResources';
import styles from './DocumentModal.module.scss';
import genericStyles from '../../../components/modals/PublisherModal.module.scss';
import mock from './DocumentModal.mock';

class DocumentModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...mock.initialState,
    };

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onAuthorSelect = this.onAuthorSelect.bind(this);
    this.onStatusSelect = this.onStatusSelect.bind(this);
    this.onSubjectSelect = this.onSubjectSelect.bind(this);
    this.onDocTypeSelect = this.onDocTypeSelect.bind(this);
    this.onDossierSelect = this.onDossierSelect.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.onPortfolioSelect = this.onPortfolioSelect.bind(this);
    this.onDocumentCheckboxChange = this.onDocumentCheckboxChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.docData, prevProps.docData)) {
      if (this.props.docData) {
        const doc = this.props.docData;
        const files = [
          {
            id: doc.id,
            enabled: true,
            title: doc.title,
          },
        ];
        const selectedAuthor = doc.author
          ? {
              email: doc.author.email,
              id: doc.author.id,
              name: doc.author.first_name.concat(' ').concat(doc.author.last_name),
              type: doc.author.type,
            }
          : null;
        const selectedDocType = {
          id: doc.id,
          name: doc.prettyType,
          value: doc.type,
        };
        const selectedStatus = doc.statusName
          ? {
              id: 0,
              name: doc.statusName,
            }
          : null;
        const selectedSubject = doc.subject
          ? {
              id: 0,
              name: doc.subject,
            }
          : null;
        const selectedPortfolio = doc.portfolio
          ? {
              id: 0,
              name: doc.portfolio,
            }
          : null;
        const selectedDossier = doc.publicDossier
          ? {
              id: doc.publicDossier.id,
              name: doc.publicDossier.title,
            }
          : null;
        this.setState({
          files,
          selectedAuthor,
          selectedDocType,
          selectedStatus,
          selectedSubject,
          selectedPortfolio,
          selectedDossier,
          published: doc.published,
        });
      } else {
        this.setState({
          ...mock.initialState,
        });
      }
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', e => { this.close(); });
  }

  onSubmit() {
    const data = {
      author_id: get(this.state.selectedAuthor, 'id', null),
      dossier_id: get(this.state.selectedDossier, 'id', null),
      type: get(this.state.selectedDocType, 'value', null),
      status: get(this.state.selectedStatus, 'name', null),
      subject: get(this.state.selectedSubject, 'name', null),
      portfolio: get(this.state.selectedPortfolio, 'name', null),
      published: this.state.published,
    };
    if (this.props.docData) {
      data.doc_id = this.props.docData.id;
      data.prev_type = this.props.docData.type;
      this.props.editDocument(this, mock, data);
    } else {
      const files = this.state.files.map(f => {
        return f.file;
      });
      this.props.createNewDocuments(this, mock, files, data);
    }
  }

  onAuthorSelect(selectedAuthor) {
    this.setState({ selectedAuthor });
  }

  onDocTypeSelect(selectedDocType) {
    this.setState({ selectedDocType });
  }

  onStatusSelect(selectedStatus) {
    this.setState({ selectedStatus });
  }

  onSubjectSelect(selectedSubject) {
    this.setState({ selectedSubject });
  }

  onPortfolioSelect(selectedPortfolio) {
    this.setState({ selectedPortfolio });
  }

  onDossierSelect(selectedDossier) {
    this.setState({ selectedDossier: selectedDossier[0] });
  }

  onDocumentCheckboxChange(e) {
    const files = this.state.files;
    const fileIndex = findIndex(files, i => {
      return i.id === e.target.value;
    });
    if (fileIndex > -1) {
      files[fileIndex].enabled = e.target.checked;
    }
    this.setState({ files });
  }

  removeItem(id) {
    let files = this.state.files;
    if (
      find(files, i => {
        return i.id === id;
      })
    ) {
      files = filter(files, i => {
        return i.id !== id;
      });
    }
    this.setState({ files });
  }

  handleFileUpload(event) {
    const uploadedFiles = event.target.files;
    const files = [];
    if (uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        files.push({
          enabled: true,
          id: shortid.generate(),
          file: uploadedFiles[i],
          size: parseInt(uploadedFiles[i].size, 10),
          title: uploadedFiles[i].name.substr(0, uploadedFiles[i].name.lastIndexOf('.')),
        });
      }
      this.setState({ files: files.concat(this.state.files) });
    }
  }

  close() {
    this.setState({ ...mock.initialState });
    this.props.setDocumentModal();
  }

  render() {
    const submitBtnEnable = !!(
      filter(this.state.files, 'enabled').length > 0 &&
      this.state.selectedDocType &&
      this.state.selectedSubject &&
      this.state.selectedPortfolio
    );
    const titleComponent = (
      <div>
        <PageHeader
          title={this.props.docData ? mock.editTitle : mock.title}
          icon={<Glyphicon glyph="file" className={styles.headerGlyphicon} />}
        />
      </div>
    );
    const actions = [
      <button
        onClick={this.close}
        className={styles.button}
        style={{ background: '#fa5858', borderColor: '#fa5858' }}
      >
        Annuleren
      </button>,
      <Tooltip
        style={{ paddingTop: 0 }}
        title="Moet alle verplichte velden invullen OF er zijn veldfouten"
        position="top"
        trigger="mouseenter"
        disabled={submitBtnEnable}
        duration={200}
      >
        <button
          onClick={this.onSubmit}
          className={styles.button}
          disabled={!submitBtnEnable}
          style={{
            background: appResources.in_content_color,
            borderColor: appResources.in_content_color,
            cursor: submitBtnEnable ? 'pointer' : 'not-allowed',
            marginRight: 0,
          }}
        >
          {this.props.docData ? 'Opslaan' : 'Toevoegen'}
        </button>
      </Tooltip>,
      <span className={styles.toggle}>
        <Toggle
          labelPosition="right"
          label="Publiceren op RIS portaal"
          labelStyle={{
            fontSize: 21,
            color: '#444',
          }}
          toggled={this.state.published}
          onToggle={(e, value) => this.setState({ published: value })}
          style={{
            width: '282px',
            marginTop: 20,
            display: submitBtnEnable ? 'inline-flex' : 'none',
          }}
        />
      </span>,
    ];

    return (
      <Dialog
        modal
        actions={actions}
        open={this.props.show}
        title={titleComponent}
        contentStyle={{
          width: '70%',
          maxWidth: 'none',
        }}
        autoScrollBodyContent
        className={genericStyles.modal}
        actionsContainerClassName={styles.btnContainer}
        contentClassName={styles.modalContent}
        titleClassName={styles.title}
        bodyClassName={styles.modalBody}
        onRequestClose={this.close}
      >
        <React.Fragment>
          <div className={genericStyles.asteriskMeaning}>
            <span className={genericStyles.asteriskText}>
              <span className={genericStyles.asterisk}>*</span>
              Verplichte velten
            </span>
          </div>
          {!this.props.docData && (
            <div className={styles.uploadBox}>
              <UploadIcon className={styles.uploadBoxIcon} />
              <input
                multiple
                type="file"
                id="files"
                name="files"
                onChange={this.handleFileUpload}
                accept=".pdf, .doc, .docx, .odt, .ppt, .pptx"
                className={styles.uploadBoxInput}
              />
              <label htmlFor="files" className={styles.uploadBoxText}>
                Upload één of meerdere documenten
              </label>
              <span className={styles.asterisk}>*</span>
            </div>
          )}
          {this.state.files.map(i => {
            return (
              <div
                key={i.id}
                className={styles.selectedItem}
                style={{ background: appResources.in_content_color }}
              >
                <CheckBox
                  id={i.id}
                  name={i.id}
                  value={i.id}
                  withLabel={false}
                  checked={i.enabled}
                  onChange={this.onDocumentCheckboxChange}
                  customCheckBoxIconColor={appResources.in_content_color}
                  customStyle={{ padding: 0, verticalAlign: 'text-bottom' }}
                  customCheckBoxStyle={{ background: '#fff', borderColor: '#fff' }}
                  disabled={this.props.docData}
                />
                <span className={styles.itemName}>{i.title}</span>
                <i
                  className={cx('material-icons', styles.removeIcon)}
                  onClick={() => !this.props.docData && this.removeItem(i.id)}
                >
                  cancel
                </i>
              </div>
            );
          })}
          {this.state.files.length > 0 && (
            <React.Fragment>
              <div className={styles.fieldTitleContainer}>
                <h1 className={styles.fieldsTitle}>Voeg meta data aan document(en) toe</h1>
              </div>
              <TextField
                type="author"
                required={false}
                token={this.props.token}
                hintText="Selecteer een auteur"
                reduxItemsAdd={this.onAuthorSelect}
                template={this.state.selectedAuthor}
              />
              <TextField
                required
                isReadOnly
                type="doc_type"
                reduxItemsAdd={this.onDocTypeSelect}
                template={this.state.selectedDocType}
                hintText="Selecteer een type bijlage"
              />
              <TextField
                required={false}
                type="status"
                reduxItemsAdd={this.onStatusSelect}
                template={this.state.selectedStatus}
                hintText="Selecteer of Typ de status van het document"
              />
              <TextField
                required
                type="subject"
                hintText="Selecteer of Typ een onderwerp"
                reduxItemsAdd={this.onSubjectSelect}
                template={this.state.selectedSubject}
              />
              <TextField
                required
                type="portfolio"
                hintText="Selecteer of Typ een Portefeuille"
                reduxItemsAdd={this.onPortfolioSelect}
                template={this.state.selectedPortfolio}
              />
              <TextField
                required={false}
                dossierSingleSelect
                type="public_dossier"
                token={this.props.token}
                reduxItemsAdd={this.onDossierSelect}
                template={this.state.selectedDossier}
                hintText="Selecteer een dossier of sub-dossier"
              />
              <hr className={styles.divider} style={{ marginBottom: 0 }} />
            </React.Fragment>
          )}
        </React.Fragment>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { user, publisher } = state;
  return {
    docData: publisher.docData,
    token: user.token,
    show: publisher.newDocumentModalVisibility,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    setDocumentModal,
    createNewDocuments,
    editDocument,
  })(DocumentModal),
);
