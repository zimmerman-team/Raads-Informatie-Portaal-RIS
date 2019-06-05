import React from 'react';
import find from 'lodash/find';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import appResources from '../../../appResources';

class RoomsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  render() {
    const { rooms, selectedRoom, changeRoom } = this.props;
    const { open, anchorEl } = this.state;

    return (
      <div style={{ width: '100%', marginBottom: 20 }} className="rooms-dropdown-container">
        <Popover
          open={open}
          anchorEl={anchorEl}
          canAutoPosition={false}
          useLayerForClickAway
          autoCloseWhenOffScreen
          animation={PopoverAnimationVertical}
          onRequestClose={() => this.setState({ open: false })}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          style={{
            backgroundColor: '#fff',
            maxHeight: '500px',
            width: 'calc(100vw - 175px)',
            marginTop: 10,
          }}
        >
          <div className="menu-scroll-div">
            <Menu
              desktop
              value={selectedRoom}
              onChange={(e, v) => {
                changeRoom(v);
                this.setState({ open: false });
              }}
              menuItemStyle={{
                fontSize: '20px',
                fontWeight: '300',
                color: appResources.in_content_color,
              }}
              selectedMenuItemStyle={{ color: '#999' }}
            >
              {selectedRoom !== -1 && (
                <MenuItem key={-1} value={-1} primaryText="Agenda overview" />
              )}
              {rooms.map(r => {
                return (
                  <MenuItem
                    key={r.id}
                    value={r.id}
                    primaryText={
                      appResources.municipality !== 'Utrecht' ? r.classification : r.name
                    }
                  />
                );
              })}
            </Menu>
          </div>
        </Popover>
        <ListItem
          primaryText={
            <div
              className="date-control-text"
              style={{
                fontWeight: '300',
                color: appResources.in_content_color,
              }}
            >
              {selectedRoom === -1
                ? 'Selecteer een vergaderzaal'
                : appResources.municipality !== 'Utrecht'
                  ? find(rooms, i => {
                      return i.id === selectedRoom;
                    }).classification
                  : find(rooms, i => {
                      return i.id === selectedRoom;
                    }).name}
            </div>
          }
          onClick={e => this.setState({ open: true, anchorEl: e.currentTarget })}
          leftIcon={
            <Glyphicon
              style={{
                paddingTop: '0.3rem',
                color: appResources.in_content_color,
                fontWeight: '300',
              }}
              glyph={open ? 'chevron-up' : 'chevron-down'}
            />
          }
        />
      </div>
    );
  }
}

export default RoomsDropdown;
