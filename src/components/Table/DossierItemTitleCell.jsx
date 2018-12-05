/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import appResources from '../../appResources';

/* components */

export class DossierItemTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div className="title-cell">
        <div className="title-div">
          <Link to={data.original.link} style={{ color: appResources.in_content_color }}>
            {data.original.title}
          </Link>
        </div>
      </div>
    );
  }
}

export default DossierItemTitleCell;
