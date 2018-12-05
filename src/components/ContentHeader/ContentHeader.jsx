/* dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
/* styles */
import styles from './ContentHeader.module.scss';

/**
 * todo: Please write a short component description
 * @param {Object} customProperty - please describe component property
 */

const ContentHeader = ({ icon, title, glyph }) => (
  <div className={styles.component}>
    {(icon || glyph) &&
      (glyph ? (
        <Glyphicon className={cx(styles.glyphIcon, 'with-back')} glyph={glyph} />
      ) : (
        <i className={cx(styles.materialUiIcon, 'material-icons')}>{icon}</i>
      ))}
    <h3 className={styles.contentHeaderTitle}>{title}</h3>
  </div>
);

ContentHeader.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
};

export default ContentHeader;
