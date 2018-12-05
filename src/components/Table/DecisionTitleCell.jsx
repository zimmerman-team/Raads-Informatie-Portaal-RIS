/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import appResources from '../../appResources';

const decision_icon_style = {
  color: '#fa511e',
  float: 'left',
};

/* components */
export class DecisionTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    const title = data.original.title ? data.original.title : '';
    const link = data.original.link ? data.original.link : '';
    return (
      <div className="icon-title-cell">
        <i className="material-icons" style={decision_icon_style}>
          assignment_returned
        </i>
        <div className="icon-title-div">
          <Link to={link} style={{ color: appResources.in_content_color }}>
            {title}
          </Link>
        </div>
      </div>
    );
  }
}

export default DecisionTitleCell;
