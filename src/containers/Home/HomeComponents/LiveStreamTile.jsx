import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Row from 'react-bootstrap/lib/Row';
import appResources from '../../../appResources';
import staticText from '../Home.mock';

const videoTile = require('../../../images/video_tile.jpg');

const LiveStreamTile = () => (
  <Col sm={12} md={12} lg={10} className="homepage-raad-block">
    <h3>
      <Glyphicon
        className="with-back"
        style={{ background: appResources.color_normal, color: 'red' }}
        glyph="film"
      />
      {staticText.liveStreamHeader}
    </h3>
    <Row className="show-grid homepage-dossiers-block">
      {appResources.sampleVideos.map((video, index) => {
        return (
          <Col key={index} sm={4} md={3} lg={3} className="homepage-video-tile">
            <img src={videoTile} width="100%" alt="video thumbnail" />
            <label>{video.title}</label>
            <span>{video.date}</span>
            <span>{video.location}</span>
            <span>{video.info}</span>
          </Col>
        );
      })}
    </Row>
  </Col>
);

export default LiveStreamTile;
