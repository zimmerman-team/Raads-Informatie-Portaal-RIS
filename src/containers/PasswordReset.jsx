import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import { setSnackBar, fromPasswordReset } from '../actions/generalActions';
import appResources from '../appResources';

let _this;

class PasswordReset extends React.Component {
  constructor(props) {
    super();

    this.state = {
      snackbar_action: '',
      open: false,
      message: '',
      password: '',
      password2: '',
      passwordError: '',
      password2Error: '',
    };

    _this = this;

    this.passwordValidation = this.passwordValidation.bind(this);
    this.password2Validation = this.password2Validation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getURLParameter(name) {
    // eslint-disable-next-line
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  passwordValidation(value) {
    let passwordError;
    if (value !== '') {
      const regex = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9&.!*^%#_-]{7,}$/;
      passwordError = !regex.test(value)
        ? 'Wachtwoord moet minstens 8 karakters lang zijn en brieven, cijfers en speciale tekens moeten bevatten (&.! * ^% # _-)'
        : '';
    } else {
      passwordError = '';
    }
    this.setState({ password: value, passwordError });
    this.password2Validation(this.state.password2);
    return passwordError === '';
  }

  password2Validation(value) {
    let password2Error;
    if (value !== '') {
      password2Error = value !== this.state.password ? 'Wachtwoorden moeten overeenkomen.' : '';
    } else {
      password2Error = '';
    }
    this.setState({ password2: value, password2Error });
    return password2Error === '';
  }

  handleSubmit() {
    if (
      this.passwordValidation(this.state.password) &&
      this.password2Validation(this.state.password2)
    ) {
      axios
        .post(`accounts/password/reset/confirm/`, {
          new_password1: _this.state.password,
          new_password2: _this.state.password2,
          uid: _this.getURLParameter('uidb64'),
          token: _this.getURLParameter('token'),
        })
        .then(response => {
          if (response.status === 200 || response.status === 201) {
            this.props.fromPasswordReset(true);
            this.props.setSnackBar('Wachtwoord succesvol veranderd', 'success');
            browserHistory.replace('/login');
          }
        })
        .catch(error => {
          _this.setState({ open: true, message: 'Er is iets fout gegaan.' });
        });
    }
  }

  componentDidMount() {
    axios.defaults.baseURL = appResources.backendUrl;
  }

  render() {
    return (
      <div className="basePage">
        <div className="register-title" style={{ color: '#444' }}>
          <b>RESET WACHTWOORD</b>
        </div>
        <hr />
        <TextField
          hintText="Wachtwoord"
          hintStyle={appResources.TextFieldHintStyle2}
          errorText={this.state.passwordError}
          onChange={(event, newValue) => this.passwordValidation(newValue)}
          type="password"
        />
        <br />
        <TextField
          hintText="Type nogmaals uw wachtwoord"
          hintStyle={appResources.TextFieldHintStyle2}
          errorText={this.state.password2Error}
          onChange={(event, newValue) => this.password2Validation(newValue)}
          type="password"
        />
        <br />
        <RaisedButton
          label={<b>VERZENDEN</b>}
          labelColor="#fff"
          backgroundColor={appResources.basicColor}
          onClick={this.handleSubmit}
          style={{ marginTop: '2rem' }}
          labelStyle={{ margin: '1.5rem' }}
        />
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          onRequestClose={() => this.setState({ open: false })}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(null, {
    setSnackBar,
    fromPasswordReset,
  })(PasswordReset),
);
