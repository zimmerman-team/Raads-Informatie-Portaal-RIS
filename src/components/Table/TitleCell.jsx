/* dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../appResources';
/* components */
import { FORMATED_PUBLIC_DOSSIER } from '../../constants';
import Highlighter from 'react-highlight-words';
/* styles */
// import styles from './TitleCell.module.scss';

/**
 * todo: Please write a short component description
 * @param {Object} customProperty - please describe component property
 */

const TitleCell = ({ data, folders, isSearch, marginTop = 17, showExcerpt = false }) => {
  const opened_folder_icon = <Glyphicon glyph="folder-open" className="folder-item-icon" />;
  const briefcase_icon = (
    <Glyphicon
      glyph="briefcase"
      style={{ color: appResources.doc_list_icon_color, marginRight: 15 }}
    />
  );
  const calendar_icon = (
    <Glyphicon
      glyph="calendar"
      style={{ color: appResources.event_list_icon_color, marginRight: 15 }}
    />
  );
  const file_icon = (
    <Glyphicon glyph="file" style={{ color: appResources.doc_list_icon_color, marginRight: 15 }} />
  );
  const type = data.original.type;
  const icon =
    type.toLowerCase() === 'event' || type.toLowerCase() === 'events'
      ? calendar_icon
      : type === FORMATED_PUBLIC_DOSSIER
      ? briefcase_icon
      : file_icon;
  return (
    <div
      className="title-cell"
      style={{ marginTop: data.value.description !== '' ? 8 : marginTop }}
    >
      {!folders && icon}
      <div className="title-div">
        {folders && opened_folder_icon}
        <Link to={data.value.link} style={{ color: appResources.in_content_color }}>
          <Highlighter
            autoEscape
            highlightClassName="highlight-text"
            searchWords={isSearch ? isSearch.map(i => decodeURIComponent(i.value)) : []}
            textToHighlight={data.value.title}
          />
        </Link>
      </div>
      {data.value.description !== '' && showExcerpt && (
        <div className="description-div">
          <Highlighter
            autoEscape
            highlightClassName="highlight-text"
            searchWords={isSearch ? isSearch.map(i => decodeURIComponent(i.value)) : []}
            textToHighlight={data.value.description}
          />
        </div>
      )}
    </div>
  );
};

TitleCell.propTypes = {
  /* icon can either be a string or a svg component */
  data: PropTypes.any,
  folders: PropTypes.any,
};

export default TitleCell;
