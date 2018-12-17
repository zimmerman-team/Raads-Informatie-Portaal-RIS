/* base */
import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import appResources from '../../appResources';
import MainMenuItem from './MainMenuItem/MainMenuItem';
import { removeAllFilters } from '../../actions/filterActions';
import find from 'lodash/find';
/* mock data */
import MockData from './MainMenu.mock';
/* style */
import styles from './MainMenu.module.scss';
/* icons */
import Home from '../icons/Home';
import About from '../icons/About';
import Agenda from '../icons/Agenda';
import PubliekeDossier from '../icons/PubliekeDossier';
import Search from '../icons/Search';
import MyNotes from '../icons/MyNotes';
import MyAgenda from '../icons/MyAgenda';
import Notification from '../icons/Notification';
import Favorite from '../icons/Favorite';
import Folder from '../icons/Folder';
import Profile from '../icons/Profile';
import CloseIcon from '../icons/CloseIcon';

/* todo: this component is much more a container than a component maybe relocate */

const adminItem = {
  title: 'Griffie',
  icon: 'public_dossiers',
  route: '/griffie',
  bottomBorder: true,
  controller: false,
};

export function getAdminMenu(sideBarIcons, is_admin) {
  const sideBarIconz = sideBarIcons;
  if (!find(sideBarIconz, ['title', 'Griffie'])) {
    if (is_admin) {
      sideBarIconz[sideBarIconz.length - 1].bottomBorder = false;
      sideBarIconz.push(adminItem);
    }
  }
  return sideBarIconz;
}

class MainMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sideBarIcons: props.loggedIn ? getAdminMenu(MockData, props.is_admin) : MockData.slice(0, 6),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loggedIn !== nextProps.loggedIn) {
      this.setState({
        sideBarIcons: nextProps.loggedIn
          ? getAdminMenu(MockData, nextProps.is_admin)
          : MockData.slice(0, 6),
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

  isSelected(routeName) {
    const { pathname } = this.props.location;
    if (routeName === '/') {
      return pathname === '' || pathname === '/';
    }
    return pathname.replace(/\//g, '').indexOf(routeName.replace(/\//g, '')) > -1;
  }

  handleClickOutside = evt => {
    if (this.props.active) {
      this.props.toggleNav();
    }
  };

  getIcon(icon) {
    switch (icon) {
      case 'close':
        return <CloseIcon />;
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'calendar':
        return <Agenda />;
      case 'about':
        return <About />;
      case 'notifications':
        return <Notification />;
      case 'queries':
        return <PubliekeDossier />;
      case 'public_dossiers':
        return <PubliekeDossier />;
      case 'favorites':
        return <Favorite />;
      case 'folders':
        return <Folder />;
      case 'my_agenda':
        return <MyAgenda />;
      case 'my_notes':
        return <MyNotes />;
      case 'profile':
        return <Profile />;
      default:
        return <About />;
    }
  }

  render() {
    const { active, removeAllFilters } = this.props;

    return (
      <nav
        className={cx(styles.component, 'main-nav', active && styles.open, active && 'open')}
        style={{ background: appResources.color_normal }}
      >
        <ul className={styles.navList}>
          {this.state.sideBarIcons.map((item, index) => (
            <MainMenuItem
              key={index}
              icon={this.getIcon(item.icon)}
              title={item.title}
              route={item.route}
              active={this.isSelected(item.route)}
              menuOpen={this.props.active}
              bottomBorder={item.bottomBorder}
              toggleNav={this.props.toggleNav}
              controller={item.controller}
              externalLink={item.externalLink}
              clearFilters={removeAllFilters}
              closeNav={this.props.closeNav}
            />
          ))}
        </ul>
      </nav>
    );
  }
}

MainMenu.propTypes = {
  activeStyleColor: PropTypes.object,
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    loggedIn: user.token.length > 0,
    is_admin: user.type === 'admin',
  };
}

export default withRouter(connect(mapStateToProps, { removeAllFilters })(onClickOutside(MainMenu)));
