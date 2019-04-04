import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SocialShare from '@material-ui/icons/Share';
import MenuItem from '@material-ui/core/MenuItem';
import CommunicationEmail from '@material-ui/icons/Email';
import ContentLink from '@material-ui/icons/Link';
import FileCreateNewFolder from '@material-ui/icons/CreateNewFolder';
import ActionAlarm from '@material-ui/icons/Alarm';
// import ActionFavorite from '@material-ui/icons/Favorite'
import ActionDelete from '@material-ui/icons/Delete';
import ActionEvent from '@material-ui/icons/Event';
import FileDownload from '@material-ui/icons/FileDownload';
import FileFolder from '@material-ui/icons/Folder';
import ContentAdd from '@material-ui/icons/Add';
import ModeEdit from '@material-ui/icons/ModeEdit';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../appResources';
import { downloadEvent, share, getItemDetailUrl } from '../../helpers';
import Favorite from '../icons/Favorite';

const googleIcon = require('../../images/googlecalendar.png');
const yahooIcon = require('../../images/yahoocalendar.png');
const outlookIcon = require('../../images/outlookcalendar.png');
const appleIcon = require('../../images/applecalendar.png');

const decision_icon_style = {
  color: '#fa511e',
  float: 'left'
};
const opened_folder_icon = <Glyphicon glyph="folder-open" className="folder-item-icon" />;
const calendar_icon = (
  <Glyphicon
    glyph="calendar"
    style={{ color: appResources.event_list_icon_color, marginRight: 15 }}
  />
);
const file_icon = (
  <Glyphicon glyph="file" style={{ color: appResources.doc_list_icon_color, marginRight: 15 }} />
);

export class TitleCell extends React.Component {
  render() {
    const { data, folders } = this.props;
    const type = data.original.type;
    const icon =
      type.toLowerCase() === 'event' || type.toLowerCase() === 'events' ? calendar_icon : file_icon;
    return (
      <div className="title-cell" style={{ marginTop: '8px' }}>
        {!folders && icon}
        <div className="title-div">
          {folders && opened_folder_icon}
          <Link to={data.value.link} style={{ color: appResources.in_content_color }}>
            {data.value.title}
          </Link>
        </div>
        <div className="description-div">{data.value.description}</div>
      </div>
    );
  }
}

export class FolderItemTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    const type = data.original.formatted_type;
    const icon =
      type.toLowerCase() === 'event' ||
      type === 'Vergaderzaal' ||
      type.toLowerCase() === 'events' ||
      type.toLowerCase() === 'child_event'
        ? calendar_icon
        : file_icon;
    return (
      <div className="title-cell" style={{ marginTop: '8px' }}>
        {icon}
        <div className="title-div">
          {type !== 'Geupload document' && (
            <Link to={data.original.title.link} style={{ color: appResources.in_content_color }}>
              {data.original.title.title}
            </Link>
          )}
          {type === 'Geupload document' && (
            <a
              href={data.original.title.link}
              target="_blank"
              style={{ color: appResources.in_content_color }}
            >
              {data.original.title.title}
            </a>
          )}
        </div>
      </div>
    );
  }
}

export class AgendaTitleCell extends React.Component {
  render() {
    const { id, data } = this.props;
    const title = id !== -1 ? data.original.note : data.original.text;
    const link = `/document/0/${id !== -1 ? data.original.links[0].doc_id : data.original.id}`;
    return (
      <div className="title-cell">
        <div className="title-div">
          <Link to={link} style={{ color: appResources.in_content_color }}>
            {title}
          </Link>
        </div>
      </div>
    );
  }
}

export class DecisionTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    const title = data.original.title ? data.original.title : '';
    const link = data.original.link ? data.original.link : '';
    return (
      <div className="icon-title-cell">
        <i className="material-icons" style={decision_icon_style}>
          assignment_returned
        </i>
        <div className="icon-title-div">
          <Link to={link} style={{ color: appResources.in_content_color }}>
            {title}
          </Link>
        </div>
      </div>
    );
  }
}

export class DossierTitleCell extends React.Component {
  render() {
    const { data, publicFolder } = this.props;
    const folder_link = publicFolder
      ? `/publieke-dossiers/${data.original.id}`
      : `/folder/${data.original.id}`;
    return (
      <div className="title-cell" style={{ marginTop: '8px' }}>
        <div className="title-div">
          <Glyphicon glyph="folder-open" style={{ color: data.original.color, marginRight: 15 }} />
          <Link to={folder_link} style={{ color: appResources.in_content_color }}>
            {data.original.title}
          </Link>
        </div>
      </div>
    );
  }
}

