import React from 'react';

const Hamburger = props => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="none" d="M0 0h48v48H0z" />
    <path d="M12 28.2h24V30H12zM12 22.1h24v1.8H12zM12 16h24v1.8H12z" />
  </svg>
);

export default Hamburger;
