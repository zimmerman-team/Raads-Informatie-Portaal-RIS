/* dependencies */
import React from 'react';
import { Link } from 'react-router';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../appResources';
import { FORMATED_PUBLIC_DOSSIER } from '../../constants';

const calendar_icon = (
  <Glyphicon
    glyph="calendar"
    style={{ color: appResources.event_list_icon_color, marginRight: 15 }}
  />
);
const file_icon = (
  <Glyphicon glyph="file" style={{ color: appResources.doc_list_icon_color, marginRight: 15 }} />
);
const briefcase_icon = (
  <Glyphicon
    glyph="briefcase"
    style={{ color: appResources.doc_list_icon_color, marginRight: 15 }}
  />
);
const note_icon = (
  <Glyphicon glyph="pencil" style={{ color: appResources.doc_list_icon_color, marginRight: 15 }} />
);

export class FolderItemTitleCell extends React.Component {
  render() {
    const { data } = this.props;
    const type = data.original.formatted_type;
    let icon =
      type.toLowerCase() === 'event' ||
      type === 'Vergaderzaal' ||
      type.toLowerCase() === 'events' ||
      type.toLowerCase() === 'child_event'
        ? calendar_icon
        : type === FORMATED_PUBLIC_DOSSIER
          ? briefcase_icon
          : file_icon;
    icon = type === 'Notitie' ? note_icon : icon;
    return (
      <div className="title-cell" style={{ marginTop: 4 }}>
        {icon}
        <div className="title-div">
          {type !== 'Geupload document' &&
            type !== 'Notitie' && (
              <Link to={data.original.title.link} style={{ color: appResources.in_content_color }}>
                {data.original.title.title}
              </Link>
            )}
          {type === 'Geupload document' && (
            <a
              href={data.original.title.link}
              target="_blank"
              style={{ color: appResources.in_content_color }}
            >
              {data.original.title.title}
            </a>
          )}
          {type === 'Notitie' && (
            <a
              onClick={() => this.props.editNote(data.original)}
              style={{ color: appResources.in_content_color }}
            >
              {data.original.title.title}
            </a>
          )}
        </div>
      </div>
    );
  }
}
export default FolderItemTitleCell;
