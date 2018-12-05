/* dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { IconMenu, IconButton, MenuItem, Menu } from 'material-ui';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
/* styles */
// import styles from './MyFolderFilterMenu.module.scss';
import appResources from '../../../../../appResources';

/**
 * todo: Please write a short component description
 * @param {Object} customProperty - please describe component property
 */

const MyFolderFilterMenu = ({ sort_by, sortBy }) => (
  <IconMenu
    className="sort-by-menu"
    iconButtonElement={
      <IconButton>
        <ContentFilter color={appResources.in_content_color} />
      </IconButton>
    }
  >
    <Menu value={sort_by} selectedMenuItemStyle={{ color: appResources.in_content_color }} desktop>
      <MenuItem value="title" primaryText="Naam a/z" onClick={() => sortBy('title')} />
      <MenuItem value="-title" primaryText="Naam z/a" onClick={() => sortBy('-title')} />
      <MenuItem
        value="created_at"
        primaryText="Publicatie datum oplopend"
        onClick={() => sortBy('created_at')}
      />
      <MenuItem
        value="-created_at"
        primaryText="Publicatie datum aflopend"
        onClick={() => sortBy('-created_at')}
      />
      <MenuItem
        value="last_modified"
        primaryText="Wijzigings datum oplopend"
        onClick={() => sortBy('last_modified')}
      />
      <MenuItem
        value="-last_modified"
        primaryText="Wijzigings datum aflopend"
        onClick={() => sortBy('-last_modified')}
      />
    </Menu>
  </IconMenu>
);

MyFolderFilterMenu.propTypes = {
  /* icon can either be a string or a svg component */
  sortBy: PropTypes.func,
  setSortBy: PropTypes.func,
};

export default MyFolderFilterMenu;
