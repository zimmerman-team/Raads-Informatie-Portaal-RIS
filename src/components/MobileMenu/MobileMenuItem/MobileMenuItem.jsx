import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'material-ui-next/Menu';
import { ListItemText, ListItemIcon } from 'material-ui-next/List';
import { Link } from 'react-router';
/* icons */
import Home from '../../icons/Home';
import About from '../../icons/About';
import Agenda from '../../icons/Agenda';
import PubliekeDossier from '../../icons/PubliekeDossier';
import Search from '../../icons/Search';
import MyNotes from '../../icons/MyNotes';
import MyAgenda from '../../icons/MyAgenda';
import Notification from '../../icons/Notification';
import Favorite from '../../icons/Favorite';
import Folder from '../../icons/Folder';
import Profile from '../../icons/Profile';
/* style */
import styles from './MobileMenuItem.module.scss';

/* todo: need to make a more generic and unified way of using icons */
const MobileMenuItem = ({ extraStyle, route, itemData, icon, toggleNav }) => {
  function getIcon(icon) {
    switch (icon) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'calendar':
        return <Agenda />;
      case 'about':
        return <About />;
      case 'notifications':
        return <Notification />;
      case 'queries':
        return <PubliekeDossier />;
      case 'public_dossiers':
        return <PubliekeDossier />;
      case 'favorites':
        return <Favorite />;
      case 'folders':
        return <Folder />;
      case 'my_agenda':
        return <MyAgenda />;
      case 'my_notes':
        return <MyNotes />;
      case 'profile':
        return <Profile />;
      default:
        return <About />;
    }
  }

  return !itemData.externalLink ? (
    <Link to={route} onClick={toggleNav}>
      <MenuItem color="inherit" className={styles.menuItem} style={extraStyle}>
        <ListItemIcon color="inherit">{getIcon(icon)}</ListItemIcon>
        <ListItemText className={styles.itemText}>{itemData.title}</ListItemText>
      </MenuItem>
    </Link>
  ) : (
    <a href={itemData.externalLink} target="_blank" onClick={toggleNav}>
      <MenuItem color="inherit" className={styles.menuItem} style={extraStyle}>
        <ListItemIcon color="inherit">{getIcon(icon)}</ListItemIcon>
        <ListItemText className={styles.itemText}>{itemData.title}</ListItemText>
      </MenuItem>
    </a>
  );
};

MobileMenuItem.propTypes = {
  route: PropTypes.string,
  itemData: PropTypes.object,
  icon: PropTypes.string,
  toggleNav: PropTypes.func,
  extraStyle: PropTypes.object,
};

export default MobileMenuItem;
