import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import appResources from '../../../appResources.js';

class ActivateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activated: false,
      message: '',
    };
  }
  componentDidMount() {
    document.title = `${appResources.documentTitle} | Activeer account`;
    const _this = this;
    axios
      .get(`${appResources.backendUrl}accounts/activate/${this.props.params.code}`)
      .then(response => {
        const activated = response.data.message === 'Account activated';
        _this.setState({
          activated,
          message: activated ? 'Account geactiveerd' : response.data.message,
        });
      })
      .catch(error => {
        _this.setState({ activated: false, message: error });
      });
  }

  render() {
    return (
      <div className="main">
        <Paper
          zDepth={2}
          style={{ maxWidth: 400, display: 'block', margin: 'auto', padding: '1rem' }}
        >
          <b className="center-div">{this.state.message}</b>
          <br />
          <br />
          {this.state.activated && (
            <RaisedButton
              label={<b>Ga naar Login</b>}
              labelColor="#fff"
              fullWidth
              backgroundColor={appResources.basicColor}
              style={{ marginBottom: 15 }}
              onClick={() => {
                browserHistory.replace('/');
                browserHistory.push('/login');
              }}
            />
          )}
          {!this.state.activated && (
            <RaisedButton
              label={<b>Registreren</b>}
              labelColor="#fff"
              fullWidth
              backgroundColor={appResources.basicColor}
              style={{ marginBottom: 15 }}
              onClick={() => {
                browserHistory.replace('/');
                browserHistory.push('/register');
              }}
            />
          )}
        </Paper>
      </div>
    );
  }
}

export default ActivateAccount;
