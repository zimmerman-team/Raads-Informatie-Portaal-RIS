import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

export default function editDelOptions(delName, editName, removeFunc, editFunc) {
  const menuItems = [];

  // REMOVE FAVORITE
  menuItems.push(
    <MenuItem
      key={'1'}
      className="option-menu-item"
      primaryText={delName}
      leftIcon={<ActionDelete />}
      onClick={removeFunc}
    />,
    <MenuItem
      className="option-menu-item"
      key={'2'}
      leftIcon={<ModeEdit />}
      onClick={editFunc}
      primaryText={editName}
    />,
  );

  return menuItems;
}
