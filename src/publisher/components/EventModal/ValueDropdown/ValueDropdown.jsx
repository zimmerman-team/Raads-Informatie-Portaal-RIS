import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import styles from './ValueDropdown.module.scss';
import appResources from '../../../../appResources';

class ValueDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(e, value) {
    this.props.onChange(this.props.type, value);
    this.setState({ open: false });
  }

  render() {
    const { open, anchorEl } = this.state;
    const { width, items, selectedValue } = this.props;
    const selected = _.find(items, i => {
      return i === selectedValue;
    });
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
          className={styles.popover}
          style={{ width }}
        >
          <div className={styles.menuScrollDiv}>
            <Menu
              desktop
              value={selectedValue}
              onChange={this.onValueChange}
              menuItemStyle={{
                color: '#000',
                fontWeight: '300',
                fontSize: '20px',
              }}
              selectedMenuItemStyle={{ fontWeight: '500', color: '#000' }}
            >
              {items.map(i => (
                <MenuItem
                  key={i}
                  value={i}
                  primaryText={i.toString().length === 1 ? `0${i.toString()}` : i.toString()}
                  style={{
                    width: '100%',
                    color: '#000',
                    textAlign: 'center',
                  }}
                />
              ))}
            </Menu>
          </div>
        </Popover>
        <ListItem
          primaryText={
            <div className={styles.itemText} style={{ color: '#000' }}>
              {selected.toString().length === 1 ? `0${selected.toString()}` : selected.toString()}
            </div>
          }
          onClick={e => this.setState({ open: true, anchorEl: e.currentTarget })}
          rightIcon={
            <Glyphicon
              glyph={open ? 'chevron-up' : 'chevron-down'}
              style={{ margin: 0, color: '#000' }}
            />
          }
          innerDivStyle={{
            background: '#eee',
            borderRadius: 4,
            boxShadow: '0 6px 6px 0 rgba(0, 0, 0, 0.12)',
          }}
        />
      </div>
    );
  }
}

export default ValueDropdown;
