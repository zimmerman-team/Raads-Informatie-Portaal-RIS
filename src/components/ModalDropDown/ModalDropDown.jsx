import React from 'react';
import cx from 'classnames';
import find from 'lodash/find';
import filter from 'lodash/filter';

/* styles */
import styles from './ModalDropDown.module.scss';

//NOTE!! DROPDOWN ITEM WITH A VALUE OF FALSE IS CONSIDERED TO BE THE STARTING
//LABEL OF THE DROPDOWN!
class ModalDropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedLabel: '',
    };
  }

  componentDidMount() {
    const selectedVal = this.props.defaultSelected;
    this.setState({
      selectedLabel: find(this.props.items, ['value', selectedVal]).label,
    });
  }

  handleClick(value, label) {
    this.props.onItemClick(value);
    this.setState({
      selectedLabel: label,
      open: false,
    });
  }

  render() {
    return (
      <div className={styles.component}>
        <div className={styles.dropDown} onClick={() => this.setState({ open: !this.state.open })}>
          <span className={styles.asterisk} style={!this.props.required ? { width: 10 } : {}}>
            {this.props.required ? '*' : ''}
          </span>
          <span className={styles.input}>
            {this.state.selectedLabel.substr(0, this.state.selectedLabel.indexOf('-'))}
          </span>
          <i className={cx('material-icons', styles.arrowIcon)}>
            {this.state.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </i>
        </div>
        {this.state.open && (
          <ul className={styles.dropDownList}>
            {filter(this.props.items, item => {
              return item.value;
            }).map(item => {
              return (
                <li
                  className={styles.dropDownItem}
                  onClick={() => this.handleClick(item.value, item.label)}
                >
                  <b>{item.label.substr(0, item.label.indexOf('-'))}</b>
                  {item.label.substr(item.label.indexOf('-'))}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default ModalDropDown;
