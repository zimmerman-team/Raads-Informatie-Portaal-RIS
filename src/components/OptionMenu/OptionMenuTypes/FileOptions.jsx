import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FileDownload from 'material-ui/svg-icons/file/file-download';

export default function fileOptions(item, deleteFile) {
  const menuItems = [];

  // DOWNLOAD FILE
  menuItems.push(
    <MenuItem
      key={'1'}
      className="option-menu-item"
      primaryText={'Downloaden'}
      leftIcon={<FileDownload />}
      onClick={() => window.open(item.download_url)}
    />,
    // DELETE FILE
    <MenuItem
      key={'2'}
      className="option-menu-item"
      primaryText="Verwijderen uit folder"
      leftIcon={<ActionDelete />}
      onClick={deleteFile}
    />,
  );

  return menuItems;
}
