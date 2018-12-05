import React from 'react';
import cx from 'classnames';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import Button from 'material-ui-next/Button';
import { logout } from '../../actions/userActions';
import { municipality } from '../../config';
import appResources from '../../appResources';
import styles from './Footer.module.scss';

const footerImageStyle = {
  cursor: 'pointer',
  paddingTop: '0.3rem',
  width: appResources.municipality === 'Almere' ? '96' : 'auto',
  height: appResources.municipality === 'Almere' ? '96' : 'auto',
};

class Footer extends React.Component {
  getFooterImage(municipality) {
    switch (municipality) {
      case 'Rotterdam':
        return require('../../images/raad-rotterdam.png');
      case 'Almere':
        return require('../../images/raad-almere.jpg');
      case 'Utrecht':
        return require('../../images/raad-utrecht.png');
      default:
        return require('../../images/raad-rotterdam.png');
    }
  }

  /* fixme: duplicate code */
  userBtnClick() {
    if (this.props.loggedIn) {
      this.props.logout();
    } else {
      browserHistory.push('/login');
    }
  }

  render() {
    const { loggedIn } = this.props;
    return (
      <footer
        className={cx(styles.component)}
        style={{ background: appResources.footer.background }}
      >
        {/* mobile navigation */}
        <nav className={styles.footerNavigation}>
          {!loggedIn && (
            <Link to="/login" className={styles.footerNavButton}>
              <Button>
                <span className={styles.navButtonLabel}>INLOGGEN</span>
              </Button>
            </Link>
          )}

          {loggedIn && (
            <Button
              className={styles.footerNavButton}
              onClick={() => {
                this.props.logout();
              }}
            >
              <span className={styles.navButtonLabel}>UITLOGGEN</span>
            </Button>
          )}
        </nav>

        {/* regular footer content */}
        <div className={styles.footerInfo}>
          <div className="inline">
            <span className="footer-link">PAPER PROTOTYPE VERSIE: 0.1</span>
            <br />
            <span className="footer-link">
              ONTWIKKELD DOOR:{' '}
              <a
                style={{ color: 'white' }}
                rel="noopener noreferrer"
                target="_blank"
                href="https://zimmermanzimmerman.nl"
              >
                ZIMMERMAN & ZIMMERMAN
              </a>{' '}
              & INNOVATION FRONTIERS
            </span>
            <br />
            <span className="footer-link">
              IN OPDRACHT VAN:{' '}
              <a style={{ color: 'white' }} target="_blank" href={appResources.footer.griffieURL}>
                GRIFFIE {municipality.toUpperCase()}
              </a>
            </span>
          </div>
          {false && (
            <div className="inline raads-footer-div">
              <span className="footer-link">
                GEMAAKT VOOR DE{' '}
                <a
                  style={{ color: 'white' }}
                  target="_blank"
                  href={appResources.footer.municipalityURL}
                >
                  RAAD & INWONERS VAN {municipality.toUpperCase()}
                </a>
              </span>
              <br />
              <img
                src={this.getFooterImage(municipality)}
                alt="Raad's logo"
                style={footerImageStyle}
                onClick={() => window.open(appResources.footer.municipalityURL, '_blank')}
              />
            </div>
          )}
        </div>

        <div className={styles.footerLegal}>
          <span>
            <a href="/algemene-voorwaarden" className={styles.footerLink}>
              ALGEMENE VOORWAARDEN
            </a>
            <a href="/open-source-api" className={styles.footerLink}>
              OPEN SOURCE API - VOOR ONTWIKKELAARS
            </a>
          </span>
          <a className={styles.footerLink}>COPYRIGHT: RI-STUDIO 2018</a>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { user } = state;
  return {
    dossiers: user.dossiers,
    loggedIn: user.token !== '',
  };
}

export default connect(mapStateToProps, {
  logout,
})(Footer);
