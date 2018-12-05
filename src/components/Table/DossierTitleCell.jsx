/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../appResources';

/* components */

export class DossierTitleCell extends React.Component {
  render() {
    const { data, publicFolder } = this.props;
    const folder_link = publicFolder
      ? `/publieke-dossiers/${data.original.id}`
      : `/folder/${data.original.id}`;
    return (
      <div className="title-cell" style={{ marginTop: 4 }}>
        <Glyphicon glyph="folder-open" style={{ color: data.original.color, marginRight: 15 }} />
        <div className="title-div">
          <Link to={folder_link} style={{ color: appResources.in_content_color }}>
            {data.original.title}
          </Link>
        </div>
      </div>
    );
  }
}
export default DossierTitleCell;
