import React from 'react';
import { browserHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import appResources from '../appResources';
import not_found_svg from '../images/404svg.svg';

const buttonStyle = {
  margin: '0 10px'
};

const buttonLabelStyle = {
  fontWeight: 'bold',
  padding: '0 15px'
};

export default class NotFound extends React.Component {
  componentDidMount() {
    document.title = `${appResources.documentTitle} | niet gevonden`;
  }

  render() {
    return (
      <div className="error-page">
        <div className="inner-container">
          <div className="header">
            <img alt="Error icon" src={not_found_svg} />
            <h1 className="big-text">404</h1>
          </div>
          <label className="small-text">Oeps ... het lijkt erop dat je verdwaald bent</label>
          <Button
            label="go back home"
            labelColor="#FFF"
            labelStyle={buttonLabelStyle}
            style={buttonStyle}
            backgroundColor="#3398DB"
            onClick={() => browserHistory.replace('/')}
          />
        </div>
      </div>
    );
  }
}
