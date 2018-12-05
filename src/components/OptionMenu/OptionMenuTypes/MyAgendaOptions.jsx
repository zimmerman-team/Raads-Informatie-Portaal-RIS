import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SocialShare from 'material-ui/svg-icons/social/share';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionAlarm from 'material-ui/svg-icons/action/alarm';
// import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import ContentLink from 'material-ui/svg-icons/content/link';
import { share } from '../../../helpers';
import Favorite from '../../icons/Favorite';

export default function myAgendaOptions(item, addFavorite, removeAgenda, addNotification) {
  const menuItems = [];

  menuItems.push(
    <MenuItem
      className="option-menu-item"
      key={'1'}
      leftIcon={<ActionDelete />}
      onClick={() => removeAgenda(item.id)}
      primaryText="Evenement verwijderen"
    />,
    <MenuItem
      className="option-menu-item"
      key={'2'}
      primaryText="Stel notificatie in"
      leftIcon={<ActionAlarm />}
      onClick={() => {
        addNotification(item.uid);
      }}
    />,
    <MenuItem
      className="option-menu-item"
      key={'3'}
      primaryText={'Toevoegen aan favorieten'}
      leftIcon={<Favorite style={{ color: '#757575', fill: '#757575' }} />}
      onClick={() => {
        addFavorite(item.uid);
      }}
    />,
    <MenuItem
      className="option-menu-item"
      key={'4'}
      primaryText="Delen"
      leftIcon={<SocialShare />}
      menuItems={[
        <MenuItem
          className="option-menu-item"
          key={'1'}
          primaryText="Email"
          leftIcon={<CommunicationEmail />}
          onClick={() => share(item.type, item.url, item.title, 'Email')}
        />,
        <MenuItem
          className="option-menu-item"
          key={'2'}
          primaryText="Shareable link"
          leftIcon={<ContentLink />}
          onClick={() => share(item.type, item.url, item.title, 'Link')}
        />,
      ]}
    />,
  );

  return menuItems;
}
