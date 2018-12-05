import React from 'react';
import appResources from '../appResources';

class TermsConditions extends React.Component {
  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Algemene Voorwaarden`;
  }

  render() {
    return (
      <div className="basePage">
        <div className="about-container">
          <span className="notesHeaderTitle">
            ALGEMENE VOORWAARDEN{' '}
            <span className="title-no-bold">
              RAADSINFORMATIE PORTAAL {appResources.municipality}
            </span>
          </span>
          <br />
          <hr />

          <p className="about-sub-no-bold">
            Meer informatie over de Algemene Voorwaarden volgt spoedig.
          </p>
        </div>
      </div>
    );
  }
}

export default TermsConditions;
