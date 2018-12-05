import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory, withRouter } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import ReactHLS from 'react-hls';
import ContainerDimensions from 'react-container-dimensions';
import ItemMenu from '../../../OptionMenu/OptionMenu';
import VideoSpeakers from '../../VideoSpeakers/VideoSpeakers';
import appResources from '../../../../appResources';
import { getFormattedType, getItemDetailUrl, getParameterByName, share } from '../../../../helpers';
import { loadUserDossiers } from '../../../../actions/userActions';
import {
  deleteAgendaMediaItem,
  setEventDocumentModal,
  removeEventDocument,
} from '../../../../actions/publisherActions';
import styles from '../../RoomTile/RoomTile.module.scss';

require('./AgendaTile.legacy.scss');

class AgendaTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoPosition: 0,
    };

    this.onSpeakerClick = this.onSpeakerClick.bind(this);
  }

  componentWillMount() {
    if (this.props.dossiers.length === 0) this.props.loadUserDossiers();
    this.props.tileType === 'video' && this.props.loadEventSpeakers(this.props.room.id);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.tileType === 'video') {
      const videoURLparam = getParameterByName('videoPosition');
      if (this.props.room.id !== nextProps.room.id) {
        this.props.loadEventSpeakers(nextProps.room.id);
      }
      if (videoURLparam !== null && parseInt(videoURLparam, 10) !== this.state.videoPosition) {
        this.setState({ videoPosition: parseInt(videoURLparam, 10) });
      }
      if (this.props.selectedAgendaItem !== nextProps.selectedAgendaItem) {
        const speakers = _.orderBy(
          _.filter(this.props.speakers, { agenda_id: nextProps.selectedAgendaItem }),
          ['start_time'],
          ['asc'],
        );
        if (speakers.length > 0) {
          this.setState({ videoPosition: parseInt(speakers[0].start_time, 10) });
        }
      }
    }
  }

  onSpeakerClick(time) {
    let url = this.props.currentURL;
    this.setState({ videoPosition: time });
    if (url.search('videoPosition') !== -1) {
      url = url.substr(0, url.lastIndexOf('&'));
    }
    browserHistory.push(`${url}&videoPosition=${time}`);
  }

  formatDocs(docs) {
    return docs.map(d => {
      if (d.links) {
        return {
          agenda_media_id: d.id,
          uid: d.links[0].combined_id,
          type: d.link_item_type,
          name: d.links[0].text,
          date: d.date,
          id: d.links[0].item_id,
          url: d.links[0].url,
        };
      }
      return {
        uid: d.combined_id,
        type: d.media_type,
        name: d.text,
        date: d.date,
        id: d.id,
        url: d.url,
        attachment_type: d.attachment_type,
      };
    });
  }

  getTile(tileType) {
    const { room, selectedAgendaItem, speakers, is_admin } = this.props;

    const roomID = getParameterByName('zaal');

    if (tileType === 'document') {
      const docs =
        room.agenda.length > 0
          ? selectedAgendaItem !== undefined && selectedAgendaItem !== -1
            ? _.filter(_.find(room.agenda, { id: selectedAgendaItem }).media, m => {
                return m.link_item_type !== 'public_dossier';
              })
            : _.filter(room.agenda[0].media, m => {
                return m.link_item_type !== 'public_dossier';
              })
          : room.documents;
      return {
        name: 'Raadsstukken',
        extra_doc: <div>Raadsstukken: {docs.length}</div>,
        content: (
          <ul className={docs.length > 4 ? 'bottom-fade' : ''}>
            {docs.length > 0 &&
              this.formatDocs(docs).map((d, i) => {
                const url = getItemDetailUrl(d.type, d.id);
                const menuData = {
                  uid: d.uid,
                  type: d.type,
                  name: d.name,
                  date: d.date,
                  id: d.id,
                  url: d.url,
                };
                return (
                  <li
                    key={i}
                    className="doc-list-item"
                    style={{ backgroundColor: i % 2 === 0 ? '#eee' : '#fff' }}
                  >
                    <div className="before">
                      <i className="material-icons">insert_drive_file</i>
                    </div>
                    <div className="main">
                      <Link to={url}>{d.name}</Link>
                      <span>Type: {getFormattedType(d.type)}</span> |
                      <span> Datum toegevoegd: {moment(d.date).format('DD-MM-YYYY')}</span>
                    </div>
                    <div className="after">
                      <ItemMenu
                        data={menuData}
                        optionType="agenda_doc"
                        dossiers={this.props.dossiers}
                        delete={() => this.props.deleteAgendaMediaItem(d.agenda_media_id, this)}
                      />
                    </div>
                  </li>
                );
              })}
            {docs.length === 0 && <div style={{ padding: 20 }}>Geen raadsstukken</div>}
          </ul>
        ),
      };
    } else if (tileType === 'generic_docs') {
      const docs = room.documents;
      return {
        name: 'Gerelateerde documenten',
        // extra_doc: <div>Documenten: {docs.length}</div>,
        content: (
          <ul style={is_admin ? this.props.listStyle : {}}>
            {docs.length > 0 &&
              this.formatDocs(docs).map((d, i) => {
                const url = getItemDetailUrl(d.type, d.id);
                const menuData = {
                  uid: d.uid,
                  type: d.type,
                  name: d.name,
                  date: d.date,
                  id: d.id,
                  url: d.url,
                };
                return (
                  <li
                    key={i}
                    className="doc-list-item"
                    style={{ backgroundColor: i % 2 === 0 ? '#eee' : '#fff' }}
                  >
                    <div className="before">
                      <i className="material-icons">insert_drive_file</i>
                    </div>
                    <div className="main">
                      <Link to={url}>{d.name}</Link>
                      <span>Type: {getFormattedType(d.type)}</span> |
                      <span> Datum toegevoegd: {moment(d.date).format('DD-MM-YYYY')}</span>
                    </div>
                    <div data-cy="related-document-menu-testid" className="after">
                      <ItemMenu
                        data={menuData}
                        optionType="event_doc"
                        dossiers={this.props.dossiers}
                        delete={() =>
                          this.props.removeEventDocument(
                            this,
                            d,
                            roomID ? roomID : this.props.params.eventId,
                          )
                        }
                      />
                    </div>
                  </li>
                );
              })}
            {docs.length === 0 && <div style={{ padding: 20 }}>Geen documenten</div>}
          </ul>
        ),
      };
    } else if (tileType === 'public_dossier') {
      const public_dossiers =
        room.agenda.length > 0
          ? selectedAgendaItem !== undefined && selectedAgendaItem !== -1
            ? _.filter(_.find(room.agenda, { id: selectedAgendaItem }).media, {
                link_item_type: 'public_dossier',
              })
            : _.filter(room.agenda[0].media, { link_item_type: 'public_dossier' })
          : [];
      return {
        name: 'Publieke dossiers',
        content: (
          <ul className={public_dossiers.length > 4 ? 'bottom-fade' : ''}>
            {public_dossiers.map((d, i) => {
              const url = getItemDetailUrl(d.link_item_type, d.links[0].item_id);
              return (
                <li
                  key={i}
                  className="doc-list-item"
                  style={{ backgroundColor: i % 2 === 0 ? '#eee' : '#fff' }}
                >
                  <div className="before">
                    <i className="material-icons">folder</i>
                  </div>
                  <div className="main">
                    <Link to={url}>{d.note}</Link>
                  </div>
                  <div className="after">
                    <ItemMenu
                      data={null}
                      optionType="agenda_dossier"
                      share={() => share(null, url, null, 'Link')}
                      delete={() => this.props.deleteAgendaMediaItem(d.id, this)}
                    />
                  </div>
                </li>
              );
            })}
            {public_dossiers.length === 0 && (
              <div style={{ padding: 20 }}>Geen publieke dossiers</div>
            )}
          </ul>
        ),
      };
    } else if (tileType === 'video') {
      let video = '';

      if (room.event_media) {
        if (room.event_media.length !== 0) {
          video = room.event_media[0].httpstream;
        }
      }
      return {
        name: 'Video verslag',
        speaker_content: video !== '' && (
          <VideoSpeakers
            speakers={_.filter(speakers, { agenda_id: selectedAgendaItem })}
            onSpeakerClick={this.onSpeakerClick}
          />
        ),
        content: (
          <div className="body" style={{ maxHeight: 650 }}>
            {video !== '' && false && <a>Speel volledige vergadering af</a>}
            {video !== '' && video !== null ? (
              <div>
                <ContainerDimensions>
                  {({ width }) => (
                    <ReactHLS
                      width={width}
                      height={400}
                      controls
                      hlsConfig={{
                        startPosition: this.state.videoPosition,
                      }}
                      autoplay={this.state.videoPosition !== 0}
                      url={video.replace('http://', 'https://')}
                    />
                  )}
                </ContainerDimensions>
              </div>
            ) : (
              <div>Geen videostream</div>
            )}
          </div>
        ),
      };
    }

    return {
      name: 'Fix the tileType pls',
      content: <div> Really dude, like sth is wrong </div>,
    };
  }

  render() {
    const { tileType, is_admin, publisherAddBtn, extraStyle } = this.props;

    const tile = this.getTile(tileType);

    return (
      <section className="detail-section-container" style={is_admin ? extraStyle : {}}>
        <header className="header" style={{ borderBottom: `4px solid ${appResources.basicColor}` }}>
          <h3>{tile.name}</h3>
          {tile.extra_doc && tile.extra_doc}
        </header>
        {tile.content}
        {publisherAddBtn &&
          is_admin && (
            <div className={styles.addAgendaItemBtnContainer}>
              <button
                onClick={() => this.props.setEventDocumentModal(true)}
                className={styles.addAgendaItemBtn}
                style={{ background: appResources.in_content_color }}
              >
                Documenten toevoegen aan vergadering
              </button>
            </div>
          )}
        {tileType === 'video' && tile.speaker_content}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    dossiers: state.user.dossiers,
    is_admin: state.user.is_admin,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    loadUserDossiers,
    removeEventDocument,
    deleteAgendaMediaItem,
    setEventDocumentModal,
  })(AgendaTile),
);
