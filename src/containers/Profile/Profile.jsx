import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isLoggedIn } from '../../helpers';
import appResources from '../../appResources';
import { setSnackBar } from '../../actions/generalActions';
import { editProfileData, deleteAccount } from '../../actions/userActions';
import ProfileIcon from '../../components/icons/Profile';

const infolabelstyle = {
  color: '#444444',
  margin: '5px 0',
  padding: '5px 10px',
  borderRadius: '3px',
  border: '1px solid #fff',
};

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openSnackbar: false,
      snackbarMessage: '',
      selectedOption: 0,
      uname: props.user.username,
      email: props.user.email,
      firstName: props.user.name,
      lastName: props.user.surname,
      password: '',
      newPassword: '',
      newPassword2: '',
      unameError: '',
      emailError: '',
      passwordError: '',
      newPasswordError: '',
      newPassword2Error: '',
      openPrompt: false,
      profilePic: props.user.prof_pic,
      profilePicView: props.user.prof_pic,
      showUploadDialog: false,
      inputLabelColor: '#000',
      showPicInfoLabel: false,
    };

    this.usernameValidation = this.usernameValidation.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.currentPasswordValidation = this.currentPasswordValidation.bind(this);
    this.passwordValidation = this.passwordValidation.bind(this);
    this.password2Validation = this.password2Validation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.handlePicture = this.handlePicture.bind(this);
  }

  usernameValidation(value) {
    let usernameError;
    if (value === '') {
      usernameError = '';
    } else {
      usernameError = '';
    }
    this.setState({ unameError: usernameError, uname: value });
    return usernameError === '';
  }

  emailValidation(value) {
    let emailError;
    if (value !== '') {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/g;
      emailError = !regex.test(value) ? 'Niet een geldige email.' : '';
    } else {
      emailError = '';
    }
    this.setState({ emailError, email: value });
    return emailError === '';
  }

  currentPasswordValidation(value) {
    let passwordError;
    if (value === '') {
      passwordError = 'Verplicht';
    } else {
      passwordError = '';
    }
    this.setState({ passwordError, password: value });
    return passwordError === '';
  }

  passwordValidation(value) {
    let passwordError = '';
    if (value !== '') {
      if (value.length < 8) {
        passwordError = 'Wachtwoord moet minimaal 8 tekens (letters en cijfers) lang zijn.';
      }
    } else {
      passwordError = '';
    }
    this.password2Validation(this.refs.new_pass_2_input.getValue());
    this.setState({ newPasswordError: passwordError, newPassword: value });
    return passwordError === '';
  }

  password2Validation(value) {
    let passwordError;
    if (value !== this.refs.new_pass_input.getValue()) {
      passwordError = 'Wachtwoorden moeten overeenkomen';
    } else {
      passwordError = '';
    }
    this.setState({ newPassword2Error: passwordError, newPassword2: value });
    return passwordError === '';
  }

  handleSubmit() {
    if (isLoggedIn()) {
      if (
        this.refs.uname_input.getValue() !== '' ||
        this.refs.email_input.getValue() !== '' ||
        (this.refs.current_pass_input.getValue() !== '' &&
          this.refs.new_pass_input.getValue() !== '' &&
          this.refs.new_pass_2_input.getValue() !== '')
      ) {
        if (
          this.usernameValidation(this.refs.uname_input.getValue()) ||
          this.emailValidation(this.refs.email_input.getValue()) ||
          (this.currentPasswordValidation(this.refs.current_pass_input.getValue()) &&
            this.passwordValidation(this.refs.new_pass_input.getValue()) &&
            this.password2Validation(this.refs.new_pass_2_input.getValue()))
        ) {
          this.sendForm();
        }
      }
    } else {
      this.setSnackBar('U moet ingelogd zijn voor deze optie');
    }
  }

  sendForm() {
    const { user } = this.props;
    const requests = [];

    const formData = new FormData();
    formData.append('username', this.refs.uname_input.getValue());
    formData.append('email', this.refs.email_input.getValue());
    formData.append('first_name', this.state.firstName);
    formData.append('last_name', this.state.lastName);

    if (this.state.profilePic !== user.prof_pic)
      formData.append('profile_pic', this.state.profilePic);

    if (!sessionStorage.getItem('is_social_account')) {
      const passwordObj = {
        old_password: this.refs.current_pass_input.getValue(),
        new_password1: this.refs.new_pass_input.getValue(),
        new_password2: this.refs.new_pass_2_input.getValue(),
      };
      if (
        this.refs.current_pass_input.getValue() !== '' &&
        this.refs.new_pass_input.getValue() !== '' &&
        this.refs.new_pass_2_input.getValue() !== ''
      ) {
        formData.append('old_password', passwordObj.old_password);
        formData.append('password', passwordObj.new_password1);
      }
    }

    if (this.refs.uname_input.getValue() !== '' || this.refs.email_input.getValue() !== '') {
      requests.push(
        axios.put(`accounts/profile/change/`, formData, {
          headers: {
            Authorization: `Token ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
      );
      this.setState({ showPicInfoLabel: false });
    }

    this.props.editProfileData(requests);
  }

  clearForm() {
    this.setState({
      password: '',
      newPassword: '',
      newPassword2: '',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.clearForm !== this.props.user.clearForm) this.clearForm();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.token !== this.props.user.token ||
      nextProps.user.email !== this.props.user.email ||
      nextProps.user.username !== this.props.user.username ||
      nextProps.user.prof_pic !== this.props.user.prof_pic
    ) {
      this.setState({
        email: nextProps.user.email,
        uname: nextProps.user.username,
        profilePic: nextProps.user.prof_pic,
        profilePicView: nextProps.user.prof_pic,
      });
    }
  }

  handlePicture(event) {
    if (event.target.files[0] && parseInt(event.target.files[0].size, 10) > 10000000) {
      this.setState({
        inputLabelColor: '#FF0000',
      });
    } else if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () =>
        this.setState({
          profilePicView: [reader.result],
          showUploadDialog: false,
          inputLabelColor: '#000000',
          profilePic: file,
          showPicInfoLabel: true,
        });
    }
  }

  render() {
    document.title = `${appResources.documentTitle} | Profiel`;
    const { deleteAccount } = this.props;
    const actions = [
      <Button
        style={{
          fontSize: '1.2rem',
          background: appResources.in_content_color,
          color: '#fff',
          marginRight: 10,
        }}
        onClick={() => this.setState({ openPrompt: false })}
      >
        Nee
      </Button>,
      <Button
        style={{ fontSize: '1.2rem', background: appResources.in_content_color, color: '#fff' }}
        onClick={() => deleteAccount()}
      >
        Ja
      </Button>,
    ];
    return (
      <div className="basePage dashboard-tab-content">
        <Dialog
          title="Weet u zeker dat u het profiel wil verwijderen?"
          actions={actions}
          modal={false}
          open={this.state.openPrompt}
          onRequestClose={() => this.setState({ openPrompt: false })}
        />

        <Dialog
          title="Maximale bestandsgrootte 10MB"
          modal={false}
          titleStyle={{ color: this.state.inputLabelColor }}
          open={this.state.showUploadDialog}
          onRequestClose={() => this.setState({ showUploadDialog: false })}
        >
          <input
            type="file"
            name="file"
            id="file"
            className="inputfile"
            accept=".jpg,.png"
            onChange={this.handlePicture}
          />
          <label htmlFor="file">Kies een afbeelding</label>
        </Dialog>
        {this.props.user.isLoading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress size={80} thickness={5} color={appResources.basicColor} />
          </div>
        )}
        <Grid fluid>
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <div>
                <div className="dashboard-header">
                  <div className="dashboard-header-icon">
                    <ProfileIcon />
                  </div>
                  <div className="dashboard-header-title">Mijn Profiel</div>
                  <span
                    className="delete-profile-txt"
                    onClick={() => this.setState({ openPrompt: true })}
                  >
                    Verwijder profiel
                  </span>
                </div>
                <hr style={{ height: '2px', backgroundColor: '#fff', marginBottom: '4%' }} />
              </div>
            </Col>
          </Row>
          <Row className="dashboard-main-container">
            {false && (
              <Col sm={3} md={3} lg={3} className="dashboard-picture">
                <img
                  style={{ paddingBottom: '0.5rem' }}
                  alt="placeholder"
                  src={this.state.profilePicView}
                  height="200"
                  width="200"
                />
                {this.state.showPicInfoLabel && (
                  <label style={infolabelstyle}>
                    Om de upload te voltooien, klik je onderaan op de verzendknop
                  </label>
                )}
                <Button
                  className="dashboard-submit-btn"
                  style={appResources.profileButtonStyle}
                  onClick={() => {
                    if (isLoggedIn()) this.setState({ showUploadDialog: true });
                    else this.props.setSnackBar('U moet ingelogd zijn voor deze optie');
                  }}
                >
                  Foto aanpassen
                </Button>
              </Col>
            )}
            <Col sm={12} md={12} lg={12} className="dashboard-user-fields">
              <div>
                <TextField
                  id="first_name_input"
                  ref="first_name_input"
                  value={this.state.firstName}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Naam:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  fullWidth
                  onChange={(event, newValue) => this.setState({ firstName: newValue })}
                  className="formInputField"
                />
                <TextField
                  id="last_name_input"
                  ref="last_name_input"
                  value={this.state.lastName}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Achternaam:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  fullWidth
                  onChange={(event, newValue) => this.setState({ lastName: newValue })}
                  className="formInputField"
                />
                <TextField
                  id="email_input"
                  ref="email_input"
                  value={this.state.email}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Email-adress:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  errorText={this.state.emailError}
                  fullWidth
                  onChange={(event, newValue) => this.emailValidation(newValue)}
                  className="formInputField"
                />
                <br />
                <TextField
                  id="uname_input"
                  ref="uname_input"
                  value={this.state.uname}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Gebruikersnaam:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  fullWidth
                  errorText={this.state.unameError}
                  onChange={(event, newValue) => this.usernameValidation(newValue)}
                  className="formInputField"
                />
              </div>
              <div>
                <div className="dashboard-medium-title">Wachtwoord veranderen</div>
              </div>
              <div>
                <TextField
                  id="current_pass_input"
                  ref="current_pass_input"
                  value={this.state.password}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Oud Wachtwoord:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  fullWidth
                  errorText={this.state.passwordError}
                  onChange={(event, newValue) => this.currentPasswordValidation(newValue)}
                  type="password"
                  className="formInputField"
                />
                <br />
                <TextField
                  id="new_pass_input"
                  ref="new_pass_input"
                  value={this.state.newPassword}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Nieuw Wachtwoord:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  fullWidth
                  errorText={this.state.newPasswordError}
                  onChange={(event, newValue) => this.passwordValidation(newValue)}
                  type="password"
                  className="formInputField"
                />
                <br />
                <TextField
                  id="new_pass_2_input"
                  ref="new_pass_2_input"
                  value={this.state.newPassword2}
                  floatingLabelFixed
                  floatingLabelStyle={appResources.profileLabelInputStyle}
                  floatingLabelText={'Wachtwoord herhalen:'}
                  inputStyle={appResources.profileFieldInputStyle}
                  underlineStyle={{ borderColor: appResources.dashboardTextColor }}
                  underlineFocusStyle={{ borderColor: appResources.dashboardTextColor }}
                  fullWidth
                  errorText={this.state.newPassword2Error}
                  onChange={(event, newValue) => this.password2Validation(newValue)}
                  type="password"
                  className="formInputField"
                />
              </div>
              <br />
              <Col sm={12} md={12} lg={12}>
                <Button
                  className="dashboard-submit-btn"
                  style={appResources.profileButtonStyle}
                  onClick={this.handleSubmit}
                >
                  Updates Bewaren
                </Button>
              </Col>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { user } = state;
  return {
    user,
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
  deleteAccount,
  editProfileData,
})(Profile);