export class DossierItemTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div className="title-cell">
        <div className="title-div">
          <Link to={data.original.link} style={{ color: appResources.in_content_color }}>
            {data.original.title}
          </Link>
        </div>
      </div>
    );
  }
}

export class FavoriteTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    const type = data.original.type;
    const icon =
      type.toLowerCase() === 'event' ||
      type.toLowerCase() === 'events' ||
      type.toLowerCase() === 'child_event'
        ? calendar_icon
        : file_icon;
    return (
      <div className="title-cell" style={{ marginTop: '8px' }}>
        {icon}
        <div className="title-div">
          <Link
            to={getItemDetailUrl(data.original.type, data.original.id, data.original.parent_id)}
            style={{ color: appResources.in_content_color }}
          >
            {data.original.name}
          </Link>
        </div>
      </div>
    );
  }
}

export class SavedQuerriesCell extends React.Component {
  render() {
    const { data, removeQuery, setSavedQuery } = this.props;
    const queryState = {
      tab: data.original.tab,
      page: data.original.page,
      sortBy: data.original.sort_by,
      filters: data.original.filters
    };
    return (
      <div className="title-cell">
        <div className="title-div">
          <a
            onClick={() => {
              setSavedQuery(queryState);
              browserHistory.push('/zoeken');
            }}
            style={{
              color: appResources.in_content_color,
              fontWeight: 'bold',
              verticalAlign: 'sub'
            }}
          >
            {data.original.title}
          </a>
        </div>
        <i
          className="material-icons"
          style={{ cursor: 'pointer' }}
          onClick={() => removeQuery(data.original.id)}
        >
          close
        </i>
      </div>
    );
  }
}

export class IconTextCell extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div className="icon-text-cell">
        <i
          className="material-icons"
          style={{ color: data.value.icon.color, display: 'inline-block' }}
        >
          {data.value.icon.text}
        </i>
        <div className="text-div" style={{ display: 'inline-block' }}>
          {data.value.text}
        </div>
      </div>
    );
  }
}

export class DossiersMenuCell extends React.Component {
  render() {
    return (
      <div className="menu-cell">
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon color="#444" />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
        >
          <MenuItem
            leftIcon={<SocialShare />}
            primaryText="Delen"
            onClick={this.props.setFolderToShare}
          />
          <MenuItem leftIcon={<ModeEdit />} onClick={this.props.edit} primaryText="Bewerk folder" />
          <MenuItem
            leftIcon={<ActionDelete />}
            onClick={this.props.delete}
            primaryText="Verwijder"
          />
        </IconMenu>
      </div>
    );
  }
}

export class MyAgendaTitleCell extends React.Component {
  render() {
    let { data } = this.props;
    data = data.original;
    const url =
      data.parent_event && data.parent_event !== 0
        ? `/evenement/${data.parent_event}/?zaal=${data.id}`
        : `/evenement/${data.id}`;
    const name = data.parent_event && data.parent_event !== 0 ? data.classification : data.name;
    return (
      <div className="title-cell">
        <div className="title-div">
          <Link to={url} style={{ color: appResources.in_content_color }}>
            {name}
          </Link>
        </div>
      </div>
    );
  }
}

export class MyAgendaMenuCell extends React.Component {
  render() {
    let { data, addFavorite, removeAgenda, addNotification } = this.props;
    data = data.original;
    return (
      <div className="menu-cell">
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon color="#444" />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
        >
          <MenuItem
            leftIcon={<ActionDelete />}
            onClick={() => removeAgenda(data.id)}
            primaryText="Evenement verwijderen"
          />
          <MenuItem
            primaryText="Stel notificatie in"
            leftIcon={<ActionAlarm />}
            onClick={() => addNotification(data.combined_id)}
          />
          <MenuItem
            primaryText={'Toevoegen aan favorieten'}
            leftIcon={<Favorite style={{ color: '#757575', fill: '#757575' }} />}
            onClick={() => {
              addFavorite(data.combined_id);
            }}
          />
          <MenuItem
            primaryText="Delen"
            leftIcon={<SocialShare />}
            menuItems={[
              <MenuItem
                primaryText="Email"
                leftIcon={<CommunicationEmail />}
                onClick={() => share('Email', `/evenement/${data.id}`, 'agenda', 'Email')}
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() => share('Link', `/evenement/${data.id}`, 'agenda', 'Link')}
              />
            ]}
          />
        </IconMenu>
      </div>
    );
  }
}

