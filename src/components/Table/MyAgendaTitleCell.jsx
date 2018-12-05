/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import appResources from '../../appResources';

/* components */

class MyAgendaTitleCell extends React.Component {
  render() {
    let { data } = this.props;
    data = data.original;
    const url =
      data.parent_event && data.parent_event !== 0
        ? `/evenement/${data.parent_event}/?zaal=${data.id}`
        : `/evenement/${data.id}`;
    const name = data.parent_event && data.parent_event !== 0 ? data.classification : data.name;
    return (
      <div className="title-cell" style={{ marginTop: 5 }}>
        <div className="title-div">
          <Link to={url} style={{ color: appResources.in_content_color }}>
            {name}
          </Link>
        </div>
      </div>
    );
  }
}

export default MyAgendaTitleCell;
