import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import appResources from '../../../appResources';

class CalendarControlDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(e, value) {
    const { type, date, handleChange } = this.props;
    let _date;
    if (type === 'month') {
      _date = moment(date).month(value);
    } else if (type === 'year') {
      _date = moment(date).year(value);
    }
    handleChange(_date.toDate());
    this.setState({ open: false });
  }

  render() {
    const { open, anchorEl } = this.state;
    const { type, width, items, selectedValue } = this.props;
    return (
      <div style={{ width, marginBottom: 10 }}>
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
          style={{ backgroundColor: '#fff', maxHeight: '500px', width, marginTop: 10 }}
        >
          <div className="menu-scroll-div">
            <Menu
              desktop
              value={selectedValue}
              onChange={this.onValueChange}
              menuItemStyle={{
                color: appResources.in_content_color,
                fontWeight: '300',
                fontSize: '20px',
              }}
              selectedMenuItemStyle={{ color: '#999' }}
            >
              {items.map(i => (
                <MenuItem
                  key={i.id}
                  value={i.id}
                  primaryText={i.name}
                  style={{
                    width: '100%',
                    color: appResources.in_content_color,
                    textAlign: 'center',
                  }}
                />
              ))}
            </Menu>
          </div>
        </Popover>
        <ListItem
          primaryText={
            <div
              className="date-control-text"
              style={{
                color: appResources.in_content_color,
                fontWeight: type === 'month' ? 'bold' : '300',
              }}
            >
              {
                _.find(items, i => {
                  return i.id === selectedValue;
                }).name
              }
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

export default CalendarControlDropdown;
