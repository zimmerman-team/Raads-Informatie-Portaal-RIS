import React from 'react';
import { connect } from 'react-redux';
import remove from 'lodash/remove';
import ChipInput from 'material-ui-chip-input';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import appResources from '../../appResources';
import { setSnackBar } from '../../actions/generalActions';
import { shareDossier } from '../../actions/folderActions';

const btnStyle = {
  height: '50px',
  marginRight: 10,
  width: '165px',
  boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
};

const labelStyle = {
  fontSize: '21px',
  lineHeight: '50px',
  padding: '5px 10px',
  fontStyle: 'normal',
  fontWeight: 'normal',
  textTransform: 'none',
  fontStretch: 'normal',
  fontFamily: 'Roboto, sans-serif',
};

const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/g;

class FolderShare extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emails: [],
      selectedPerm: 'view',
    };

    this.submit = this.submit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.radioChange = this.radioChange.bind(this);
    this.handleRequestAdd = this.handleRequestAdd.bind(this);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
  }

  submit() {
    const { folder } = this.props;
    const { emails, selectedPerm } = this.state;
    if (emails.length > 0) {
      this.props.shareDossier(folder.id, emails, selectedPerm);
      this.props.cancel();
    } else {
      this.props.setSnackBar('Geen gebruikers geselecteerd');
    }
  }

  onBlur(e) {
    if (e.target.value !== '') this.handleRequestAdd(e.target.value);
  }

  radioChange(e, perm) {
    this.setState({
      selectedPerm: perm,
    });
  }

  handleRequestAdd(...newChips) {
    if (newChips[0]) {
      const chips = this.state.emails;
      newChips[0] = newChips[0].trim();
      if (email_regex.test(newChips[0]) && this.props.userEmail !== newChips[0]) {
        this.setState({ emails: chips.concat(newChips) });
      } else {
        if (!email_regex.test(newChips[0])) {
          this.props.setSnackBar('Niet een geldige email');
        } else if (this.props.userEmail === newChips[0]) {
          this.props.setSnackBar('Kan niet delen met uw e-mail...');
        }
      }
    }
  }

  handleRequestDelete(chip) {
    const chips = this.state.emails;
    this.setState({
      emails: remove(chips, c => {
        return c !== chip;
      }),
    });
  }

  render() {
    return (
      <div id="shareInput" className="folder-share-component">
        <label>Gedeeld met:</label>
        <ChipInput
          fullWidth
          value={this.state.emails}
          hintText={<div className="hint-text">Voeg email adres toe</div>}
          onRequestAdd={this.handleRequestAdd}
          onRequestDelete={this.handleRequestDelete}
          onPaste={event => {
            const clipboardText = event.clipboardData.getData('Text');
            event.preventDefault();
            this.handleRequestAdd(...clipboardText.split('\n').filter(t => t.length > 0));
            if (this.props.onPaste) {
              this.props.onPaste(event);
            }
          }}
          onBlur={this.onBlur}
          chipRenderer={(
            {
              value,
              text,
              chip,
              isFocused,
              isDisabled,
              handleClick,
              handleRequestDelete,
              defaultStyle,
            },
            key,
          ) => {
            return (
              <div key={key + text} className="chip-comp">
                <span>{text}</span>
                <i className="material-icons" onClick={handleRequestDelete}>
                  cancel
                </i>
              </div>
            );
          }}
          style={{ marginBottom: 10 }}
        />
        <RadioButtonGroup
          name="perm-radio"
          valueSelected={this.state.selectedPerm}
          onChange={this.radioChange}
          style={{ marginBottom: 10 }}
        >
          <RadioButton
            key={0}
            label="Bekijken"
            value="view"
            checkedIcon={<CheckBoxIcon />}
            uncheckedIcon={<CheckBoxOutline />}
            style={{ display: 'inline-block', width: '120px', marginRight: 20 }}
          />
          <RadioButton
            key={1}
            label="Bekijken & bewerken"
            value="edit"
            checkedIcon={<CheckBoxIcon />}
            uncheckedIcon={<CheckBoxOutline />}
            style={{ display: 'inline-block', width: '200px' }}
          />
        </RadioButtonGroup>
        <RaisedButton
          style={btnStyle}
          label="Verzenden"
          labelColor="#fff"
          labelStyle={labelStyle}
          onClick={this.submit}
          backgroundColor={appResources.in_content_color}
        />
        <RaisedButton
          style={btnStyle}
          label="Annuleren"
          labelColor="#fff"
          labelStyle={labelStyle}
          backgroundColor="#cbcbcb"
          onClick={this.props.cancel}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { user } = state;
  return {
    userEmail: user.email,
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
  shareDossier,
})(FolderShare);
