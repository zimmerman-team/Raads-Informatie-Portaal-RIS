import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import map from 'lodash/map';
// import filter from 'lodash/filter';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import HeaderIcon from '../../../components/icons/Agenda';
import PageHeader from '../../../components/PageHeader/PageHeader';
import TextField from '../TextField/TextField';
import { getEventDocuments } from './Helper';
import { setSnackBar } from '../../../actions/generalActions';
import {
  setEventDocuments,
  addEventDocuments,
  setEventDocumentModal,
  clearEventDocumentData,
} from '../../../actions/publisherActions';
import mock from './EventAddDocumentModal.mock';
import styles from './EventAddDocumentModal.module.scss';
import genericStyles from '../../../components/modals/PublisherModal.module.scss';

class EventAddDocumentModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...mock.initialState,
    };

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.editInitialItem = this.editInitialItem.bind(this);
  }

  componentDidMount() {
    const that = this;
    window.onbeforeunload = function(e) {
      that.close();
    };
    if (this.props.show) {
      getEventDocuments(this);
    }
  }

  editInitialItem(id, value) {
    this.setState({
      initialDocuments: map(this.state.documents, i => {
        return {
          ...i,
          _delete: i.id === id ? value : i._delete,
        };
      }),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.close();
    } else if (prevProps.location.search !== this.props.location.search) {
      this.close();
    }
    if (prevProps.show !== this.props.show) {
      getEventDocuments(this);
    }
  }

  onSubmit() {
    const docs = this.props.documents.map(d => {
      return {
        type: d.type,
        id: d.item_id,
      };
    });
    // const removeDocs = map(
    //   filter(this.state.initialDocuments, d => {
    //     return d._delete;
    //   }),
    //   i => {
    //     return {
    //       id: i.id,
    //       type: i.item_type,
    //     };
    //   },
    // );
    if (docs) {
      this.props.addEventDocuments(this, docs, mock.initialState);
    }
  }

  close() {
    this.setState({ ...mock.initialState });
    this.props.clearEventDocumentData();
    this.props.setEventDocumentModal();
  }

  render() {
    const submitBtnEnable = this.props.documents.length > 0;
    const titleComponent = (
      <div>
        <PageHeader title={mock.title} icon={<HeaderIcon />} />
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
      <button
        onClick={() => this.onSubmit(true)}
        className={styles.button}
        disabled={!submitBtnEnable}
        style={{
          background: '#0ba534',
          borderColor: '#0ba534',
          display: submitBtnEnable ? 'inline-block' : 'none',
        }}
      >
        Toevoegen
      </button>,
    ];

    return (
      <Dialog
        open={this.props.show}
        modal
        title={titleComponent}
        actions={actions}
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
        {this.state.isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <TextField
          type="document"
          required={false}
          initialItems={[]}
          showSelectedItems
          token={this.props.token}
          hintText="Voeg documenten toe"
          reduxItems={this.props.documents}
          reduxItemsAdd={this.props.setEventDocuments}
        />
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { user, publisher, singleEvent } = state;
  return {
    token: user.token,
    show: publisher.eventDocumentModalVisibility,
    documents: publisher.eventDocumentModalDocuments,
    singleEvent,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    setSnackBar,
    setEventDocuments,
    addEventDocuments,
    setEventDocumentModal,
    clearEventDocumentData,
  })(EventAddDocumentModal),
);
