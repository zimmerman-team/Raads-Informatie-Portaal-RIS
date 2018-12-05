import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import appResources from '../appResources';
import { setSnackBar } from '../actions/generalActions';
import { confirmShareDossier } from '../actions/folderActions';

class FolderInvitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invitation: {},
      disableBtn: false,
    };

    this.getInvitation = this.getInvitation.bind(this);
  }

  componentWillMount() {
    this.getInvitation(this.props.params.id);
  }

  getInvitation(uuid) {
    const _this = this;
    axios
      .post(`${appResources.backendUrl}dossier/get_invitation/`, { uuid })
      .then(response => {
        _this.setState({ invitation: response.data.response });
      })
      .catch(error => {
        _this.props.setSnackBar(error.response.data);
        _this.setState({ disableBtn: true });
      });
  }

  render() {
    const { invitation, disableBtn } = this.state;
    return (
      <div className="about-page">
        <div className="folder-header" style={{ marginBottom: '15px' }}>
          <div className="header-title-container">
            <i
              className="material-icons"
              style={{
                lineHeight: '0.9',
                fontSize: '56px',
                marginLeft: '-20px',
                marginRight: '0',
                color: appResources.color_normal,
              }}
            >
              folder
            </i>
            {!disableBtn && (
              <div className="header-folder-title">
                Gebruiker <b>{invitation.user}</b> wil map <b>{invitation.folder}</b> met u delen
              </div>
            )}
            {disableBtn && (
              <div className="header-folder-title">Folder delen uitnodiging niet gevonden</div>
            )}
          </div>
        </div>
        {invitation.confirmed && (
          <div>
            Deze uitnodiging voor het delen van folders is al bevestigd. Controleer de sectie{' '}
            <b>Mijn folders.</b>
          </div>
        )}
        {!invitation.confirmed &&
          !disableBtn && (
            <button onClick={() => this.props.confirmShareDossier(this.props.params.id)}>
              Accept
            </button>
          )}
      </div>
    );
  }
}

export default connect(null, {
  setSnackBar,
  confirmShareDossier,
})(FolderInvitation);
