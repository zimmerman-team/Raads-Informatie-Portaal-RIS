/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../appResources';
import { getItemDetailUrl } from '../../helpers';

/* components */

const calendar_icon = (
  <Glyphicon
    glyph="calendar"
    style={{ color: appResources.event_list_icon_color, marginRight: 15 }}
  />
);
const file_icon = (
  <Glyphicon glyph="file" style={{ color: appResources.doc_list_icon_color, marginRight: 15 }} />
);

export class FavoriteTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    const type = data.original.type;
    const icon =
      type.toLowerCase() === 'event' ||
      type.toLowerCase() === 'events' ||
      type.toLowerCase() === 'child_event'
        ? calendar_icon
        : file_icon;
    return (
      <div className="title-cell" style={{ marginTop: 5 }}>
        {icon}
        <div className="title-div">
          <Link
            to={getItemDetailUrl(data.original.type, data.original.id, data.original.parent_id)}
            style={{ color: appResources.in_content_color }}
          >
            {data.original.name}
          </Link>
        </div>
      </div>
    );
  }
}

export default FavoriteTitleCell;
