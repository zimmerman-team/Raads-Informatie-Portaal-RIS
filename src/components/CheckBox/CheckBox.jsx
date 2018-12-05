/* base */
import React from 'react';
import PropTypes from 'prop-types';
import CheckBoxIcon from '../../components/icons/CheckBox';
/* styles */
import styles from './CheckBox.module.scss';
/* mock */
import mock from './CheckBox.mock';

/**
 * Generic checkbox component
 * @id {Any} - checkbox unique id
 * @name {String} - checkbox name
 * @value {Any} - checkbox value
 * @label {String} - checkbox label
 * @onChange {Function} - checkbox onChange event function
 * @checked {Boolean} - checkbox status
 */

const propTypes = {
  id: PropTypes.any,
  name: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  withLabel: PropTypes.bool,
  customStyle: PropTypes.object,
  customCheckBoxStyle: PropTypes.object,
};

const defaultProps = {
  id: mock.id,
  name: mock.name,
  value: mock.value,
  label: mock.label,
  onChange: null,
  checked: mock.checked,
  withLabel: true,
  customStyle: {},
  customCheckBoxStyle: {},
  customCheckBoxIconColor: '#fff',
};

const CheckBox = props => (
  <label className={styles.component} htmlFor={props.id} style={props.customStyle}>
    <input
      checked={props.checked}
      className={styles.input}
      id={props.id}
      name={props.name}
      onChange={props.onChange}
      type="checkbox"
      value={props.value}
      disabled={props.disabled}
    />
    <span className={styles.checkbox} style={props.customCheckBoxStyle}>
      {props.checked && (
        <CheckBoxIcon
          fill={props.customCheckBoxIconColor}
          width={mock.iconWidth}
          height={mock.iconHeight}
        />
      )}
    </span>
    {props.withLabel && <span className={styles.labelSpan}>{props.label}</span>}
  </label>
);

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;

export default CheckBox;
