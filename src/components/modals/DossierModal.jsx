import React from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import isEqual from 'lodash/isEqual';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Badge from 'material-ui/Badge';
import Dialog from 'material-ui/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Check from '@material-ui/icons/Check';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import appResources from '../../appResources';
import { setSnackBar, setDossierModal } from '../../actions/generalActions';
import {
  createUserDossier,
  createAndAddToDossier,
  editUserDossier,
} from '../../actions/userActions';

const colors = [
  { name: 'Tomaat', code: '#fd0012' },
  { name: 'Lime Groen', code: '#32cd32' },
  { name: 'Diep Roze', code: '#ff1493' },
  { name: 'Hemels Blauw', code: '#87ceff' },
  { name: 'Wijn Rood', code: '#aa0021' },
  { name: 'Zee Groen', code: '#698b69' },
  { name: 'Goud Reel', code: '#ffd700' },
  { name: 'Pimpel Paars', code: '#b600be' },
  { name: 'Donker Oranje', code: '#ff8c00' },
];

class DossierModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      title: '',
      selectedColorIndex: 0,
    };

    this.submit = this.submit.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  onTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  submit() {
    const { title, selectedColorIndex } = this.state;
    const {
      createUserDossier,
      createAndAddToDossier,
      setSnackBar,
      itemID,
      folder,
      editUserDossier,
    } = this.props;
    if (title !== '') {
      if (folder) {
        editUserDossier(folder.id, title, 'Private', colors[selectedColorIndex].code);
        this.setState({ step: 1, title: '' });
      } else {
        if (itemID !== null) {
          createAndAddToDossier(title, 'Private', colors[selectedColorIndex].code, itemID);
          this.setState({ step: 1, title: '' });
        } else {
          createUserDossier(title, 'Private', colors[selectedColorIndex].code);
          this.setState({ step: 1, title: '' });
        }
      }
      browserHistory.push('/folders');
    } else {
      setSnackBar('De mapnaam mag niet leeg zijn');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.setDossierModal('');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.folder, nextProps.folder) && nextProps.folder !== null) {
      this.setState({
        title: nextProps.folder.title,
        selectedColorIndex: colors.findIndex(element => {
          return nextProps.folder.color === element.code;
        }),
      });
    }
  }

  render() {
    const { step, title, selectedColorIndex } = this.state;
    const { show, setSnackBar, setDossierModal, folder, classes } = this.props;
    return (
      <Dialog
        open={show}
        modal={false}
        bodyClassName="fullscreen--modal-body"
        paperClassName="fullscreen--modal-paper"
        onRequestClose={() => {
          this.setState({ step: 1, title: '', selectedColorIndex: 0 });
          setDossierModal('');
        }}
        contentClassName="fullscreen--modal-content-new-folder"
      >
        <div className={`header ${step === 2 ? 'step2' : ''}`}>
          <div
            className="arrow-div back"
            onClick={() => this.setState({ step: 1 })}
            style={{ cursor: step !== 1 ? 'pointer' : 'not-allowed' }}
          >
            <div className="rectangle">
              <i className="material-icons">keyboard_arrow_left</i>
            </div>
            <div className="circle">{step === 1 ? 1 : 2}</div>
          </div>
          <div
            className="title-div"
            style={step === 2 ? { width: 'calc(100% - 150px)', marginLeft: 10 } : {}}
          >
            <div>{folder ? 'BEWERK FOLDER' : 'MAAK EEN FOLDER'}</div>
            <hr />
          </div>
          <div
            className="arrow-div next"
            // style={{ visibility: step !== 2 ? 'visible' : 'hidden' }}
            style={{ display: step !== 2 ? 'inline-block' : 'none' }}
            onClick={() => {
              if (title !== '') {
                this.setState({ step: 2 });
              } else {
                this.props.setSnackBar('De mapnaam mag niet leeg zijn');
              }
            }}
          >
            <div className="circle">2</div>
            <div className="rectangle">
              <i className="material-icons">keyboard_arrow_right</i>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="below-header">
            <h3>
              <i className="material-icons">create_new_folder</i>Geef uw Folder een naam
            </h3>
            <TextField
              autoFocus
              value={title}
              fullWidth
              id="folder-name"
              onChange={this.onTitleChange}
              placeholder="Naam van de folder"
            />
            <div style={{ float: 'right', marginTop: 40 }}>
              <Button
                onClick={() => {
                  this.setState({ step: 1, title: '', selectedColorIndex: 0 });
                  setDossierModal('');
                }}
                classes={classes.button}
                disabled={this.props.isLoggedIn}
                style={{ marginRight: 20, background: '#eee', color: '#444' }}
              >
                Annuleren
              </Button>
              <Button
                onClick={() => {
                  if (title !== '') {
                    this.setState({ step: 2 });
                  } else {
                    setSnackBar('De mapnaam mag niet leeg zijn');
                  }
                }}
                classes={classes.button}
                disabled={this.props.isLoggedIn}
                style={{ background: appResources.in_content_color, color: '#fff' }}
              >
                Bewaren
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="below-header" style={{ margin: '0 auto' }}>
            <h3>Kies een kleur voor uw Folder</h3>
            <div>
              <Row className="dossierModalRow">
                {colors.map((c, i) => {
                  return (
                    <Col
                      sm={12}
                      md={6}
                      lg={2}
                      className="color-div"
                      key={c.code}
                      onClick={() => this.setState({ selectedColorIndex: i })}
                    >
                      <Badge
                        badgeContent={<Check />}
                        className={`check ${selectedColorIndex !== i ? 'hidden' : ''}`}
                      >
                        <i className="material-icons" style={{ background: c.code }}>
                          folder
                        </i>
                      </Badge>
                      <label>{c.name}</label>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div style={{ float: 'right', marginTop: 40 }}>
              <Button
                onClick={() => {
                  this.setState({ step: 1, title: '', selectedColorIndex: 0 });
                  setDossierModal('');
                }}
                classes={classes.button}
                disabled={this.props.isLoggedIn}
                style={{ marginRight: 20, background: '#eee', color: '#444' }}
              >
                Annuleren
              </Button>
              <Button
                onClick={this.submit}
                classes={classes.button}
                disabled={this.props.isLoggedIn}
                style={{ background: appResources.in_content_color, color: '#fff' }}
              >
                Afronden
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { dossierModal } = state;
  return {
    itemID: dossierModal.itemID,
    show: dossierModal.visibility,
    folder: dossierModal.folder,
  };
}

export default withRouter(
  compose(
    withStyles({}),
    connect(mapStateToProps, {
      setSnackBar,
      setDossierModal,
      createUserDossier,
      createAndAddToDossier,
      editUserDossier,
    }),
  )(DossierModal),
);
