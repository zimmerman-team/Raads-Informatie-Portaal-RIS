import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Dialog from 'material-ui/Dialog';
import isEqual from 'lodash/isEqual';
/* components */
import { Tooltip } from 'react-tippy';
import CircularProgress from 'material-ui/CircularProgress';
import Agenda from '../../../components/icons/Agenda';
import PageHeader from '../../../components/PageHeader/PageHeader';
import ModalTextField from '../../../components/ModalTextField/ModalTextField';
import ModalDropDown from '../../../components/ModalDropDown/ModalDropDown';
/* actions */
import { setAddUserModal } from '../../../actions/publisherActions';
import { addUser, editUser } from '../../../actions/userActions';
/* styles */
import appResources from '../../../appResources';
import genericStyles from '../PublisherModal.module.scss';
/* mock */
import mock from './AddUserModal.mock';

class AddUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: false,
      lastName: false,
      email: false,
      mobileNumber: false,
      type: '',
      isLoading: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getDisabledTip = this.getDisabledTip.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.userToEdit, prevProps.userToEdit)) {
      if (this.props.userToEdit) {
        const user = this.props.userToEdit;
        this.setState({
          name: user.first_name,
          lastName: user.last_name,
          email: user.email,
          mobileNumber: user.mobile_number,
          type: user.type,
        });
      } else {
        this.setState({
          name: false,
          lastName: false,
          email: false,
          mobileNumber: false,
          type: '',
        });
      }
    }
  }

  handleClose() {
    this.props.setAddUserModal();
  }

  handleSubmit() {
    this.setState({ isLoading: true });
    if (this.props.userToEdit) {
      this.props.editUser(
        this.props.userToEdit.id,
        this.state.name,
        this.state.lastName,
        this.state.email,
        this.state.mobileNumber,
        this.state.type,
        this,
      );
    } else {
      this.props.addUser(
        this.state.name,
        this.state.lastName,
        this.state.email,
        this.state.mobileNumber,
        this.state.type,
        this,
      );
    }
  }

  getDisabledTip() {
    switch (true) {
      case !this.state.name || this.state.name.length === 0:
        return 'Voornaam is verplicht';
      case this.state.name.length > 30:
        return 'Voornaam mag niet langer zijn dan 30 tekens';
      case !this.state.lastName || this.state.lastName.length === 0:
        return 'Achternaam is verplicht';
      case this.state.lastName.length > 30:
        return 'Achternaam mag niet langer zijn dan 30 tekens';
      case !this.state.email || this.state.email.length === 0:
        return 'Email is verplicht';
      case this.state.email.length > 254:
        return 'Email mag niet langer zijn dan 254 tekens';
      case this.state.mobileNumber && this.state.mobileNumber.length > 30:
        return 'Mobiel nummer mag niet langer zijn dan 30 tekens';
      case this.state.type.length === 0:
        return 'Type is verplicht';
      default:
        return false;
    }
  }

  render() {
    const { show } = this.props;
    const titleComponent = (
      <div>
        <PageHeader title={mock.title} icon={<Agenda />} />
      </div>
    );

    const toolTipLabel = this.getDisabledTip();
    const butDisabled = typeof toolTipLabel === 'string';

    const actions = [
      <button
        onClick={this.handleClose}
        className={genericStyles.button}
        style={{ background: '#fa5858', borderColor: '#fa5858' }}
      >
        {mock.cancelButTxt}
      </button>,
      <Tooltip
        style={{ paddingTop: 0 }}
        title={toolTipLabel}
        position="top"
        trigger="mouseenter"
        duration={200}
        disabled={!butDisabled}
      >
        <button
          className={genericStyles.button}
          style={{
            background: appResources.in_content_color,
            borderColor: appResources.in_content_color,
          }}
          disabled={butDisabled}
          onClick={this.handleSubmit}
        >
          {mock.applyButTxt}
        </button>
      </Tooltip>,
    ];

    const defSelectedType = this.props.userToEdit && this.props.userToEdit.type;

    return (
      <Dialog
        open={show}
        modal
        title={titleComponent}
        actions={actions}
        contentStyle={{
          width: '70%',
          maxWidth: 'none',
        }}
        autoScrollBodyContent
        className={genericStyles.modal}
        actionsContainerClassName={genericStyles.btnContainer}
        contentClassName={genericStyles.modalContent}
        titleClassName={genericStyles.title}
        bodyClassName={genericStyles.modalBody}
      >
        {this.state.isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <div className={genericStyles.asteriskMeaning}>
          <span className={genericStyles.asteriskText}>
            <span className={genericStyles.asterisk}>*</span>
            {mock.asteriskTxt}
          </span>
        </div>
        <React.Fragment>
          <ModalDropDown
            required
            items={mock.typeChoices}
            defaultSelected={defSelectedType}
            onItemClick={value => this.setState({ type: value })}
          />
          <ModalTextField
            required
            value={this.state.name}
            hintText={mock.nameTxt}
            handleChange={e => this.setState({ name: e.target.value })}
          />
          <ModalTextField
            required
            value={this.state.lastName}
            hintText={mock.lastNameTxt}
            handleChange={e => this.setState({ lastName: e.target.value })}
          />
          <ModalTextField
            required
            value={this.state.email}
            hintText={mock.emailTxt}
            handleChange={e => this.setState({ email: e.target.value })}
          />
          <ModalTextField
            value={this.state.mobileNumber}
            hintText={mock.mobileNrTxt}
            handleChange={e => this.setState({ mobileNumber: e.target.value })}
          />
        </React.Fragment>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { publisher, user } = state;
  return {
    token: user.token,
    show: publisher.addUserModalVisibility,
    userToEdit: publisher.userToEdit,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    setAddUserModal,
    addUser,
    editUser,
  })(AddUserModal),
);
