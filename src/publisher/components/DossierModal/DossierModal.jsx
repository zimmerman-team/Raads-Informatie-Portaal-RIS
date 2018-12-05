import React from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { Tooltip } from 'react-tippy';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import HeaderIcon from '../../../components/icons/Folder';
import PageHeader from '../../../components/PageHeader/PageHeader';
import { setSnackBar } from '../../../actions/generalActions';
import {
  editPublicDossier,
  createPublicDossier,
  setPublicDossierModal,
  clearPublicDossierModalData,
  setPublicDossierSelectedDocuments,
  setPublicDossierSelectedDossiers,
} from '../../../actions/publisherActions';
import mock from './DossierModal.mock';
import styles from './DossierModal.module.scss';
import genericStyles from '../../../components/modals/PublisherModal.module.scss';
import TextField from '../TextField/TextField';
import appResources from '../../../appResources';
import { getPublicDossier } from './Helper';

class DossierModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...mock.initialState,
    };

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.editInitialItem = this.editInitialItem.bind(this);
  }

  close() {
    this.props.clearPublicDossierModalData();
    this.props.setPublicDossierModal();
    this.setState({ ...mock.initialState });
  }

  onTitleChange(title, titleExists) {
    this.setState({ title, titleExists });
  }

  onSubmit(e) {
    const docs = this.props.documents.map(d => {
      return {
        id: d.id,
        type: d.type,
      };
    });
    const removeDocs = map(
      filter(this.state.selectedPublicDossierDocuments, d => {
        return d._delete;
      }),
      i => {
        return {
          id: i.id,
          type: i.item_type,
        };
      },
    );
    const removeFromDossiers = map(
      filter(this.state.selectedPublicDossierDossiers, d => {
        return d._delete;
      }),
      i => {
        return {
          id: i.id,
          type: 'public_dossier',
        };
      },
    );
    if (this.state.editMode) {
      this.setState({ isLoading: true });
      this.props.editPublicDossier(
        this.props.selectedPublicDossierID,
        this.state.title,
        removeDocs,
        docs,
        removeFromDossiers,
        this.props.dossiers,
        this.state.published,
        id => {
          if (
            this.props.location.pathname.indexOf('publieke-dossier') > -1 &&
            this.props.params.id
          ) {
            window.location.reload();
          } else {
            browserHistory.push(`/publieke-dossiers/${id}`);
          }
        },
        this,
        mock.initialState,
      );
    } else {
      this.setState({ isLoading: true });
      this.props.createPublicDossier(
        this.state.title,
        docs,
        this.props.dossiers,
        this.state.published,
        id => {
          browserHistory.push(`/publieke-dossiers/${id}`);
        },
        this,
        mock.initialState,
      );
    }
  }

  editInitialItem(id, value, type = 'document') {
    if (type === 'document') {
      this.setState({
        selectedPublicDossierDocuments: map(this.state.selectedPublicDossierDocuments, i => {
          return {
            ...i,
            _delete: i.id === id ? value : i._delete,
          };
        }),
      });
    } else {
      this.setState({
        selectedPublicDossierDossiers: map(this.state.selectedPublicDossierDossiers, i => {
          return {
            ...i,
            _delete: i.id === id ? value : i._delete,
          };
        }),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.show !== this.props.show &&
      this.props.show &&
      this.props.selectedPublicDossierID
    ) {
      this.setState({ loadingExistingDossier: true });
      getPublicDossier(this.props.selectedPublicDossierID, this);
    }
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.close();
    }
  }

  componentDidMount() {
    const that = this;
    window.onbeforeunload = function(e) {
      that.close();
    };
  }

  render() {
    const { show } = this.props;
    const submitBtnEnable = this.state.editMode
      ? this.state.title !== '' &&
        (!this.state.titleExists || this.state.title === this.state.selectedPublicDossierTitle)
      : this.state.title !== '' && !this.state.titleExists;

    const titleComponent = (
      <div>
        <PageHeader
          title={
            this.state.editMode || this.state.loadingExistingDossier
              ? mock.editTitle
              : mock.createTitle
          }
          icon={<HeaderIcon />}
        />
      </div>
    );
    const actions = [
      <button
        onClick={this.close}
        className={genericStyles.button}
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
          className={genericStyles.button}
          style={{
            background: appResources.in_content_color,
            borderColor: appResources.in_content_color,
          }}
          onClick={this.onSubmit}
          disabled={!submitBtnEnable}
        >
          {this.state.editMode ? 'Wijzigingen opslaan' : 'Toevoegen'}
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
        open={show}
        modal
        title={titleComponent}
        actions={this.state.loadingExistingDossier ? [] : actions}
        contentStyle={{
          width: '70%',
          maxWidth: 'none',
        }}
        autoScrollBodyContent
        className={genericStyles.modal}
        paperClassName={genericStyles.modalPaper}
        actionsContainerClassName={genericStyles.btnContainer}
        contentClassName={genericStyles.modalContent}
        titleClassName={genericStyles.title}
        bodyClassName={genericStyles.modalBody}
        onRequestClose={this.close}
      >
        {this.state.loadingExistingDossier && (
          <div className={styles.loadingDiv}>Loading dossier data...</div>
        )}
        {this.state.isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        {!this.state.loadingExistingDossier && (
          <React.Fragment>
            <div className={genericStyles.asteriskMeaning}>
              <span className={genericStyles.asteriskText}>
                <span className={genericStyles.asterisk}>*</span>
                Verplichte velten
              </span>
            </div>
            <React.Fragment>
              <TextField
                type="title"
                hintText="Titel"
                token={this.props.token}
                initialValue={this.state.title}
                reduxItemsAdd={this.onTitleChange}
              />
              <TextField
                type="document"
                required={false}
                showSelectedItems
                token={this.props.token}
                reduxItems={this.props.documents}
                hintText="Selecteer een of meerdere documenten"
                editInitialItem={this.editInitialItem}
                initialItems={filter(this.state.selectedPublicDossierDocuments, d => {
                  return !d._delete;
                })}
                reduxItemsAdd={this.props.setPublicDossierSelectedDocuments}
              />
              <TextField
                required={false}
                type="public_dossier"
                modalType="dossier"
                token={this.props.token}
                reduxItems={this.props.dossiers}
                editInitialItem={this.editInitialItem}
                hintText="Of voeg toe als sub dossier aan bestaand dossier"
                reduxItemsAdd={this.props.setPublicDossierSelectedDossiers}
                selectedPublicDossierID={this.props.selectedPublicDossierID}
                initialItems={filter(this.state.selectedPublicDossierDossiers, d => {
                  return !d._delete;
                })}
              />
            </React.Fragment>
          </React.Fragment>
        )}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { publisher, user } = state;
  return {
    token: user.token,
    show: publisher.publicDossierModalVisibility,
    dossierID: publisher.publicDossierSelectedID,
    documents: publisher.publicDossierSelectedDocuments,
    dossiers: publisher.publicDossierSelectedDossiers,
    selectedPublicDossierID: publisher.publicDossierSelectedID,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    setSnackBar,
    editPublicDossier,
    createPublicDossier,
    setPublicDossierModal,
    clearPublicDossierModalData,
    setPublicDossierSelectedDocuments,
    setPublicDossierSelectedDossiers,
  })(DossierModal),
);
