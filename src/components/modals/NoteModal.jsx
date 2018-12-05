import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const NoteModal = ({ show, close, content }) => {
  const actions = [<Button label="Dicht" primary onClick={close} />];
  return (
    <Dialog open={show} actions={actions} onRequestClose={close}>
      <div className="note-content-div">{content}</div>
    </Dialog>
  );
};

export default NoteModal;
