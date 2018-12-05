/* dependencies */
import React from 'react';
import appResources from '../../appResources';

/* components */

const MyNotesTitleCell = ({ data, editNote }) => {
  return (
    <div className="title-cell">
      <div className="title-div">
        <a
          className="notes-tooltip"
          onClick={() => editNote(data.original)}
          style={{ color: appResources.in_content_color }}
        >
          {data.value.title}
        </a>
      </div>
      <div className="description-div">{data.value.description}</div>
    </div>
  );
};

export default MyNotesTitleCell;
