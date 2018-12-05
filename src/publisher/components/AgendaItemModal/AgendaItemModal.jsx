import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import { Tooltip } from 'react-tippy';
import HeaderIcon from '../../../components/icons/Agenda';
import PageHeader from '../../../components/PageHeader/PageHeader';
import TextField from '../TextField/TextField';
import {
  timeValidation,
  getEventDetails,
  getAgendaItemDetails,
  getExistingAgendaItem,
} from './Helper';
import { setSnackBar } from '../../../actions/generalActions';
import {
  editAgendaItem,
  setAgendaItemModal,
  createNewAgendaItem,
  clearAgendaItemModalData,
  setAgendaItemSelectedDocuments,
  setAgendaItemSelectedDossiers,
} from '../../../actions/publisherActions';
import styles from './AgendaItemModal.module.scss';
import mock from './AgendaItemModal.mock';
import CancelIcon from '../../../icons/cancel.svg';
import EventSelectTime from '../EventModal/EventDate/EventSelectTime';
import genericStyles from '../../../components/modals/PublisherModal.module.scss';

const dropdownContainerStyle = {
  width: 200,
  margin: '0 20px 0 0',
  verticalAlign: 'top',
};

class AgendaItemModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...mock.initialState,
    };

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.editInitialItem = this.editInitialItem.bind(this);
    this.onGriffierSelect = this.onGriffierSelect.bind(this);
    this.onMedewerkerSelect = this.onMedewerkerSelect.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onAgendaItemSelection = this.onAgendaItemSelection.bind(this);
  }

  componentDidMount() {
    const that = this;
    window.onbeforeunload = function(e) {
      that.close();
    };
    if (this.props.show) {
      getEventDetails(this);
    }
  }

  editInitialItem(id, value, type = 'document') {
    if (type === 'document') {
      this.setState({
        toEditAgendaItemItems: {
          ...this.state.toEditAgendaItemItems,
          documents: map(get(this.state.toEditAgendaItemItems, 'documents', []), i => {
            return {
              ...i,
              _delete: i.id === id ? value : i._delete,
            };
          }),
        },
      });
    } else {
      this.setState({
        toEditAgendaItemItems: {
          ...this.state.toEditAgendaItemItems,
          dossiers: map(get(this.state.toEditAgendaItemItems, 'dossiers', []), i => {
            return {
              ...i,
              _delete: i.item_id === id ? value : i._delete,
            };
          }),
        },
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.close();
    } else if (prevProps.location.search !== this.props.location.search) {
      this.close();
    }
    if (prevProps.show !== this.props.show) {
      getEventDetails(this);
      if (this.props.selectedAgendaItemID) {
        getAgendaItemDetails(this);
      }
    }
  }

  onAgendaItemSelection(selectedAgendaItem) {
    this.setState(
      {
        title: selectedAgendaItem.name,
        loadingExistingAgendaItem: true,
        selectedAgendaItem: selectedAgendaItem.id,
      },
      () => {
        getExistingAgendaItem(selectedAgendaItem.id, this);
      },
    );
  }

  onGriffierSelect(selectedGriffier) {
    this.setState({ selectedGriffier });
  }

  onMedewerkerSelect(selectedMedewerker) {
    this.setState({ selectedMedewerker });
  }

  onTitleChange(title) {
    this.setState({
      title,
      selectedAgendaItem: title === '' ? null : this.state.selectedAgendaItem,
    });
  }

  onDescriptionChange(description) {
    this.setState({ description });
  }

  onTimeButtonClick(type) {
    this.setState({ [type]: !this.state[type] }, () => {
      timeValidation(this);
    });
  }

  onTimeChange(type, value) {
    this.setState({ [type]: value }, () => {
      timeValidation(this);
    });
  }

  onOrderChange(order) {
    this.setState({ order });
  }

  onSubmit() {
    const startTime = this.state.showStartTime
      ? `${moment(this.state.event.start_time).format('YYYY-MM-DD')} ${this.state.startTime}`
      : null;
    const endTime = this.state.showEndTime
      ? `${moment(this.state.event.start_time).format('YYYY-MM-DD')} ${this.state.endTime}`
      : null;
    const order = this.state.order < 1 ? null : this.state.order;
    if (this.state.editMode) {
      const docs = this.props.documents.map(d => {
        return {
          id: d.id,
          type: d.type,
        };
      });
      const removeDocs = map(
        filter(get(this.state.toEditAgendaItemItems, 'documents', []), d => {
          return d._delete;
        }),
        i => {
          return {
            id: i.id,
            type: i.item_type,
          };
        },
      );
      const removeDossiers = map(
        filter(get(this.state.toEditAgendaItemItems, 'dossiers', []), d => {
          return d._delete;
        }),
        i => {
          return {
            id: i.id,
            type: i.item_type,
          };
        },
      );
      this.props.editAgendaItem(
        this.props.selectedAgendaItemID,
        this.state.title,
        this.state.description,
        startTime,
        endTime,
        mock,
        this,
        docs,
        this.props.dossiers.map(d => d.id),
        removeDocs,
        removeDossiers,
        get(this.state.selectedGriffier, 'id', null),
        get(this.state.selectedMedewerker, 'id', null),
        order,
      );
    } else {
      this.props.createNewAgendaItem(
        this,
        mock,
        this.state.event.id,
        this.state.title,
        this.state.selectedAgendaItem ? '' : this.state.description,
        startTime,
        endTime,
        this.props.documents.map(d => {
          return { id: d.id, type: d.type };
        }),
        this.props.dossiers.map(d => d.id),
        get(this.state.selectedGriffier, 'id', null),
        get(this.state.selectedMedewerker, 'id', null),
        order,
      );
    }
  }

  close() {
    this.setState({ ...mock.initialState });
    this.props.clearAgendaItemModalData();
    this.props.setAgendaItemModal();
  }

  render() {
    let submitBtnEnable = this.state.selectedAgendaItem !== null || this.state.title !== '';
    if (this.state.showStartTime) {
      submitBtnEnable = submitBtnEnable && !this.state.timeError;
    }
    const titleComponent = (
      <div>
        <PageHeader
          title={this.state.editMode ? mock.editTitle : mock.createTitle}
          icon={<HeaderIcon />}
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
          onClick={() => this.onSubmit(true)}
          className={styles.button}
          disabled={!submitBtnEnable}
          style={{
            background: '#0ba534',
            borderColor: '#0ba534',
            cursor: submitBtnEnable ? 'pointer' : 'not-allowed',
          }}
        >
          {this.state.editMode ? 'Wijzigingen opslaan' : 'Toevoegen aan evenement'}
        </button>
      </Tooltip>,
    ];

    return (
      <Dialog
        open={this.props.show}
        modal
        title={titleComponent}
        actions={this.state.loadingExistingAgendaItem ? [] : actions}
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
        {this.state.loadingExistingAgendaItem && (
          <div className={styles.loadingDiv}>Loading agendapunt data...</div>
        )}
        {this.state.isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        {!this.state.loadingExistingAgendaItem && (
          <React.Fragment>
            <div className={styles.asteriskMeaning}>
              <span className={styles.asteriskText}>
                <span className={styles.asterisk}>*</span>
                Verplichte velten
              </span>
            </div>
            <React.Fragment>
              <div className={styles.eventInfo}>
                <b>Geselecteerd evenement:</b>{' '}
                {this.state.event.parent_event_name || this.state.event.name}
              </div>
              <div className={styles.eventInfo}>
                <b>Zaal/Locatie:</b> {this.state.event.location}
              </div>
              <div className={styles.eventInfo}>
                <b>Zaal evenement starttijd & eindtijd:</b>{' '}
                {this.state.event.start_time
                  ? moment(this.state.event.start_time).format('HH:mm')
                  : ''}
                {this.state.event.start_time && this.state.event.end_time && ' - '}
                {this.state.event.end_time ? moment(this.state.event.end_time).format('HH:mm') : ''}
              </div>
              <div className={styles.eventInfo}>
                <b>ID:</b> {this.state.nextAgendaID}
              </div>
              <hr className={styles.divider} />
              <TextField
                type="author"
                required={false}
                token={this.props.token}
                hintText="Selecteer een griffier"
                reduxItemsAdd={this.onGriffierSelect}
                template={this.state.selectedGriffier}
              />
              <TextField
                type="author"
                required={false}
                token={this.props.token}
                hintText="Selecteer een medewerker"
                reduxItemsAdd={this.onMedewerkerSelect}
                template={this.state.selectedMedewerker}
              />
              <hr className={styles.divider} />
              <TextField
                required
                type="title"
                hintText="Titel agendapunt"
                reduxItemsAdd={this.onTitleChange}
                template={{ name: this.state.title }}
                politiekeMarktNumber={this.state.politiekeMarktNumber}
              />
              <TextField
                required={false}
                type="description"
                hintText="Toelichting geven"
                reduxItemsAdd={this.onDescriptionChange}
                template={{ name: this.state.description }}
              />
              {!this.state.editMode && (
                <React.Fragment>
                  {!this.state.selectedAgendaItem && (
                    <div className={styles.lineText}>Of kies een bestaand agenda item</div>
                  )}
                  <TextField
                    required={false}
                    type="agenda_item"
                    token={this.props.token}
                    template={this.state.selectedAgendaItem}
                    hintText="Selecteer een agenda item of unique ID"
                    reduxItemsAdd={this.onAgendaItemSelection}
                  />
                </React.Fragment>
              )}
              <hr className={styles.divider} />
              <React.Fragment>
                <div className={styles.timesTitle}>
                  Selecteer een begin & einddtijd
                  {this.state.editMode &&
                    this.state.showStartTime &&
                    this.state.showEndTime && (
                      <a
                        onClick={() =>
                          this.setState({
                            showStartTime: false,
                            showEndTime: false,
                            clearTimes: true,
                          })
                        }
                      >
                        {' | '}Duidelijke tijden
                      </a>
                    )}
                </div>
              </React.Fragment>
              {!this.state.showStartTime && (
                <button
                  className={styles.timeButton}
                  onClick={() => this.onTimeButtonClick('showStartTime')}
                >
                  Kies een begintijd
                </button>
              )}
              {this.state.showStartTime && (
                <EventSelectTime
                  disabled={false}
                  showError={false}
                  hasCheckBox={false}
                  value={this.state.startTime}
                  dropdownContainerStyle={dropdownContainerStyle}
                  onChange={v => this.onTimeChange('startTime', v)}
                />
              )}
              {!this.state.showEndTime && (
                <button
                  className={styles.timeButton}
                  disabled={!this.state.showStartTime}
                  onClick={() => this.onTimeButtonClick('showEndTime')}
                >
                  Kies een eindtijd
                </button>
              )}
              {this.state.showEndTime && (
                <EventSelectTime
                  disabled={false}
                  showError={false}
                  hasCheckBox={false}
                  value={this.state.endTime}
                  dropdownContainerStyle={dropdownContainerStyle}
                  onChange={v => this.onTimeChange('endTime', v)}
                />
              )}
              {this.state.timeError &&
                (this.state.showStartTime || this.state.showEndTime) && (
                  <div className={styles.errorContainer}>
                    <img alt="error" src={CancelIcon} width={22} height={22} />
                    <span>{this.state.timeErrorText}</span>
                  </div>
                )}
              <React.Fragment>
                <hr className={styles.divider} />
                <div className={styles.timesTitle}>Volgorde agendapunt</div>
                <div style={{ width: 200 }}>
                  <TextField
                    min={0}
                    type="number"
                    required={false}
                    inputType="number"
                    reduxItemsAdd={this.onOrderChange}
                    template={{
                      name: parseInt(this.state.order, 10) < 1 ? '-' : this.state.order,
                      value: this.state.order,
                    }}
                  />
                </div>
              </React.Fragment>
              <React.Fragment>
                <hr className={styles.divider} />
                <TextField
                  type="document"
                  required={false}
                  showSelectedItems
                  token={this.props.token}
                  modalType="agenda_item"
                  hintText="Voeg documenten toe"
                  reduxItems={this.props.documents}
                  editInitialItem={this.editInitialItem}
                  initialItems={filter(
                    get(this.state.toEditAgendaItemItems, 'documents', []),
                    d => {
                      return !d._delete;
                    },
                  )}
                  reduxItemsAdd={this.props.setAgendaItemSelectedDocuments}
                />
                <TextField
                  required={false}
                  type="public_dossier"
                  modalType="agendapunt"
                  token={this.props.token}
                  hintText="Voeg dossier(s) toe"
                  reduxItems={this.props.dossiers}
                  reduxItemsAdd={this.props.setAgendaItemSelectedDossiers}
                  editInitialItem={this.editInitialItem}
                  initialItems={filter(get(this.state.toEditAgendaItemItems, 'dossiers', []), d => {
                    return !d._delete;
                  })}
                />
              </React.Fragment>
              <hr className={styles.divider} style={{ marginBottom: 0 }} />
            </React.Fragment>
          </React.Fragment>
        )}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { user, publisher, singleEvent } = state;
  return {
    token: user.token,
    selectedEventID: publisher.selectedEventID,
    show: publisher.newAgendaItemModalVisibility,
    agendaItemID: publisher.newAgendaItemSelectedID,
    documents: publisher.newAgendaItemSelectedDocuments,
    dossiers: publisher.newAgendaItemSelectedDossiers,
    selectedAgendaItemID: publisher.newAgendaItemSelectedID,
    selectedRoomID: publisher.selectedEventID,
    selectedIndex: publisher.newAgendaItemSelectedIndex,
    singleEvent,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    setSnackBar,
    editAgendaItem,
    setAgendaItemModal,
    createNewAgendaItem,
    clearAgendaItemModalData,
    setAgendaItemSelectedDocuments,
    setAgendaItemSelectedDossiers,
  })(AgendaItemModal),
);
