import React from 'react';
import axios from 'axios';
import connect from 'react-redux/es/connect/connect';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Dialog from '@material-ui/core/Dialog/Dialog';
import Slide from '@material-ui/core/Slide/Slide';
import { setSnackBar } from '../../actions/generalActions';
import appResources from '../../appResources';

let _this;

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      password2: '',
      fnameError: '',
      emailError: '',
      usernameError: '',
      passwordError: '',
      password2Error: '',
      loading: false,
      openModal: false,
      account_email: '',
    };

    _this = this;

    this.clearForm = this.clearForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.usernameValidation = this.usernameValidation.bind(this);
    this.passwordValidation = this.passwordValidation.bind(this);
    this.resendActivationEmail = this.resendActivationEmail.bind(this);
    this.validateAll = this.validateAll.bind(this);
  }

  clearForm() {
    this.setState({
      first_name: '',
      email: '',
      last_name: '',
      username: '',
      password: '',
      password2: '',
      fnameError: '',
      emailError: '',
      usernameError: '',
      passwordError: '',
      password2Error: '',
    });
  }

  handleSubmit() {
    if (this.validateAll()) {
      this.setState({ loading: true });
      axios
        .post(`${appResources.backendUrl}accounts/register/`, {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
          password2: this.state.password,
        })
        .then(response => {
          if (response.status === 201) {
            _this.clearForm();
          }
          _this.setState({ loading: false });
          _this.props.handleResponse(response);
        })
        .catch(error => {
          _this.setState({ loading: false });
          _this.props.handleResponse(error);
        });
    }
  }

  nameValidation(value) {
    let nameError;
    if (value !== '') {
      nameError = '';
    }
    this.setState({ first_name: value, fnameError: nameError });
  }

  lastNameValidation(value) {
    let nameError;
    if (value !== '') {
      nameError = '';
    }
    this.setState({ last_name: value, fnameError: nameError });
  }

  emailValidation(value, stateVar = 'email', stateErrorVar = 'emailError') {
    let emailError;
    if (value !== '') {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/g;
      emailError = !regex.test(value) ? 'Niet een geldige email.' : '';
    } else {
      emailError = '';
    }
    this.setState({ [stateVar]: value, [stateErrorVar]: emailError });
  }

  usernameValidation(value) {
    this.setState({ username: value });
  }

  passwordValidation(value) {
    let passwordError;
    if (value !== '') {
      // if (value.length < 8) {
      // 	passwordError = 'Wachtwoord moet minimaal 8 tekens (letters en cijfers) lang zijn.'
      // }
      // let re = new RegExp('^[A-Za-z0-9!@#$%^&*]w{7,}');
      const regex = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9&.!*^%#_-]{8,}$/;
      passwordError = !regex.test(value)
        ? 'Wachtwoord moet minstens 8 karakters lang zijn en brieven, cijfers en speciale tekens moeten bevatten (&.! * ^% # _-)'
        : '';
    } else {
      passwordError = '';
    }
    this.setState({ password: value, passwordError });
    this.password2Validation(this.state.password2);
  }

  password2Validation(value) {
    let password2Error;
    if (value !== '') {
      password2Error = value !== this.state.password ? 'Wachtwoorden moeten overeenkomen.' : '';
    } else {
      password2Error = '';
    }
    this.setState({ password2: value, password2Error });
  }

  validateAll() {
    this.emailValidation(this.state.email);
    this.passwordValidation(this.state.password);

    let proceed = true;
    let fnameError = '';
    let emailError = '';
    let usernameError = '';
    let passwordError = '';
    let password2Error = '';

    if (this.state.first_name === '') {
      proceed = false;
      fnameError = 'Verplicht';
    }
    if (this.state.email === '') {
      proceed = false;
      emailError = 'Verplicht';
    }
    if (this.state.username === '') {
      proceed = false;
      usernameError = 'Verplicht';
    }
    if (this.state.password === '') {
      proceed = false;
      passwordError = 'Verplicht';
    }
    if (this.state.password2 === '') {
      proceed = false;
      password2Error = 'Verplicht';
    }
    if (
      this.state.fnameError !== '' ||
      this.state.emailError !== '' ||
      this.state.passwordError !== '' ||
      this.state.password2Error !== ''
    ) {
      proceed = false;
    }
    this.setState({
      fnameError,
      emailError,
      usernameError,
      passwordError,
      password2Error,
    });
    return proceed;
  }

  resendActivationEmail() {
    axios
      .post(`accounts/resend-activation-link/`, { email: this.state.account_email })
      .then(response => {
        _this.props.setSnackBar(response.data.response);
        _this.setState({ openModal: false });
      })
      .catch(error => {
        _this.setState({ openModal: false });
      });
  }

  render() {
    const { classes } = this.props;
    const {
      first_name,
      fnameError,
      last_name,
      usernameError,
      username,
      password,
      passwordError,
      password2,
      password2Error,
      email,
      emailError,
      openModal,
      accountEmailError,
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
        disabled={accountEmailError !== ''}
        onClick={this.resendActivationEmail}
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
          <DialogTitle id="simple-dialog-title">Stuur activeringsmail opnieuw</DialogTitle>
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
                onChange={event =>
                  this.emailValidation(event.target.value, 'account_email', 'accountEmailError')
                }
              />
              {accountEmailError !== '' && (
                <FormHelperText id="pass-reset-error-text">{accountEmailError}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>{actions}</DialogActions>
        </Dialog>
        <div className="register-title">Registreren</div>
        <div className="register-text">
          {' '}
          U moet zich eerst registreren om zoekopdrachten te kunnen bewaren, favorieten op te slaan
          en dossiers te maken{' '}
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
            margin="normal"
            error={fnameError !== ''}
            className={classes.formControl}
            aria-describedby="fname-error-text"
          >
            <Input
              fullWidth
              id="fnameInput"
              placeholder="Naam"
              value={first_name}
              onChange={event => this.nameValidation(event.target.value)}
            />
            {fnameError !== '' && (
              <FormHelperText id="fname-error-text">{fnameError}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={fnameError !== ''}
            className={classes.formControl}
            aria-describedby="fname-error-text"
          >
            <Input
              fullWidth
              id="lnameInput"
              placeholder="Achternaam"
              value={last_name}
              onChange={event => this.lastNameValidation(event.target.value)}
            />
            {fnameError !== '' && (
              <FormHelperText id="fname-error-text">{fnameError}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={usernameError !== ''}
            className={classes.formControl}
            aria-describedby="uname-error-text"
          >
            <Input
              fullWidth
              id="unameInput"
              placeholder="Gebruikersnaam"
              value={username}
              onChange={event => this.usernameValidation(event.target.value)}
            />
            {usernameError !== '' && (
              <FormHelperText id="uname-error-text">{usernameError}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            className={classes.formControl}
            error={passwordError !== ''}
            aria-describedby="pass1-error-text"
            margin="normal"
          >
            <Input
              fullWidth
              id="password1Input"
              value={password}
              placeholder="Wachtwoord"
              type="password"
              onChange={event => this.passwordValidation(event.target.value)}
            />
            {passwordError !== '' && (
              <FormHelperText id="pass1-error-text">{passwordError}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            className={classes.formControl}
            error={password2Error !== ''}
            aria-describedby="pass2-error-text"
            margin="normal"
          >
            <Input
              fullWidth
              id="password2Input"
              value={password2}
              placeholder="Wachtwoord"
              type="password"
              onChange={event => this.password2Validation(event.target.value)}
            />
            {password2Error !== '' && (
              <FormHelperText id="pass2-error-text">{password2Error}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            className={classes.formControl}
            error={emailError !== ''}
            aria-describedby="email-error-text"
            margin="normal"
          >
            <Input
              fullWidth
              id="emailInput"
              value={email}
              placeholder="E-mailadress"
              onChange={event => this.emailValidation(event.target.value)}
            />
            {emailError !== '' && (
              <FormHelperText id="email-error-text">{emailError}</FormHelperText>
            )}
          </FormControl>

          <Button
            classes={classes.button}
            onClick={this.handleSubmit}
            disabled={this.props.isLoggedIn}
            style={appResources.loginButStyle}
          >
            <b>Registreren</b>
          </Button>
          <div className="wachtwoord-vergeten">
            <a style={{ color: '#444' }} onClick={() => this.setState({ openModal: true })}>
              Uw activeringslink-e-mail niet ontvangen? Klik hier om opnieuw te verzenden!
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(),
  connect(null, {
    setSnackBar,
  }),
)(RegisterForm);
