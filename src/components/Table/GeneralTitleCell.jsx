/* dependencies */
import React from 'react';

const GeneralTitleCell = ({ value, paddingTop, hasDescription }) => {
  return <div style={{ paddingTop: hasDescription ? 0 : paddingTop }}>{value}</div>;
};

export default GeneralTitleCell;
