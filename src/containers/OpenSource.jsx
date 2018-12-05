import React from 'react';
import appResources from '../appResources';

class OpenSource extends React.Component {
  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Open Source API`;
  }

  render() {
    return (
      <div className="basePage">
        <div className="about-container">
          <div className="notesHeaderTitle">
            OPEN SOURCE API - <span className="title-no-bold">VOOR ONTWIKKELAARS</span>
          </div>
          <br />
          <hr />
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Voor het raadsinformatie portaal is een aparte API ontwikkeld gebaseerd op Open
                Civic Data en OpenAhjo data model en de Popolo standaard. Onze API sluit goed aan
                bij modellen die RIS leveranciers gebruiken en de code is volledig en eenvoudig te
                (her)gebruiken in python libraries of als API.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OpenSource;
