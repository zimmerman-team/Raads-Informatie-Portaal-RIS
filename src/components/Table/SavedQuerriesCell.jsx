/* dependencies */
import React from 'react';
import { browserHistory } from 'react-router';
import appResources from '../../appResources';

/* components */

export class SavedQuerriesCell extends React.Component {
  render() {
    const { data, removeQuery, setSavedQuery } = this.props;
    const queryState = {
      tab: data.original.tab,
      page: data.original.page,
      sortBy: data.original.sort_by,
      filters: data.original.filters,
    };
    return (
      <div className="title-cell">
        <div className="title-div">
          <a
            onClick={() => {
              setSavedQuery(queryState);
              browserHistory.push('/zoeken');
            }}
            style={{
              color: appResources.in_content_color,
              fontWeight: 'bold',
              verticalAlign: 'sub',
            }}
          >
            {data.original.title}
          </a>
        </div>
        <i
          className="material-icons"
          style={{ cursor: 'pointer' }}
          onClick={() => removeQuery(data.original.id)}
        >
          close
        </i>
      </div>
    );
  }
}

export default SavedQuerriesCell;
