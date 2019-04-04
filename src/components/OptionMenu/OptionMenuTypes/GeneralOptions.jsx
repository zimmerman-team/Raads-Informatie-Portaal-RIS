import React from 'react';
import SocialShare from 'material-ui/svg-icons/social/share';
import MenuItem from 'material-ui/MenuItem';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import ContentLink from 'material-ui/svg-icons/content/link';
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import ActionAlarm from 'material-ui/svg-icons/action/alarm';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionEvent from 'material-ui/svg-icons/action/event';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { downloadEvent, share } from '../../../helpers';
import Favorite from '../../icons/Favorite';

const googleIcon = require('../../../images/googlecalendar.png');
const yahooIcon = require('../../../images/yahoocalendar.png');
const outlookIcon = require('../../../images/outlookcalendar.png');
const appleIcon = require('../../../images/applecalendar.png');

export default function generalOptions(
  item,
  dossiers,
  setDossierModal,
  addFavorite,
  addToDossier,
  addNotification,
  deleteFile = undefined,
  editDocFunc = undefined,
  delDocFunc = undefined
) {
  const menuItems = [];

  const dossierMenu = [
    <MenuItem
      key={'156'}
      className="option-menu-item"
      primaryText="Add new map"
      leftIcon={<ContentAdd />}
      onClick={() => setDossierModal(item.uid)}
    />
  ];

  dossierMenu.push(
    dossiers.map(dossier => {
      return (
        <MenuItem
          className="option-menu-item"
          key={dossier.id}
          primaryText={dossier.title}
          leftIcon={<FileFolder />}
          onClick={() => addToDossier(dossier.id, item.uid)}
        />
      );
    })
  );

  menuItems.push(
    //DOWNLOAD DOC
    item.type !== 'event' && item.download_url && (
      <MenuItem
        className="option-menu-item"
        key={'1'}
        primaryText={'Downloaden'}
        leftIcon={<FileDownload />}
        onClick={() => window.open(item.download_url)}
      />
    ),
    // SHARE
    <MenuItem
      className="option-menu-item"
      key={'2'}
      primaryText={'Delen'}
      leftIcon={<SocialShare />}
      menuItems={[
        <MenuItem
          className="option-menu-item"
          key={'1'}
          primaryText={'Email'}
          leftIcon={<CommunicationEmail />}
          onClick={() => share(item.type, item.url, item.title, 'Email')}
        />,
        <MenuItem
          className="option-menu-item"
          key={'2'}
          primaryText={'Shareable link'}
          leftIcon={<ContentLink />}
          onClick={() => share(item.type, item.url, item.title, 'Link')}
        />
      ]}
    />,
    // ADD TO FOLDER
    <MenuItem
      className="option-menu-item"
      key={'3'}
      primaryText={'Toevoegen aan folder'}
      leftIcon={<FileCreateNewFolder />}
      menuItems={dossierMenu}
    />,
    // ADD NOTIFICATION
    <MenuItem
      className="option-menu-item"
      key={'4'}
      primaryText={'Stel notificatie in'}
      leftIcon={<ActionAlarm />}
      onClick={() => addNotification(item.uid)}
    />,
    // ADD FAVORITE
    <MenuItem
      className="option-menu-item"
      key={'5'}
      primaryText={'Toevoegen aan favorieten'}
      leftIcon={<Favorite style={{ color: '#757575', fill: '#757575' }} />}
      onClick={() => addFavorite(item.uid)}
    />,
    //DELETE ITEM, used in folder_content
    deleteFile !== undefined ? (
      <MenuItem
        className="option-menu-item"
        key={'6'}
        primaryText="Verwijderen uit folder"
        leftIcon={<ActionDelete />}
        onClick={deleteFile}
      />
    ) : (
      ''
    )
  );
  // AGENDA SPECIFIC ITEMS
  if (
    (item.type && item.type.toLowerCase() === 'event') ||
    (item.type && item.type.toLowerCase() === 'child_event')
  ) {
    menuItems.push(
      // ADD TO EXTERNAL AGENDA
      <MenuItem
        className="option-menu-item"
        key={'7'}
        primaryText={'In externe agenda downloaden'}
        leftIcon={<ActionEvent />}
        menuItems={[
          <MenuItem
            className="option-menu-item"
            key={'1'}
            primaryText={'Google Calendar'}
            leftIcon={<img src={googleIcon} alt="google icon" width="32" height="32" />}
            onClick={() => downloadEvent(item, 'Google')}
          />,
          <MenuItem
            className="option-menu-item"
            key={'2'}
            primaryText={'Yahoo Calendar'}
            leftIcon={<img src={yahooIcon} alt="yahoo icon" width="32" height="32" />}
            onClick={() => downloadEvent(item, 'Yahoo')}
          />,
          <MenuItem
            className="option-menu-item"
            key={'3'}
            primaryText={'Outlook Calendar'}
            leftIcon={<img src={outlookIcon} alt="outlook icon" width="32" height="32" />}
            onClick={() => downloadEvent(item, 'Outlook')}
          />,
          <MenuItem
            className="option-menu-item"
            key={'4'}
            primaryText={'Apple Calendar'}
            leftIcon={<img src={appleIcon} alt="apple icon" width="32" height="32" />}
            onClick={() => downloadEvent(item, 'Apple')}
          />
        ]}
      />
    );
  }

  //and we check the url, because only a documents url will the word 'document in it'
  if (
    item.authorizedUser &&
    typeof item.url === 'string' &&
    item.url.indexOf('document') !== -1 &&
    editDocFunc !== undefined
  ) {
    menuItems.push(
      // EDIT DOCUMENT
      <MenuItem
        className="option-menu-item"
        key={'9'}
        primaryText={'Bewerk document'}
        leftIcon={<ModeEdit />}
        onClick={editDocFunc}
      />
    );
    menuItems.push(
      // EDIT DOCUMENT
      <MenuItem
        className="option-menu-item"
        key={'10'}
        primaryText={'Document verwijderen'}
        leftIcon={<ActionDelete />}
        onClick={delDocFunc}
      />
    );
  }

  return menuItems;
}
