import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { connect } from 'react-redux';
import SocialShare from 'material-ui/svg-icons/social/share';
import MenuItem from 'material-ui/MenuItem';
import generalOptions from './OptionMenuTypes/GeneralOptions';
import { getItemDetailUrl } from '../../helpers';
import favoriteOptions from './OptionMenuTypes/FavoriteOptions';
import myFoldersOptions from './OptionMenuTypes/MyFoldersOptions';
import myAgendaOptions from './OptionMenuTypes/MyAgendaOptions';
import appResources from '../../appResources';
import fileOptions from './OptionMenuTypes/FileOptions';
import notesOptions from './OptionMenuTypes/NotesOptions';
import editDelOptions from './OptionMenuTypes/EditDelOptions';
import {
  addFavorite,
  addNoteToDossier,
  addToDossier,
  addAgenda,
  addNotification,
  deleteDossier,
  unshareDossier,
  removeFavorite,
  removeAgenda,
} from '../../actions/userActions';
import { setDossierModal } from '../../actions/generalActions';
import { removeNote } from '../../actions/notesActions';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import ActionDelete from 'material-ui/svg-icons/action/delete';

require('./OptionMenu.scss');

const propTypes = {
  anchorOrigin: PropTypes.object,
  targetOrigin: PropTypes.object,
  extraStyle: PropTypes.object,
  iconColor: PropTypes.string,
};

const defaultProps = {
  anchorOrigin: appResources.itemMenuAnchorOrigin,
  targetOrigin: appResources.itemMenuTargetOrigin,
  extraStyle: {},
  iconColor: '#444',
};

class OptionMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptionMenu: false,
    };

    this.formatMenuData = this.formatMenuData.bind(this);
  }

  formatMenuData(data, type) {
    let item;
    if (type === 'search' || type === 'fav' || type === 'folder_content') {
      const authorizedUser =
        this.props.is_admin || this.props.userType === 'admin' || this.props.userType === 'auteur';

      const temp = data.original;
      item = {
        date: temp.event_date,
        type: temp.options.type,
        id: temp.options.origin_id,
        uid: temp.options.combined_id,
        title: temp.title.title,
        download_url: temp.url,
        url: getItemDetailUrl(temp.options.type, temp.options.origin_id),
        authorizedUser,
      };
    } else if (type === 'my_agenda') {
      const temp = data.original;
      item = {
        date: temp.start_time,
        type: temp.parent_event ? 'child_event' : 'event',
        id: temp.id,
        uid: temp.combined_id,
        title: temp.name,
      };
      item.url = getItemDetailUrl(item.type, item.id);
    } else if (
      type === 'agenda' ||
      type === 'agenda_room' ||
      type === 'home' ||
      type === 'agenda_doc' ||
      type === 'event_doc'
    ) {
      item = data;
      item.download_url = item.download_url ? item.download_url : item.url;
      item.url = getItemDetailUrl(item.type, item.id);
    } else if (type === 'dossier_content') {
      item = data.original;
      item.download_url = item.download_url ? item.download_url : item.url;
      item.url = item.url;
      item.uid = item.combined_id;
    } else {
      item = data;
    }

    return item;
  }

  render() {
    const {
      optionType,
      data,
      dossiers,
      extraFunction,
      userID,
      addFavorite,
      addToDossier,
      addAgenda,
      addNotification,
      deleteDossier,
      unshareDossier,
      removeFavorite,
      setDossierModal,
      removeAgenda,
      removeNote,
      // favItemName,
      editDocFunc,
      removeFunc,
      editFunc,
      delName,
      editName,
      delDocFunc,
      addNoteToDossier,
    } = this.props;

    const item = this.formatMenuData(data, optionType);

    const _dossiers = dossiers !== undefined ? dossiers : [];
    const menuItems = [];

    menuItems.push(
      <div key={shortid.generate()} className="option-menu-title">
        <div className="option-menu-text"> Opties </div>
        <span className="close-menu" onClick={() => this.setState({ showOptionMenu: false })}>
          <div className="option-close-text"> Sluiten </div>
          <i className="material-icons">close</i>
        </span>
      </div>,
    );

    menuItems.push(<hr key={shortid.generate()} className="divider-line" />);

    if (optionType === 'agenda' && this.props.is_admin) {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<Edit />}
          primaryText="Bewerk evenement"
          onClick={this.props.edit}
        />,
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<Delete />}
          primaryText="Evenement verwijderen"
          onClick={this.props.delete}
        />,
      );
    }

    if (optionType === 'agenda_doc' && this.props.is_admin) {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<Delete />}
          primaryText="Agendapunt document verwijderen"
          onClick={this.props.delete}
        />,
      );
    }

    if (optionType === 'event_doc' && this.props.is_admin) {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<Delete />}
          primaryText="Gerelateerde document verwijderen"
          onClick={this.props.delete}
        />,
      );
    }

    if (optionType === 'agenda_dossier' && this.props.is_admin) {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<Delete />}
          primaryText="Agendapunt dossier verwijderen"
          onClick={this.props.delete}
        />,
      );
    }

    // FOR MY FAVORITES DASHBOARD ITEMS
    if (optionType === 'fav') {
      menuItems.push(favoriteOptions(item, removeFavorite));
    }
    // USER MANAGEMENT ITEMS/GENERIC DELETE ITEMS
    else if (optionType === 'griffie') {
      menuItems.push(editDelOptions(delName, editName, removeFunc, editFunc));
    }
    // MY FOLDERS ITEMS & OPENED FOLDER OPTIONS
    else if (optionType === 'my_folders' || optionType === 'opened_folder') {
      menuItems.push(
        myFoldersOptions(
          item,
          userID,
          setDossierModal,
          deleteDossier,
          unshareDossier,
          optionType,
          extraFunction,
        ),
      );
    }
    // PUBLIC FOLDERS ITEMS
    else if (optionType === 'public_folders') {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<SocialShare />}
          primaryText="Delen"
          onClick={this.props.share}
        />,
      );
      if (this.props.is_admin) {
        menuItems.push(
          <MenuItem
            className="option-menu-item"
            key={shortid.generate()}
            leftIcon={<Edit />}
            primaryText="Bewerk dossier"
            onClick={this.props.edit}
          />,
          <MenuItem
            className="option-menu-item"
            key={shortid.generate()}
            leftIcon={<Delete />}
            primaryText="Verwijder dossier"
            onClick={this.props.delete}
          />,
        );
      }
    }
    // MY AGENDA ITEMS
    else if (optionType === 'my_agenda') {
      menuItems.push(myAgendaOptions(item, addFavorite, removeAgenda, addNotification));
    }
    // MY NOTE ITEMS
    else if (optionType === 'notes') {
      menuItems.push(
        notesOptions(item, _dossiers, removeNote, extraFunction, setDossierModal, addNoteToDossier),
      );
    }
    // FOR FOLDER CONTENT ITEMS
    else if (optionType === 'folder_content') {
      if (item.type === 'Geupload document') {
        // USER UPLOADED FILE ITEMS
        menuItems.push(fileOptions(item, extraFunction));
      } else {
        // ALL THE OTHER CONTENT ITEMS
        menuItems.push(
          generalOptions(
            item,
            _dossiers,
            setDossierModal,
            addFavorite,
            addToDossier,
            addAgenda,
            addNotification,
            extraFunction,
          ),
        );
      }
    } else if (optionType === 'folder_note_content') {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={'1'}
          primaryText="Verwijderen uit folder"
          leftIcon={<ActionDelete />}
          onClick={extraFunction}
        />,
      );
    }
    // FOR DOSSIER CONTENT ITEMS
    else if (optionType === 'dossier_content') {
      if (item.type === 'public_dossier') {
        // PUBLIC DOSSIER ITEMS
        menuItems.push(
          generalOptions(
            item,
            _dossiers,
            setDossierModal,
            addFavorite,
            addToDossier,
            null,
            addNotification,
          ),
        );
      } else {
        // PUBLIC DOSSIER DOCUMENT ITEMS
        menuItems.push(
          generalOptions(
            item,
            _dossiers,
            setDossierModal,
            addFavorite,
            addToDossier,
            null,
            addNotification,
          ),
        );
      }
    } else if (optionType === 'agenda_point') {
      if (this.props.is_admin) {
        menuItems.push(
          <MenuItem
            className="option-menu-item"
            key={shortid.generate()}
            leftIcon={<Edit />}
            primaryText="Bewerk agendapunt"
            onClick={this.props.edit}
          />,
          <MenuItem
            className="option-menu-item"
            key={shortid.generate()}
            leftIcon={<Delete />}
            primaryText="Agendapunt verwijderen"
            onClick={this.props.delete}
          />,
        );
      }
    } else if (optionType === 'agenda_dossier') {
      menuItems.push(
        <MenuItem
          className="option-menu-item"
          key={shortid.generate()}
          leftIcon={<SocialShare />}
          primaryText="Delen"
          onClick={this.props.share}
        />,
      );
    }
    // FOR ALL PUBLICLY AVAILABLE ITEMS
    else {
      menuItems.push(
        generalOptions(
          item,
          _dossiers,
          setDossierModal,
          addFavorite,
          addToDossier,
          addAgenda,
          addNotification,
          undefined,
          editDocFunc,
          delDocFunc,
        ),
      );
    }

    const item_menu = (
      <IconMenu
        desktop
        useLayerForClickAway
        onRequestChange={() => this.setState({ showOptionMenu: false })}
        open={this.state.showOptionMenu}
        iconButtonElement={
          <IconButton onClick={e => this.setState({ showOptionMenu: true })}>
            <MoreVertIcon color={this.props.iconColor} />
          </IconButton>
        }
        onClick={e => e.stopPropagation()}
        anchorOrigin={
          window.innerWidth > 500
            ? this.props.anchorOrigin
            : { vertical: 'top', horizontal: 'left' }
        }
        targetOrigin={
          window.innerWidth > 500
            ? this.props.targetOrigin
            : { vertical: 'top', horizontal: 'left' }
        }
      >
        {menuItems}
      </IconMenu>
    );

    return (
      <div className="item-menu" style={this.props.extraStyle}>
        {item_menu}
      </div>
    );
  }
}

OptionMenu.propTypes = propTypes;
OptionMenu.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { user } = state;
  return {
    userID: user.userID,
    userType: user.type,
    is_admin: user.is_admin,
  };
}

export default connect(mapStateToProps, {
  addFavorite,
  addToDossier,
  addNoteToDossier,
  addAgenda,
  addNotification,
  removeFavorite,
  deleteDossier,
  unshareDossier,
  setDossierModal,
  removeAgenda,
  removeNote,
})(OptionMenu);