export class FavoritesMenuCell extends React.Component {
  render() {
    return (
      <div className="menu-cell">
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon color="#444" />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
        >
          <MenuItem
            leftIcon={<ActionDelete />}
            onClick={this.props.delete}
            primaryText="Verwijderen uit favorieten"
          />
        </IconMenu>
      </div>
    );
  }
}

export class MyNotesMenuCell extends React.Component {
  render() {
    const { removeNote, data, editNote } = this.props;

    return (
      <div className="menu-cell">
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon color="#444" />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
        >
          <MenuItem
            leftIcon={<ModeEdit />}
            onClick={() => editNote(data.original)}
            primaryText="Notitie bewerken"
          />
          {/* <MenuItem
                        primaryText="Delen"
                        leftIcon={<SocialShare/>}
                        menuItems={[
                            <MenuItem primaryText="Email" leftIcon={<CommunicationEmail/>} onClick={() => share(data.original.title.link, 'Email')} />,
                            <MenuItem primaryText="Shareable link" leftIcon={<ContentLink/>} onClick={() => share(data.original.title.link, 'Link')} />
                        ]}
                    /> */}
          <MenuItem
            leftIcon={<ActionDelete />}
            onClick={() => removeNote(data.original.id)}
            primaryText="Notitie verwijderen"
          />
        </IconMenu>
      </div>
    );
  }
}

export class MyNotesTitleCell extends React.Component {
  render() {
    const { data, editNote } = this.props;
    return (
      <div className="title-cell">
        <div className="title-div">
          <a
            className="notes-tooltip"
            onClick={() => editNote(data.original)}
            style={{ color: appResources.in_content_color }}
          >
            {data.value.title}
          </a>
        </div>
        <div className="description-div">{data.value.description}</div>
      </div>
    );
  }
}

export class MenuCell extends React.Component {
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

