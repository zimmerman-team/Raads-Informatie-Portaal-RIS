import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SocialShare from 'material-ui/svg-icons/social/share';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import { browserHistory } from 'react-router';

export default function myFoldersOptions(
  folder,
  userID,
  setDossierModal,
  deleteDossier,
  unshareDossier,
  optionType,
  setFolderToShare,
) {
  const menuItems = [];

  menuItems.push(
    //SHARE FOLDER
    <MenuItem
      className="option-menu-item"
      key={'1'}
      leftIcon={<SocialShare />}
      primaryText="Delen"
      onClick={setFolderToShare}
    />,
    //EDIT FOLDER
    <MenuItem
      className="option-menu-item"
      key={'2'}
      leftIcon={<ModeEdit />}
      onClick={() => setDossierModal('', folder)}
      primaryText="Bewerk folder"
    />,
    //DELETE/UNSHARE FOLDER
    <MenuItem
      className="option-menu-item"
      key={'3'}
      leftIcon={<ActionDelete />}
      onClick={() => onDelete(folder, userID, deleteDossier, unshareDossier, optionType)}
      primaryText="Verwijder"
    />,
  );

  return menuItems;
}

function onDelete(folder, userID, deleteDossier, unshareDossier, optionType) {
  if (folder.owner.id === userID) {
    deleteDossier(folder.id, folder.owner.id);
  } else {
    unshareDossier(folder.id);
  }
  if (optionType === 'opened_folder') {
    browserHistory.push('/folders');
  }
}
