import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from '@material-ui/core/Button';
import { Glyphicon } from 'react-bootstrap';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import moment from 'moment/moment';
import isEmpty from 'lodash/isEmpty';
import SocialShare from '@material-ui/icons/Share';
import CommunicationEmail from '@material-ui/icons/Email';
import ContentLink from '@material-ui/icons/Link';
import FileDownload from '@material-ui/icons/FileDownload';
import appResources from '../../appResources';
import { setSnackBar, setAddNote } from '../../actions/generalActions';
import { createNote, editNote } from '../../actions/notesActions';
import { share } from '../../helpers';

const titleHintStyle = {
  fontSize: '24px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: '1',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: appResources.specialTextColor,
  marginBottom: '10px',
};

const titleInputStyle = {
  fontSize: '24px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: '1',
  letterSpacing: 'normal',
  textAlign: 'left',
  paddingBottom: '25px',
};

const descStyle = {
  fontSize: '20px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: '1',
  letterSpacing: 'normal',
  textAlign: 'left',
  paddingBottom: '256px',
};

class AddNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      id: 0,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { note } = nextProps;
    if (note && !isEmpty(note)) {
      const tit = note.title.title ? note.title.title : note.title;
      this.setState({
        title: tit,
        description: note.description,
        id: note.id,
      });
    }
  }

  componentWillUnmount() {
    this.props.setAddNote([], false, []);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.setAddNote([], false, []);
    }
  }

  onSubmit() {
    const { title, description } = this.state;
    const { setSnackBar, document, createNote, setAddNote, note, editNote } = this.props;

    if (title === '') {
      setSnackBar('De mapnaam mag niet leeg zijn');
    } else if (description === '') {
      setSnackBar('De beschrijving mag niet leeg zijn');
    } else {
      if (note && !isEmpty(note)) {
        editNote(note.id, title, description);
      } else {
        createNote(this.props.params.docID, this.props.params.type, document, title, description);
      }
      this.setState({
        title: '',
        description: '',
        id: 0,
      });
      setAddNote(document, false, []);
    }
  }

  render() {
    const { title, description } = this.state;
    const { show, document, setAddNote, note } = this.props;
    const doc_date =
      document && document.date
        ? moment(document.date.substring(0, document.date.indexOf('T'))).format('DD-MM-YYYY')
        : '';
    const menu = (
      <IconMenu
        style={{ verticalAlign: '7px', display: 'inline-block' }}
        desktop
        useLayerForClickAway
        iconButtonElement={
          <IconButton>
            <MoreVertIcon style={{ color: '#444' }} />
          </IconButton>
        }
        anchorOrigin={appResources.itemMenuAnchorOrigin}
        targetOrigin={appResources.itemMenuTargetOrigin}
      >
        <MenuItem
          primaryText="Downloaden"
          leftIcon={<FileDownload />}
          onClick={() => window.open(this.props.document.fileUrl)}
        />
        <MenuItem
          primaryText="Delen"
          leftIcon={<SocialShare />}
          menuItems={[
            <MenuItem
              primaryText="Email"
              leftIcon={<CommunicationEmail />}
              onClick={() => share(window.location, 'Email')}
            />,
            <MenuItem
              primaryText="Shareable link"
              leftIcon={<ContentLink />}
              onClick={() => share(window.location, 'Link')}
            />,
          ]}
        />
      </IconMenu>
    );
    return (
      <Dialog
        open={show}
        modal={false}
        bodyClassName="fullscreen--modal-body"
        paperClassName="fullscreen--modal-paper"
        onRequestClose={() => {
          setAddNote(document, false, []);
          this.setState({
            title: '',
            description: '',
            id: 0,
          });
        }}
        contentClassName="fullscreen--modal-content-new-folder"
      >
        <div className="add-note-page-container">
          <header className="add-note-header">
            <div className="noteIconTitleContainer">
              <Glyphicon glyph="pencil" className="add-note-icon" />
              <div className="add-note-title">
                {note && !isEmpty(note) ? 'Mijn notitie bewerken' : 'Een notitie toevoegen'}
              </div>
            </div>

            <div className="noteDetailContainer">
              <div className="add-note-text">
                <b>TITEL</b>
                : {document ? document.name : ''} {menu}
              </div>
              <div className="add-note-sub-text">
                <b> PUBLICATIE DATUM :</b> {doc_date}
                <div className="divider">|</div>
                <b> CATEGORIE :</b> {document ? document.category : ''}
                <div className="divider">|</div>
                <b> STATUS :</b> {document ? document.status : ''}
              </div>
            </div>
          </header>
          <div className="add-note-input-field">
            <TextField
              style={{ width: '95%' }}
              hintText={'Titel'}
              hintStyle={titleHintStyle}
              inputStyle={titleInputStyle}
              value={title}
              id="note-title"
              onChange={(e, value) => this.setState({ title: value })}
            />
            <div onClick={() => this.refs.note_desc.select()}>
              <TextField
                style={{ width: '95%', minHeight: '300px', marginTop: '6px' }}
                hintText={'Type hier de tekst van uw Notitie …'}
                multiLine
                hintStyle={descStyle}
                inputStyle={descStyle}
                value={description}
                id="note-description"
                ref="note_desc"
                onChange={(e, value) => this.setState({ description: value })}
              />
            </div>
            <div
              id="button-container"
              className="buttonContainer"
              style={{ float: 'right', marginRight: '5%' }}
            >
              <Button
                style={{ background: '#dddddd', color: '#fff', marginRight: 10 }}
                onClick={() => {
                  setAddNote(document, false, []);
                  this.setState({
                    title: '',
                    description: '',
                    id: 0,
                  });
                }}
              >
                Annuleren
              </Button>
              <Button
                style={{ background: appResources.in_content_color, color: '#fff' }}
                onClick={() => {
                  this.onSubmit();
                }}
              >
                {note && !isEmpty(note) ? 'Notitie opslaan' : 'Notitie toevoegen'}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { addNote } = state;
  return {
    document: addNote.document,
    show: addNote.visibility,
    note: addNote.note,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    createNote,
    setSnackBar,
    setAddNote,
    editNote,
  })(AddNote),
);
