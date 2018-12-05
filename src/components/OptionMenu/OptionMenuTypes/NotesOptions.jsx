import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FileFolder from 'material-ui/svg-icons/file/folder';

export default function notesOptions(
  item,
  dossiers,
  removeNote,
  editNote,
  setDossierModal,
  addToDossier,
) {
  const menuItems = [];

  const dossierMenu = [
    <MenuItem
      key={'156'}
      className="option-menu-item"
      primaryText="Add new map"
      leftIcon={<ContentAdd />}
      onClick={() => setDossierModal(item.original.id, null, 'note')}
    />,
  ];

  dossierMenu.push(
    dossiers.map(dossier => {
      return (
        <MenuItem
          className="option-menu-item"
          key={dossier.id}
          primaryText={dossier.title}
          leftIcon={<FileFolder />}
          onClick={() => addToDossier(dossier.id, item.original.id)}
        />
      );
    }),
  );

  menuItems.push(
    // EDIT NOTE
    <MenuItem
      className="option-menu-item"
      key={'1'}
      leftIcon={<ModeEdit />}
      onClick={() => editNote(item.original)}
      primaryText="Notitie bewerken"
    />,
    // REMOVE NOTE
    <MenuItem
      className="option-menu-item"
      key={'2'}
      leftIcon={<ActionDelete />}
      onClick={() => removeNote(item.original.id)}
      primaryText="Notitie verwijderen"
    />,
    // ADD TO FOLDER
    <MenuItem
      className="option-menu-item"
      key={'3'}
      primaryText={'Toevoegen aan folder'}
      leftIcon={<FileCreateNewFolder />}
      menuItems={dossierMenu}
    />,
  );

  return menuItems;
}
