/* base */
import React from 'react';
import PropTypes from 'prop-types';

/* style */
import styles from './PageHeader.module.scss';

/**
 * Creates a header element
 * @param {Object} icon - the page header icon
 * @param {String} title - the page header title
 * @param {String} description - the page header description
 */

const PageHeader = ({ icon, title, description }) => (
  <header className={styles.component}>
    <div className={styles.headerTop}>
      <div className={styles.headerIcon}>{icon}</div>
      <h1 className={styles.headerTitle}>{title}</h1>
    </div>
    {description && <p className={styles.headerDescription}>{description}</p>}
  </header>
);

PageHeader.propTypes = {
  /* icon can either be a string or a svg component */
  icon: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  /* description is optional, seen as how some pages do not have description */
  description: PropTypes.string,
};

export default PageHeader;
