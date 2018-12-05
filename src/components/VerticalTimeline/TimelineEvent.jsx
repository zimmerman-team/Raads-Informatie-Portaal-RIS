import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Paper from '@material-ui/core/Paper';
import IconMenu from 'material-ui/IconMenu';
import IconButton from '@material-ui/core/IconButton';
import { MenuItem } from '@material-ui/core/Menu';
import ItemMenu from '../OptionMenu/OptionMenu';
import ActionEvent from '@material-ui/icons/Event';
import EditorInsertDriveFile from '@material-ui/icons/InsertDriveFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SocialShare from '@material-ui/icons/Share';
import FileCreateNewFolder from '@material-ui/icons/CreateNewFolder';
import ActionAlarm from '@material-ui/icons/Alarm';
// import ActionFavorite from '@material-ui/icons/Favorite';
import FileFolder from '@material-ui/icons/Folder';
import ContentAdd from '@material-ui/icons/Add';
import CommunicationEmail from '@material-ui/icons/Email';
import ContentLink from '@material-ui/icons/Link';
import Videocam from '@material-ui/icons/Videocam';
import DeviceAccessAlarm from '@material-ui/icons/AccessAlarm';
import MapsPlace from '@material-ui/icons/Place';
import * as Colors from '@material-ui/core/colors';
import { share, datetify, downloadEvent, getCounts, isLoggedIn } from '../../helpers';
import appResources from '../../appResources';
import Favorite from '../icons/Favorite';
import { PUBLIC_DOSSIER } from '../../constants';

const googleIcon = require('../../images/googlecalendar.png');
const yahooIcon = require('../../images/yahoocalendar.png');
const outlookIcon = require('../../images/outlookcalendar.png');
const appleIcon = require('../../images/applecalendar.png');

const rowStyle = { marginRight: '10px', marginBottom: '-5px' };

class TimelineEvent extends React.Component {
  constructor(props) {
    super(props);

    this.addToDossier = this.addToDossier.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
  }

  checkIfInDossier(dossier_content, item_id) {
    const BreakException = {};
    try {
      dossier_content.forEach(content_item => {
        content_item.items.forEach(element => {
          if (parseInt(element.id, 10) === parseInt(item_id, 10)) {
            throw BreakException;
          }
        });
      });
      return false;
    } catch (e) {
      return true;
    }
  }

  addToDossier(dossier_id, item_id) {
    const _this = this;

    if (isLoggedIn()) {
      const obj = {
        dossier: parseInt(dossier_id, 10),
        items: [parseInt(item_id, 10)],
      };

      axios
        .post(`/dossier/content/add/`, obj)
        .then(response => {
          getCounts();
          _this.context.getUserDossiers();
          _this.context.setSnackbar('Item toegevoegd aan dossier.');
        })
        .catch(error => {
          _this.context.setSnackbar('Er is iets fout gegaan...');
        });
    }
  }

  addFavorite(id) {
    const _this = this;
    if (isLoggedIn()) {
      axios
        .post('favorite/add/', {
          item: parseInt(id, 10),
        })
        .then(response => {
          getCounts();
          _this.context.setSnackbar('Item toegevoegd aan favorieten.');
        })
        .catch(error => {
          const status = error.message.substr(error.message.length - 3);
          if (parseInt(status, 10) === 403) {
            _this.context.setSnackbar('Item is al toegevoegd aan favorieten.');
          } else if (parseInt(status, 10) === 401) {
            _this.context.setSnackbar('Er is iets fout gegaan...');
          }
        });
    } else {
      _this.context.setSnackbar('U moet ingelogd zijn voor deze optie.');
    }
  }

  setIcon(type) {
    switch (type) {
      case 'event':
        return <ActionEvent />;
      case 'document':
        return <EditorInsertDriveFile />;
      case 'media':
        return <Videocam />;
      default:
        return <ActionEvent />;
    }
  }

