/* base */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withRouter } from 'react-router';
import connect from 'react-redux/es/connect/connect';
import get from 'lodash/get';
import shortid from 'shortid';
/* material ui */
import { MenuList } from 'material-ui-next/Menu';
import { ListSubheader } from 'material-ui-next/List';
/* comps */
import MobileMenuItem from './MobileMenuItem/MobileMenuItem';
import { getAdminMenu } from '../MainMenu/MainMenu';
/* mock data */
import MockData from './MobileMenu.mock';
/* style */
import styles from './MobileMenu.module.scss';

class MobileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sideBarIcons: props.loggedIn ? getAdminMenu(MockData, props.is_admin) : MockData.slice(0, 5),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loggedIn !== nextProps.loggedIn) {
      this.setState({
        sideBarIcons: nextProps.loggedIn
          ? getAdminMenu(MockData, nextProps.is_admin)
          : MockData.slice(0, 5),
      });
    }
    if (
      this.props.is_admin !== nextProps.is_admin &&
      nextProps.is_admin &&
      nextProps.loggedIn &&
      this.props.loggedIn
    ) {
      this.setState({
        sideBarIcons: getAdminMenu(MockData, nextProps.is_admin),
      });
    }
  }

  render() {
    return (
      <nav className={cx(styles.component, this.props.active && styles.menuOpen)}>
        <MenuList>
          {this.props.loggedIn ? (
            <React.Fragment>
              {this.state.sideBarIcons
                .slice(0, 5)
                .map(item => (
                  <MobileMenuItem
                    key={shortid.generate()}
                    route={item.route}
                    itemData={item}
                    icon={item.icon}
                    toggleNav={this.props.toggleNav}
                  />
                ))}
              <ListSubheader className={styles.listHeader}>Persoonlijk dashboard</ListSubheader>
              {this.state.sideBarIcons
                .slice(5)
                .map((item, index) => (
                  <MobileMenuItem
                    key={shortid.generate()}
                    route={item.route}
                    itemData={item}
                    icon={item.icon}
                    toggleNav={this.props.toggleNav}
                    extraStyle={
                      index === get(this.state.sideBarIcons.slice(5), 'length', 0) - 1
                        ? { marginBottom: 100 }
                        : {}
                    }
                  />
                ))}
            </React.Fragment>
          ) : (
            this.state.sideBarIcons.map(item => (
              <MobileMenuItem
                key={shortid.generate()}
                route={item.route}
                itemData={item}
                icon={item.icon}
                toggleNav={this.props.toggleNav}
              />
            ))
          )}
        </MenuList>
      </nav>
    );
  }
}

MobileMenu.propTypes = {
  items: PropTypes.array,
  toggleNav: PropTypes.func,
  active: PropTypes.bool,
};

MobileMenu.defaultProps = {
  items: MockData,
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    loggedIn: user.token.length > 0,
    is_admin: user.type === 'admin',
  };
}

export default withRouter(connect(mapStateToProps)(MobileMenu));
