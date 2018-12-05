/* base */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import cx from 'classnames';
import { Tooltip } from 'react-tippy';
/* style */
import styles from './MainMenuItem.module.scss';
import Hamburger from '../../icons/Hamburger';
import CloseIcon from '../../icons/CloseIcon';

/* todo: optimize component structure and styling */
const MainMenuItem = ({
  icon,
  title,
  active,
  menuOpen,
  route,
  bottomBorder,
  controller,
  toggleNav,
  clearFilters,
  externalLink,
  closeNav,
}) => {
  const isHome = route === '/';
  return (
    <li className={styles.component}>
      <Tooltip
        style={{ paddingTop: 0 }}
        title={title}
        position="right"
        trigger="mouseenter"
        disabled={'ontouchstart' in document.documentElement || active}
        duration={200}
      >
        <div
          className={cx(styles.menuItem, 'menu-item', active && 'active', active && styles.active)}
        >
          {controller && (
            <a onClick={toggleNav} role="presentation" className={cx(styles.menuBtn, 'menu-btn')}>
              {menuOpen ? <CloseIcon className={styles.closeIcon} /> : <Hamburger />}
              {/*<Icon>{menuOpen ? 'remove-sign' : 'menu-hamburger'} </Icon>*/}
              {/* todo: externalize text of controller button */}
              <span className={styles.text}>Sluit menu</span>
            </a>
          )}
          {externalLink && (
            <a href={externalLink} target="_blank" onClick={closeNav}>
              {icon}
              <span className={styles.text}>{title}</span>
            </a>
          )}
          {!controller &&
            !externalLink && (
              <Link
                to={route}
                onClick={() => {
                  closeNav();
                  if (title === 'Zoeken') clearFilters();
                }}
              >
                {icon}
                <span
                  className={cx(
                    styles.text,
                    isHome ? styles.homeBtn : '',
                    menuOpen && styles.visibleText,
                  )}
                >
                  {title}
                </span>
              </Link>
            )}
        </div>
      </Tooltip>
      {bottomBorder && <hr />}
    </li>
  );
};

MainMenuItem.propTypes = {
  /* icon can either be a string or a svg component */
  icon: PropTypes.object,
  title: PropTypes.string,
  active: PropTypes.bool,
  menuOpen: PropTypes.bool,
  route: PropTypes.string,
  bottomBorder: PropTypes.bool,
  controller: PropTypes.bool,
  toggleNav: PropTypes.func,
  home: PropTypes.bool,
  clearFilters: PropTypes.func,
  externalLink: PropTypes.string,
};

export default MainMenuItem;
