import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';

export default function favoriteOptions(item, removeFavorite) {
  const menuItems = [];

  // REMOVE FAVORITE
  menuItems.push(
    <MenuItem
      key={'1'}
      className="option-menu-item"
      primaryText={'Verwijderen uit favorieten'}
      leftIcon={<ActionDelete />}
      onClick={() => removeFavorite(item.id)}
    />,
  );

  return menuItems;
}
