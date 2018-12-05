import React from 'react';
import { IconMenu, IconButton, MenuItem, Menu } from 'material-ui';
import ContentFilter from '@material-ui/icons/FilterList';
import appResources from '../../appResources';

const selectedStyle = {
  color: appResources.in_content_color,
};

class SortByMenu extends React.Component {
  render() {
    const { setSortBy, selected, justName } = this.props;
    return (
      <IconMenu
        className="sort-by-menu"
        iconButtonElement={
          <IconButton>
            <ContentFilter style={{ color: appResources.in_content_color }} />
          </IconButton>
        }
      >
        <Menu
          value={selected}
          selectedMenuItemStyle={selectedStyle}
          desktop
          style={{ width: '100%' }}
        >
          <MenuItem value="name" primaryText="Naam a/z" onClick={() => setSortBy('name')} />
          <MenuItem value="-name" primaryText="Naam z/a" onClick={() => setSortBy('-name')} />
          {!justName && (
            <MenuItem
              value="date"
              primaryText="Publicatie datum oplopend"
              onClick={() => setSortBy('date')}
            />
          )}
          {!justName && (
            <MenuItem
              value="-date"
              primaryText="Publicatie datum aflopend"
              onClick={() => setSortBy('-date')}
            />
          )}
          {!justName && (
            <MenuItem
              value="last_modified"
              primaryText="Wijzigings datum oplopend"
              onClick={() => setSortBy('last_modified')}
            />
          )}
          {!justName && (
            <MenuItem
              value="-last_modified"
              primaryText="Wijzigings datum aflopend"
              onClick={() => setSortBy('-last_modified')}
            />
          )}
        </Menu>
      </IconMenu>
    );
  }
}

export default SortByMenu;