  setColor(type) {
    switch (type) {
      case 'event':
        return Colors.orange200;
      case 'document':
        return Colors.lightGreen200;
      case 'media':
        return Colors.teal200;
      case 'received_document':
        return appResources.received_document;
      case 'council_address':
        return appResources.council_address;
      case 'written_question':
        return appResources.written_question;
      case 'format':
        return appResources.format;
      case 'management_document':
        return appResources.management_document;
      case 'policy_document':
        return appResources.policy_document;
      case 'motion':
        return appResources.format;
      case 'commitment':
        return appResources.policy_document;
      default:
        return Colors.green500;
    }
  }

  setNewText(type, createdAt) {
    const dateString = `${createdAt.substring(8, 10)}-${createdAt.substring(
      5,
      7,
    )}-${createdAt.substring(0, 4)} - ${createdAt.substring(11, 16)}`;

    switch (type) {
      case 'event':
        return `NIEUW AGENDA ITEM: ${dateString}`;
      case 'document':
        return `NIEUW DOCUMENT: ${dateString}`;
      case 'received_document':
        return `NIEUW: ${dateString}`;
      case 'council_address':
        return `NIEUW: ${dateString}`;
      case 'written_question':
        return `NIEUW: ${dateString}`;
      case 'format':
        return `NIEUW: ${dateString}`;
      case 'management_document':
        return `NIEUW: ${dateString}`;
      case 'policy_document':
        return `NIEUW: ${dateString}`;
      case 'motion':
        return `NIEUW: ${dateString}`;
      case 'commitment':
        return `NIEUW: ${dateString}`;
      default:
        return `NIEUW: ${dateString}`;
    }
  }

