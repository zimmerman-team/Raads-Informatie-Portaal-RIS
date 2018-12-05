import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import appResources from '../appResources.js';

class GoogleRedirect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      message: 'Loading...',
    };
  }

  getUserDetails() {
    const _this = this;

    axios
      .get(`${appResources.backendUrl}/accounts/user/`, {
        headers: { Authorization: `Token ${sessionStorage.getItem('token')}` },
      })
      .then(response => {
        sessionStorage.setItem('user_id', response.data.pk);
        sessionStorage.setItem('name', response.data.first_name);
        sessionStorage.setItem('user_name', response.data.username);
        sessionStorage.setItem('email', response.data.email);
        sessionStorage.setItem('is_social_account', true);
        browserHistory.replace('/user/dossiers');
      })
      .catch(error => {
        _this.setState({
          show: false,
          message: 'Er is iets fout gegaan. Probeer opnieuw in te loggen.',
        });
      });
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Login`;
    const token = this.props.params.token;
    const _this = this;

    axios
      .post(`${appResources.backendUrl}/accounts/google/`, {
        access_token: token,
        code: '',
      })
      .then(response => {
        sessionStorage.setItem('token', response.data.key);
        _this.getUserDetails();
      })
      .catch(error => {
        _this.setState({
          show: false,
          message: 'Er is iets fout gegaan. Probeer opnieuw in te loggen.',
        });
      });
  }

  render() {
    return (
      <div className="main redirect-page-container">
        <Paper zDepth={2} style={{ width: 400, display: 'block', margin: 'auto', padding: '1rem' }}>
          {this.state.show && (
            <div className="justify-text" style={{ width: '100%' }}>
              <CircularProgress color="#dd4b39" size={50} thickness={5} />
            </div>
          )}
          <p className="justify-text">{this.state.message}</p>
          {!this.state.show && (
            <Button
              label={<b>GA NAAR LOGIN</b>}
              labelColor="#fff"
              backgroundColor={appResources.basicColor}
              onClick={() => (window.location.href = '/login')}
              style={{ marginTop: '1rem' }}
              labelStyle={{ margin: '1.5rem' }}
              fullWidth
            />
          )}
        </Paper>
      </div>
    );
  }
}

export default GoogleRedirect;