  render() {
    const {
      data,
      favoriteMenuItemType,
      dossiers,
      handleOpenNewDossier,
      folderOwnerID,
      userID,
      favoriteAction,
      addToDossier,
      iconStyle,
      addNotification,
      deleteFile,
      removeItemFromDossier
    } = this.props;
    let item_menu = '';
    const item = data[0] ? data[0] : data.original;
    const action_id =
      favoriteMenuItemType === 'Add' ? item.options.combined_id : item.options.fav_id;

    const iconStl = iconStyle ? iconStyle : {};

    let dossiers_menu;

    if (dossiers) {
      dossiers_menu = dossiers.map(dossier => {
        return (
          <MenuItem
            primaryText={dossier.title}
            leftIcon={<FileFolder color={dossier.color} />}
            onClick={() => addToDossier(dossier.id, item.options.combined_id)}
          />
        );
      });
      dossiers_menu.push(
        <MenuItem
          primaryText="Add new map"
          leftIcon={<ContentAdd />}
          onClick={() => handleOpenNewDossier(item.options.combined_id)}
        />
      );
    }

    if (item.type.toLowerCase() === 'event' || item.type.toLowerCase() === 'child_event') {
      const calEvent = {
        title: item.title.title,
        description: item.title.title,
        location: `Gemeente ${appResources.municipality}`,
        startTime: item.created_at,
        endTime: item.created_at
      };

      item_menu = (
        <IconMenu
          iconStyle={iconStl}
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon color="#444" />
            </IconButton>
          }
          anchorOrigin={
            this.props.menuStyle
              ? { vertical: 'center', horizontal: 'right' }
              : appResources.itemMenuAnchorOrigin
          }
          targetOrigin={
            this.props.menuStyle
              ? { vertical: 'top', horizontal: 'left' }
              : appResources.itemMenuTargetOrigin
          }
        >
          <MenuItem
            primaryText="Delen"
            leftIcon={<SocialShare />}
            menuItems={[
              <MenuItem
                primaryText="Email"
                leftIcon={<CommunicationEmail />}
                onClick={() =>
                  share(
                    item.type,
                    getItemDetailUrl(item.type, item.options.origin_id),
                    item.title.title,
                    'Email'
                  )
                }
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() =>
                  share(
                    item.type,
                    getItemDetailUrl(item.type, item.options.origin_id),
                    item.title.title,
                    'Link'
                  )
                }
              />
            ]}
          />
          <MenuItem
            primaryText="Toevoegen aan folder"
            leftIcon={<FileCreateNewFolder />}
            menuItems={dossiers_menu}
          />
          {removeItemFromDossier && (
            <MenuItem
              primaryText="Verwijderen uit folder"
              leftIcon={<ActionDelete />}
              onClick={removeItemFromDossier}
            />
          )}
          <MenuItem
            primaryText="Stel notificatie in"
            leftIcon={<ActionAlarm />}
            onClick={() => addNotification(item.options.combined_id)}
          />
          <MenuItem
            primaryText={
              favoriteMenuItemType === 'Add'
                ? 'Toevoegen aan favorieten'
                : 'Verwijderen uit favorieten'
            }
            leftIcon={
              favoriteMenuItemType === 'Add' ? (
                <Favorite style={{ color: '#757575', fill: '#757575' }} />
              ) : (
                <ActionDelete />
              )
            }
            onClick={() => favoriteAction(action_id)}
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
              />
            ]}
          />
        </IconMenu>
      );
    } else if (item.type === 'Geupload document') {
      item_menu = (
        <IconMenu
          iconStyle={iconStl}
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={
            this.props.menuStyle
              ? { vertical: 'center', horizontal: 'right' }
              : appResources.itemMenuAnchorOrigin
          }
          targetOrigin={
            this.props.menuStyle
              ? { vertical: 'top', horizontal: 'left' }
              : appResources.itemMenuTargetOrigin
          }
        >
          <MenuItem
            primaryText="Downloaden"
            leftIcon={<FileDownload />}
            onClick={() => window.open(item.url)}
          />
          <MenuItem
            primaryText={'Verwijder bestand'}
            leftIcon={<ActionDelete />}
            onClick={deleteFile}
          />
        </IconMenu>
      );
    } else {
      item_menu = (
        <IconMenu
          iconStyle={iconStl}
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={
            this.props.menuStyle
              ? { vertical: 'center', horizontal: 'right' }
              : appResources.itemMenuAnchorOrigin
          }
          targetOrigin={
            this.props.menuStyle
              ? { vertical: 'top', horizontal: 'left' }
              : appResources.itemMenuTargetOrigin
          }
        >
          {item.type === 'document' && (
            <MenuItem
              primaryText="Downloaden"
              leftIcon={<FileDownload />}
              onClick={() => window.open(item.url)}
            />
          )}
          <MenuItem
            primaryText="Delen"
            leftIcon={<SocialShare />}
            menuItems={[
              <MenuItem
                primaryText="Email"
                leftIcon={<CommunicationEmail />}
                onClick={() =>
                  share(
                    item.type,
                    getItemDetailUrl(item.type, item.options.origin_id),
                    item.title.title,
                    'Email'
                  )
                }
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() =>
                  share(
                    item.type,
                    getItemDetailUrl(item.type, item.options.origin_id),
                    item.title.title,
                    'Link'
                  )
                }
              />
            ]}
          />
          <MenuItem
            primaryText="Toevoegen aan folder"
            leftIcon={<FileCreateNewFolder />}
            menuItems={dossiers_menu}
          />
          {removeItemFromDossier && (
            <MenuItem
              primaryText="Verwijderen uit folder"
              leftIcon={<ActionDelete />}
              onClick={removeItemFromDossier}
            />
          )}
          <MenuItem
            primaryText="Stel notificatie in"
            leftIcon={<ActionAlarm />}
            onClick={() => addNotification(item.options.combined_id)}
          />
          <MenuItem
            primaryText={
              favoriteMenuItemType === 'Add'
                ? 'Toevoegen aan favorieten'
                : 'Verwijderen uit favorieten'
            }
            leftIcon={
              favoriteMenuItemType === 'Add' ? (
                <Favorite style={{ color: '#757575', fill: '#757575' }} />
              ) : (
                <ActionDelete />
              )
            }
            onClick={() => favoriteAction(action_id)}
          />
        </IconMenu>
      );
    }
    return (
      <div
        className="icon-text-cell menu-cell"
        style={this.props.menuStyle ? this.props.menuStyle : {}}
      >
        {item_menu}
      </div>
    );
  }
}
