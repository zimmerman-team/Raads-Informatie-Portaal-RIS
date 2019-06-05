import React from 'react';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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
import appResources from '../../appResources';
import { municipality } from '../../config';
import { setDossierModal } from '../../actions/generalActions';
import { downloadEvent, share, getItemDetailUrl } from '../../helpers';
import {
  addFavorite,
  addToDossier,
  removeFavorite,
  addNotification
} from '../../actions/userActions';
import Favorite from '../../icons/Favorite';

const googleIcon = require('../../images/googlecalendar.png');
const yahooIcon = require('../../images/yahoocalendar.png');
const outlookIcon = require('../../images/outlookcalendar.png');
const appleIcon = require('../../images/applecalendar.png');

class ItemMenu extends React.Component {
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
    const { data, favoriteMenuItemType, dossiers, addNotification } = this.props;
    const item = data;
    let item_menu;
    const action_id = favoriteMenuItemType === 'Add' ? item.uid : item.fav_id;

    const _dossiers = dossiers !== undefined ? dossiers : [];

    const dossiers_menu = _dossiers.map(dossier => {
      return (
        <MenuItem
          primaryText={dossier.title}
          leftIcon={<FileFolder color={dossier.color} />}
          onClick={() => this.props.addToDossier(dossier.id, item.uid)}
        />
      );
    });
    dossiers_menu.push(
      <MenuItem
        primaryText="Add new map"
        leftIcon={<ContentAdd />}
        onClick={() => this.props.setDossierModal(item.uid)}
      />
    );

    if (item.type.toLowerCase() === 'event' || item.type.toLowerCase() === 'child_event') {
      const calEvent = {
        title: item.name,
        description: item.name,
        location: `Gemeente ${municipality}`,
        startTime: item.date,
        endTime: item.date
      };

      item_menu = (
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon
                color={
                  favoriteMenuItemType === 'Delete' ? appResources.dashboardTextColor : '#000000'
                }
              />
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
                onClick={() => share(item.type, item.url, item.name, 'Email')}
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() => share(item.type, item.url, item.name, 'Link')}
              />
            ]}
          />
          <MenuItem
            primaryText="Toevoegen aan folder"
            leftIcon={<FileCreateNewFolder />}
            menuItems={dossiers_menu}
          />
          <MenuItem
            primaryText="Stel notificatie in"
            leftIcon={<ActionAlarm />}
            onClick={() => addNotification(item.uid)}
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
            onClick={() => {
              if (favoriteMenuItemType === 'Add') {
                this.props.addFavorite(action_id);
              } else {
                this.props.removeFavorite(action_id);
              }
            }}
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
    } else {
      item_menu = (
        <IconMenu
          desktop
          useLayerForClickAway
          iconButtonElement={
            <IconButton>
              <MoreVertIcon
                color={
                  favoriteMenuItemType === 'Delete' ? appResources.dashboardTextColor : '#000000'
                }
              />
            </IconButton>
          }
          anchorOrigin={appResources.itemMenuAnchorOrigin}
          targetOrigin={appResources.itemMenuTargetOrigin}
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
                  share(item.type, getItemDetailUrl(item.type, item.id), item.name, 'Email')
                }
              />,
              <MenuItem
                primaryText="Shareable link"
                leftIcon={<ContentLink />}
                onClick={() =>
                  share(item.type, getItemDetailUrl(item.type, item.id), item.name, 'Link')
                }
              />
            ]}
          />
          <MenuItem
            primaryText="Toevoegen aan folder"
            leftIcon={<FileCreateNewFolder />}
            menuItems={dossiers_menu}
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
            onClick={() => {
              if (favoriteMenuItemType === 'Add') {
                this.props.addFavorite(action_id);
              } else {
                this.props.removeFavorite(action_id);
              }
            }}
          />
        </IconMenu>
      );
    }
    return <div className="item-menu">{item_menu}</div>;
  }
}

function mapStateToProps(state, ownProps) {
  const { user } = state;
  return {
    dossiers: user.dossiers
  };
}

export default connect(
  mapStateToProps,
  {
    addFavorite,
    addToDossier,
    removeFavorite,
    setDossierModal,
    addNotification
  }
)(ItemMenu);
