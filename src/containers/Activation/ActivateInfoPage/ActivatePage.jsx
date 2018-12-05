import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../../appResources.js';

class ActivatePage extends React.Component {
  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Activeer account`;
  }

  render() {
    return (
      <div className="about-container">
        <div className="register-title" style={{ color: '#444' }}>
          <b>CONTROLEER UW EMAIL</b> EN ACTIVEER HET DASHBOARD
        </div>
        <hr />
        <div style={{ fontSize: 22, marginTop: '4rem' }}>
          <span style={{ fontWeight: 'bold' }}>DE SLIMSTE </span>RAADSINFORMATIE ZOEKMACHINE
        </div>
        <div style={{ marginTop: '3rem' }}>
          <div className="about-icon-block">
            <div className="about-icon-inside-block">
              <Glyphicon glyph="search" className="homepage-big-glyphicon" />
              <b>SLIM & RELEVANT ZOEKEN</b>
            </div>
            <div className="about-icon-inside-block">
              <Glyphicon glyph="heart" className="homepage-big-glyphicon" />
              <b>FAVORIETEN BEWAREN</b>
            </div>
          </div>
          <div className="about-icon-block">
            <div className="about-icon-inside-block">
              <Glyphicon glyph="calendar" className="homepage-big-glyphicon" />
              <b>AGENDA RAADPLEGEN</b>
            </div>
            <div className="about-icon-inside-block">
              <Glyphicon glyph="facetime-video" className="homepage-big-glyphicon" />
              <b>LIVE UITZENDINGEN VOLGEN</b>
            </div>
          </div>
          <div className="about-icon-block">
            <div className="about-icon-inside-block">
              <Glyphicon glyph="folder-open" className="homepage-big-glyphicon" />
              <b>DOSSIERS MAKEN & DELEN</b>
            </div>
            <div className="about-icon-inside-block">
              <Glyphicon glyph="file" className="homepage-big-glyphicon" />
              <b>DOCUMENTEN DELEN</b>
            </div>
          </div>
          <div className="about-icon-block">
            <div className="about-icon-inside-block">
              <Glyphicon glyph="send" className="homepage-big-glyphicon" />
              <b>NOTIFICATIES ONTVANGEN</b>
            </div>
            <div className="about-icon-inside-block">
              <Glyphicon glyph="comment" className="homepage-big-glyphicon" />
              <b>INSPRAAK GEVEN</b>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActivatePage;
