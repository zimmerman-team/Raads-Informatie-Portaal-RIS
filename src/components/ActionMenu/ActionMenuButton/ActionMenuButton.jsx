import React from 'react';
import PropTypes from 'prop-types';
import Up from '@material-ui/icons/KeyboardArrowUp';
import Add from '@material-ui/icons/Add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import styles from './ActionMenuButton.module.scss';

const ActionMenuButton = ({ menuOpen, handleActionMenuClick }) => {
  return (
    <FloatingActionButton
      id="action-menu-button"
      className={styles.component}
      backgroundColor={menuOpen ? '#44a706' : '#f75002'}
      onClick={handleActionMenuClick}
    >
      {menuOpen ? <Up /> : <Add />}
    </FloatingActionButton>
  );
};

ActionMenuButton.propTypes = {
  handleActionMenuClick: PropTypes.func,
  menuOpen: PropTypes.bool,
};

export default ActionMenuButton;
