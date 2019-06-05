import React from 'react';
import find from 'lodash/find';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import appResources from '../../../appResources';

class RoomsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.props.changeRoom(value);
    this.setState({ open: false });
  }

  render() {
    const { open, anchorEl } = this.state;
    const { rooms, selectedRoom, classes } = this.props;

    return (
      <div style={{ width: '100%', marginBottom: 20 }} className="rooms-dropdown-container">
        <Menu
          open={open}
          id="rooms-menu"
          anchorEl={anchorEl}
          PaperProps={{
            style: {
              marginTop: '10px',
              maxHeight: '500px',
              width: 'calc(100vw - 160px)',
            },
            anchorEl,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          onClose={() => this.setState({ open: false })}
        >
          {selectedRoom !== -1 && (
            <MenuItem key={-1} onClick={() => this.onChange(-1)}>
              Agenda overview
            </MenuItem>
          )}
          {rooms.map(r => {
            return (
              <MenuItem key={r.id} onClick={() => this.onChange(r.id)}>
                {r.name}
              </MenuItem>
            );
          })}
        </Menu>

        <ListItem
          classes={classes}
          onClick={e => this.setState({ open: true, anchorEl: e.currentTarget })}
        >
          <ListItemIcon>
            <Glyphicon
              style={{
                paddingTop: '0.3rem',
                color: appResources.in_content_color,
                fontWeight: '300',
              }}
              glyph={open ? 'chevron-up' : 'chevron-down'}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <div
                className="date-control-text"
                style={{
                  fontWeight: '300',
                  color: appResources.in_content_color,
                }}
              >
                {selectedRoom === -1
                  ? 'Selecteer een vergaderzaal'
                  : find(rooms, i => {
                      return i.id === selectedRoom;
                    }).name}
              </div>
            }
          />
        </ListItem>
      </div>
    );
  }
}

export default withStyles()(RoomsDropdown);