  setItemActionMenu(id, item_id, title, date, createdAt, location, type, dossiers) {
    let item_menu;
    let dossiers_menu = [];

    try {
      dossiers_menu = dossiers.map(dossier => {
        const no_render_dossier = this.checkIfInDossier(dossier.content, id);
        if (no_render_dossier) {
          return <span />;
        }
        return (
          <MenuItem
            primaryText={dossier.title}
            leftIcon={<FileFolder color={dossier.color} />}
            onClick={() => this.addToDossier(dossier.id, id)}
          />
        );
      });
    } catch (error) {}

    dossiers_menu.push(
      <MenuItem
        primaryText="Add new map"
        leftIcon={<ContentAdd />}
        onClick={() => this.context.handleOpenNewDossier(id)}
      />,
    );

    if (type === 'event' || type === 'child_event') {
      const calEvent = {
        title,
        description: title,
        location,
        startTime: date,
        endTime: date,
      };

      item_menu = (
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
        >
          <MenuItem
            primaryText="Delen"
            leftIcon={<SocialShare />}
            menuItems={[
              <MenuItem
                primaryText="Email"
                leftIcon={<CommunicationEmail />}
                onClick={() => share(type, `/evenement/${item_id}`, title, 'Email')}
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() => share(type, `/evenement/${item_id}`, title, 'Link')}
              />,
            ]}
          />
          <MenuItem
            primaryText="Toevoegen aan dossier"
            leftIcon={<FileCreateNewFolder />}
            menuItems={dossiers_menu}
          />
          <MenuItem primaryText="Notificatie instellen bij wijziging" leftIcon={<ActionAlarm />} />
          <MenuItem
            primaryText="Toevoegen aan favorieten"
            leftIcon={<Favorite style={{ color: '#757575', fill: '#757575' }} />}
            onClick={() => this.addFavorite(id)}
          />
          <MenuItem
            primaryText="In externe agenda downloaden"
            leftIcon={<ActionEvent />}
            menuItems={[
              <MenuItem
                primaryText="Google Calendar"
                leftIcon={<img src={googleIcon} alt="google icon" width="32" height="32" />}
                onClick={() => downloadEvent(calEvent, 'Google')}
              />,
              <MenuItem
                primaryText="Yahoo Calendar"
                leftIcon={<img src={yahooIcon} alt="yahoo icon" width="32" height="32" />}
                onClick={() => downloadEvent(calEvent, 'Yahoo')}
              />,
              <MenuItem
                primaryText="Outlook Calendar"
                leftIcon={<img src={outlookIcon} alt="outlook icon" width="32" height="32" />}
                onClick={() => downloadEvent(calEvent, 'Outlook')}
              />,
              <MenuItem
                primaryText="Apple Calendar"
                leftIcon={<img src={appleIcon} alt="apple icon" width="32" height="32" />}
                onClick={() => downloadEvent(calEvent, 'Apple')}
              />,
            ]}
          />
        </IconMenu>
      );
    } else {
      item_menu = (
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
        >
          <MenuItem
            primaryText="Delen"
            leftIcon={<SocialShare />}
            menuItems={[
              <MenuItem
                primaryText="Email"
                leftIcon={<CommunicationEmail />}
                onClick={() => share(type, `/viewer/${item_id}`, title, 'Email')}
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() => share(type, `/viewer/${item_id}`, title, 'Link')}
              />,
            ]}
          />
          <MenuItem
            primaryText="Toevoegen aan dossier"
            leftIcon={<FileCreateNewFolder />}
            menuItems={dossiers_menu}
          />
          <MenuItem
            primaryText="Toevoegen aan favorieten"
            leftIcon={<Favorite style={{ color: '#757575', fill: '#757575' }} />}
            onClick={() => this.addFavorite(id)}
          />
        </IconMenu>
      );
    }

    return item_menu;
  }

  setItemLink(id, type) {
    switch (type) {
      case 'event':
        return `/evenement/${id}`;
      case 'child_event':
        return `/evenement/${id}`;
      case 'document':
        return `/document/0/${id}`;
      case 'received_document':
        return `/document/1/${id}`;
      case 'council_address':
        return `/document/2/${id}`;
      case 'written_question':
        return `/document/3/${id}`;
      case 'format':
        return `/document/4/${id}`;
      case 'management_document':
        return `/document/5/${id}`;
      case 'policy_document':
        return `/document/6/${id}`;
      case 'motion':
        return `/document/7/${id}`;
      case 'commitment':
        return `/document/8/${id}`;
      case 'public_dossier':
        return `/publieke-dossiers/${id}`;
      default:
        return '#';
    }
  }

  render() {
    const {
      id,
      item_id,
      title,
      date,
      createdAt,
      location,
      type,
      eventPaperDepth,
      dossiers,
      downloadUrl,
    } = this.props;

    const item_menu = (
      <ItemMenu
        optionType={'home'}
        data={{
          date,
          id: item_id,
          uid: id,
          title,
          type,
          download_url: downloadUrl,
        }}
        dossiers={dossiers}
      />
    );

    return (
      <Paper elevation={eventPaperDepth} className="timelineItem">
        <div>
          <div style={{ backgroundColor: '#FFF', padding: '0.5rem' }}>
            {this.setNewText(type, createdAt)}
          </div>
        </div>
        <div className="timelineItemContent" style={{ padding: '1rem' }}>
          <div
            style={{ marginBottom: '0.7rem' }}
            className="vertical-timeline-item-title-div verticalTimelineTitle"
          >
            <Link className="timeLineItemLink" to={this.setItemLink(item_id, type)}>
              {title}
            </Link>
            {item_menu}
          </div>
          <div style={{ marginBottom: 10 }}>
            <ActionEvent style={rowStyle} />
            {datetify(date)}
          </div>
          {type !== PUBLIC_DOSSIER && (
            <div style={{ marginBottom: 10 }}>
              <DeviceAccessAlarm style={rowStyle} />
              {date.substring(11, 16)} uur
            </div>
          )}
          {type !== PUBLIC_DOSSIER && (
            <div style={{ marginBottom: 10 }}>
              <MapsPlace style={rowStyle} />
              {location}
            </div>
          )}
        </div>
      </Paper>
    );
  }
}

export default TimelineEvent;
