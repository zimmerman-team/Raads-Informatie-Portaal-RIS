/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import appResources from '../../appResources';

export class AgendaTitleCell extends React.Component {
  render() {
    const { id, data } = this.props;
    const title = id !== -1 ? data.original.note : data.original.text;
    const link = `/document/0/${id !== -1 ? data.original.links[0].doc_id : data.original.id}`;
    return (
      <div className="title-cell">
        <div className="title-div">
          <Link to={link} style={{ color: appResources.in_content_color }}>
            {title}
          </Link>
        </div>
      </div>
    );
  }
}

export default AgendaTitleCell;
