import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import LoginForm from '../../components/LoginForm/LoginForm';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import appResources from '../../appResources.js';
import RegisterForm from '../../components/LoginForm/RegisterForm';
import { setSnackBar } from '../../actions/generalActions';

class Login extends React.Component {
  componentWillMount() {
    if (this.props.isLoggedIn) {
      browserHistory.replace('/');
    }
  }

  handleRegisterResponse(response) {
    if (response.status === 201) {
      browserHistory.push('/activeer');
    } else {
      this.props.setSnackBar(response.data.detail);
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    document.title = `${appResources.documentTitle} | Login`;
    return (
      <div className="login-page">
        <Grid fluid>
          <Row>
            <Col sm={12} md={12} lg={6} style={{ textAlign: 'center' }}>
              <LoginForm
                handleResponse={this.handleResponse}
                handleRequestOpen={this.handleRequestOpen}
                isLoggedIn={isLoggedIn}
              />
            </Col>
            <div className="vertical-divider" />
            <Col sm={12} md={12} lg={6} style={{ textAlign: 'center' }}>
              <RegisterForm
                handleResponse={this.handleRegisterResponse.bind(this)}
                isLoggedIn={isLoggedIn}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    isLoggedIn: user.token !== '',
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
})(Login);
