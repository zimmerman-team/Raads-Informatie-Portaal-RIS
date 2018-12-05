/* base */
import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import IconButton from 'material-ui-next/IconButton';
import Button from 'material-ui-next/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { browserHistory, Link } from 'react-router';
/* components */
import appResources from '../../appResources';
import { logout } from '../../actions/userActions';
/* styles */
import styles from './TopBar.module.scss';
/* icons */
import Hamburger from '../icons/Hamburger';

/* note: seems like more of container than a component */

class Topbar extends React.Component {
  pathName() {
    const { currentPath } = this.props;

    switch (true) {
      case currentPath.startsWith('/evenement'):
        return 'Kalender';
      case currentPath.startsWith('/zoeken'):
        return 'Zoeken';
      case currentPath.startsWith('/agenda'):
        return 'Agenda';
      case currentPath.startsWith('/document'):
        return 'Document';
      case currentPath.startsWith('/over-de-raad'):
        return 'Over de Raad';
      case currentPath.startsWith('/notificaties'):
        return 'Mijn Notificaties';
      case currentPath.startsWith('/bewaarde_zoekopdrachten'):
        return 'Mijn Zoekopdrachten';
      case currentPath.startsWith('/favorieten'):
        return 'Mijn Favorieten';
      case currentPath.startsWith('/folders'):
        return 'Mjin Folders';
      case currentPath.startsWith('/folder'):
        return 'Mjin Folder';
      case currentPath.startsWith('/profiel'):
        return 'Mjin Profiel';
      case currentPath.startsWith('/login'):
        return 'Login/Registreren';
      case currentPath.startsWith('/activeer'):
        return 'Activeer';
      case currentPath.startsWith('/activeer-account'):
        return 'Activeer';
      case currentPath.startsWith('/wachtwoord-reset'):
        return 'New password';
      case currentPath.startsWith('/publieke-dossiers'):
        return 'Publieke dossiers';
      case currentPath.startsWith('/algemene-voorwaarden'):
        return 'Algemene voorwaarden';
      case currentPath.startsWith('/contact'):
        return 'Contact';
      case currentPath.startsWith('/mijn_notities'):
        return 'Mijn Notities';
      case currentPath.startsWith('/mijn_kalender'):
        return 'Mijn Kalender';
      case currentPath.startsWith('/griffie'):
        return 'Griffie';
      default:
        return 'Niet gevonden';
    }
  }

  userBtnClick() {
    if (this.props.loggedIn) {
      this.props.logout();
    } else {
      browserHistory.push('/login');
    }
  }

  render() {
    const { toggleNav, currentPath, loggedIn } = this.props;
    return (
      <header
        className={cx(styles.component, 'top-bar', 'no-text-select')}
        style={{ background: appResources.header.background }}
      >
        <div className={styles.topbarTitleContainer}>
          {currentPath.length > 1 ? (
            <div className={styles.currentPageBox}>
              <IconButton className={styles.backButton} onClick={browserHistory.goBack}>
                <ArrowBack />
              </IconButton>
              <div className={cx(styles.currentPageTitle)}>{this.pathName()}</div>
              <div className={styles.divider}>|</div>
            </div>
          ) : (
            <IconButton className={styles.menuButton} onClick={toggleNav}>
              <Hamburger />
            </IconButton>
          )}

          <div className={cx(styles.topBarTitle, '_title')}>
            Raadsinformatie Portaal Gemeente {appResources.municipality}
          </div>

          <div className={cx(styles.topBarTitleSmall)}>
            <span className={styles.municipalityName}>Gemeente {appResources.municipality}</span>
            <span className={styles.portalName}>Raadsinformatie Portaal</span>
          </div>
        </div>

        <Button className={styles.loginText} onClick={this.userBtnClick.bind(this)}>
          {loggedIn ? 'Logout' : 'Login/Registreren'}
        </Button>

        <IconButton className={styles.loginButton}>
          {loggedIn ? (
            <ExitToApp
              onClick={() => {
                this.props.logout();
              }}
            />
          ) : (
            <Link to="/login">
              <AccountCircle />
            </Link>
          )}
        </IconButton>
      </header>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    dossiers: user.dossiers,
    loggedIn: user.token !== '',
  };
}

export default connect(mapStateToProps, {
  logout,
})(Topbar);
