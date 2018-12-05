import React from 'react';
import cx from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import NoteModal from '../modals/NoteModal';
import appResources from '../../appResources';
import styles from './Notes.module.scss';

class Notes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noteContent: '',
      showNoteContent: false,
    };
  }

  render() {
    const { notes, editNote } = this.props;
    const { noteContent, showNoteContent } = this.state;
    return (
      <div className={styles.component}>
        <NoteModal
          show={showNoteContent}
          content={noteContent}
          close={() => {
            this.setState({
              noteContent: '',
              showNoteContent: false,
            });
          }}
        />
        <header className={styles.notesHeaderTitle}>
          <span>Gerelateerde notities</span>
        </header>

        {notes.length === 0 && (
          <div className={cx(styles.notesInstruction, [notes ? '' : styles.hiddenElement])}>
            <span>Er zijn nog geen notities gemaakt</span>
          </div>
        )}

        {notes.length > 0 && (
          <Table
            className={cx(styles.notesTable)}
            selectable={false}
          >
            <TableBody displayRowCheckbox={false}>
              {notes &&
                notes.map(note => {
                  return (
                    <TableRow key={note.id}>
                      <TableCell>
                        <a
                          className="notes-tooltip"
                          onClick={() => editNote(note)}
                          style={{ color: appResources.in_content_color }}
                        >
                          {note.title.title}
                        </a>
                      </TableCell>
                      <TableCell>{note.created_at}</TableCell>
                      <TableCell>{note.last_modified}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
}

export default Notes;
