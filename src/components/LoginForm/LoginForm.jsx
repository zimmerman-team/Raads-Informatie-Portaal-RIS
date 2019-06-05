import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import axios from 'axios';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Slide from '@material-ui/core/Slide';
import appResources from '../../appResources';
import { login } from '../../actions/userActions';
import { setSnackBar } from '../../actions/generalActions';

let _this;

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      account_email: '',
      accountEmailError: '',
      uname_email: '',
      pass: '',
      uname_emailError: '',
      passError: '',
      rememberMe: false,
    };

    _this = this;

    this.login = this.login.bind(this);
    this.validateAll = this.validateAll.bind(this);
    this.onRememberCheck = this.onRememberCheck.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  validateAll() {
    let proceed = true;
    let uname_emailError = '';
    let passError = '';

    if (this.state.uname_email === '') {
      proceed = false;
      uname_emailError = 'Verplicht';
    }
    if (this.state.pass === '') {
      proceed = false;
      passError = 'Verplicht';
    }

    this.setState({
      uname_emailError,
      passError,
    });
    return proceed;
  }

  getObject() {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/g;
    let object;

    if (regex.test(this.state.uname_email)) {
      object = {
        username: '',
        email: this.state.uname_email,
        password: this.state.pass,
      };
    } else {
      object = {
        username: this.state.uname_email,
        email: '',
        password: this.state.pass,
      };
    }
    return object;
  }

  login() {
    if (this.validateAll()) {
      const obj = this.getObject();
      this.props.login(obj, this.state.rememberMe, this.props.fromPasswordReset);
    }
  }

  onSuccess(response) {
    browserHistory.replace(`/google/redirect/${response.accessToken}`);
  }

  onFailure(response) {}

  emailValidation(value) {
    let emailError;
    if (value !== '') {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/g;
      emailError = !regex.test(value) ? 'Niet een geldige email.' : '';
    } else {
      emailError = '';
    }
    this.setState({ account_email: value, accountEmailError: emailError });
    return emailError === '';
  }

  forgotPassword() {
    if (_this.emailValidation(_this.state.account_email) && this.state.account_email !== '') {
      axios
        .post(`accounts/password/reset/`, { email: this.state.account_email })
        .then(response => {
          _this.props.setSnackBar('Wachtwoord reset email is verzonden.');
          _this.setState({ openModal: false });
        })
        .catch(error => {
          _this.props.setSnackBar(error.response.data.detail);
          _this.setState({ openModal: false });
        });
    }
  }

  onRememberCheck(event, value) {
    this.setState({ rememberMe: value });
  }

  componentDidMount() {
    axios.defaults.baseURL = appResources.backendUrl;
    axios.defaults.validateStatus = function(status) {
      return (status >= 200 && status < 300) || status === 401;
    };
  }

  render() {
    const { classes } = this.props;
    const {
      uname_email,
      uname_emailError,
      pass,
      passError,
      rememberMe,
      accountEmailError,
      openModal,
    } = this.state;

    const actions = [
      <Button
        key={1}
        variant="flat"
        onClick={() => this.setState({ openModal: false })}
        style={{ backgroundColor: appResources.loginButStyle.backgroundColor, color: '#fff' }}
      >
        Annuleer
      </Button>,
      <Button
        key={2}
        variant="flat"
        onClick={this.forgotPassword}
        style={{ backgroundColor: appResources.loginButStyle.backgroundColor, color: '#fff' }}
      >
        Verzenden
      </Button>,
    ];

    return (
      <div className="register-form-container">
        <Dialog
          fullWidth
          maxWidth="md"
          open={openModal}
          TransitionComponent={Transition}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={() => this.setState({ openModal: false })}
          onBackdropClick={() => this.setState({ openModal: false })}
          onEscapeKeyDown={() => this.setState({ openModal: false })}
        >
          <DialogTitle id="simple-dialog-title">Wachtwoord vergeten</DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              className={classes.formControl}
              error={accountEmailError !== ''}
              aria-describedby="name-error-text"
              margin="normal"
            >
              <Input
                fullWidth
                autoFocus
                id="passResetEmailInput"
                placeholder="Account email"
                onChange={event => this.emailValidation(event.target.value)}
              />
              {accountEmailError !== '' && (
                <FormHelperText id="pass-reset-error-text">{accountEmailError}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>{actions}</DialogActions>
        </Dialog>
        <div className="register-title">Log In</div>
        <div className="register-text">
          {' '}
          U moet zich eerst aanmelden of inloggen om een zoekopdracht te kunnen bewaren.{' '}
        </div>
        <div
          className="justify-text"
          style={{
            width: '100%',
            visibility: this.state.loading ? 'visible' : 'hidden',
            marginTop: 10,
          }}
        >
          <CircularProgress size={50} thickness={5} style={{ color: appResources.basicColor }} />
        </div>
        <div className="register-textboxes">
          <FormControl
            fullWidth
            className={classes.formControl}
            error={uname_emailError !== ''}
            aria-describedby="name-error-text"
            margin="normal"
          >
            <Input
              fullWidth
              id="usernameInput"
              value={uname_email}
              placeholder="Gebruikersnaam"
              autoFocus
              onChange={event =>
                this.setState({ uname_email: event.target.value, uname_emailError: '' })
              }
            />
            {uname_emailError !== '' && (
              <FormHelperText id="name-error-text">{uname_emailError}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            className={classes.formControl}
            error={passError !== ''}
            aria-describedby="name-error-text"
            margin="normal"
          >
            <Input
              fullWidth
              id="passwordInput"
              value={pass}
              placeholder="Wachtwoord"
              type="password"
              onChange={event => this.setState({ pass: event.target.value, passError: '' })}
            />
            {passError !== '' && <FormHelperText id="name-error-text">{passError}</FormHelperText>}
          </FormControl>

          <br />

          <Checkbox
            iconStyle={appResources.checkBoxStyle}
            labelStyle={appResources.checkBoxStyle}
            label="Onthoud mij"
            checked={rememberMe}
            onCheck={this.onRememberCheck}
          />

          {this.props.isLoggedIn && <label className="logged-in-label">Je bent al ingelogd</label>}
          <div className="login-submit-div">
            <Button
              onClick={this.login}
              classes={classes.button}
              disabled={this.props.isLoggedIn}
              style={appResources.loginButStyle}
            >
              <b>Log in</b>
            </Button>
            <div className="wachtwoord-vergeten">
              <a style={{ color: '#444' }} onClick={() => this.setState({ openModal: true })}>
                Wachtwoord vergeten?
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { user, fromPasswordReset } = state;
  return {
    dossiers: user.dossiers,
    loading: user.isLoading,
    fromPasswordReset,
  };
}

export default compose(
  withStyles({}),
  connect(mapStateToProps, {
    login,
    setSnackBar,
  }),
)(LoginForm);
