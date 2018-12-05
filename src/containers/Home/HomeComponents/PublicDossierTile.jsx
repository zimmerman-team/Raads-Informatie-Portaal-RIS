import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Row from 'react-bootstrap/lib/Row';
import { browserHistory } from 'react-router';
import appResources from '../../../appResources';
import staticText from '../Home.mock';

const PublicDossierTile = () => (
  <Col sm={12} md={12} lg={12} className="homepage-raad-block">
    <h3>
      <Glyphicon
        className="with-back"
        style={{ background: appResources.color_normal, color: '#fff' }}
        glyph="briefcase"
      />
    </h3>
    <p>{staticText.publicDossierHeader}</p>
    <Row className="show-grid homepage-dossiers-block">
      {appResources.samplePublicDossiers.map((dossier, index) => {
        return (
          <Col key={index} sm={6} md={4} lg={4} className="homepage-dossier">
            <Glyphicon
              className="with-back"
              style={{ background: appResources.color_normal, color: '#fff' }}
              glyph="briefcase"
            />
            <span>{dossier}</span>
          </Col>
        );
      })}
    </Row>
    <span
      className="more-info-link"
      style={{ color: appResources.in_content_color }}
      onClick={() => browserHistory.push('/publieke-dossiers')}
    >
      {staticText.moreDossier}
    </span>
  </Col>
);

export default PublicDossierTile;
