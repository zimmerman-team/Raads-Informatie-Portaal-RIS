import React from 'react';

/* styles */
import styles from './ModalTextField.module.scss';

/* helpers */
import { getContainerBorderColor } from './ModalTextFieldHelper';

const ModalTextField = props => (
  <div
    className={styles.component}
    style={{ borderColor: getContainerBorderColor(props.value, props.required) }}
  >
    <span className={styles.asterisk} style={!props.required ? { width: 10 } : {}}>
      {props.required ? '*' : ''}
    </span>
    <input
      className={styles.input}
      type={'text'}
      placeholder={props.hintText}
      value={props.value ? props.value : ''}
      onChange={props.handleChange}
    />
  </div>
);

export default ModalTextField;
