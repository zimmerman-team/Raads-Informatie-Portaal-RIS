/* dependencies */
import React from 'react';

/* components */

export class IconTextCell extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div className="icon-text-cell">
        <i
          className="material-icons"
          style={{ color: data.value.icon.color, display: 'inline-block' }}
        >
          {data.value.icon.text}
        </i>
        <div className="text-div" style={{ display: 'inline-block' }}>
          {data.value.text}
        </div>
      </div>
    );
  }
}

export default IconTextCell;
