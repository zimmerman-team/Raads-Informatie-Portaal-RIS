import React from 'react';
import axios from 'axios';
import cx from 'classnames';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from 'material-ui-next/styles';
import appResources from './appResources';
import DossierModal from './components/modals/DossierModal';
import MySnackBar from './components/general/MySnackBar';
import QueryModal from './components/modals/QueryModal';
import AddNote from './components/modals/AddNote';
import PublisherDossierModal from './publisher/components/DossierModal/DossierModal';
import AddUserModal from './components/modals/AddUserModal/AddUserModal';
import { clearDate } from './actions/eventActions';
/* main components */
import Topbar from './components/TopBar/TopBar';
import MainMenu from './components/MainMenu/MainMenu';
import Footer from './components/Footer/Footer';
import ActionMenu from './components/ActionMenu/ActionMenu';
import MobileMenu from './components/MobileMenu/MobileMenu';
import { getUserData } from './actions/userActions';
/* style */
import styles from './App.module.scss';
import { specifySearch } from './actions/combinedActions';
import EventModal from './publisher/components/EventModal/EventModal';
import AgendaItemModal from './publisher/components/AgendaItemModal/AgendaItemModal';
import DocumentModal from './publisher/components/DocumentModal/DocumentModal';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import EventAddDocumentModal from './publisher/components/EventAddDocumentModal/EventAddDocumentModal';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

require('./App.css');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: appResources.basicColor,
    primary2Color: appResources.specialTextColor,
    accent1Color: appResources.secondColor,
  },
  tabs: {
    backgroundColor: '#EEEEEE',
    textColor: appResources.specialTextColor,
    selectedTextColor: appResources.secondColor,
  },
  inkBar: {
    backgroundColor: appResources.secondColor,
  },
  radioButton: {
    labelColor: appResources.specialTextColor,
    borderColor: appResources.basicColor,
  },
  fontFamily: appResources.fontFamily,
  datePicker: {
    headerColor: appResources.basicColor,
  },
  timePicker: {
    headerColor: appResources.basicColor,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openMenu: false,
      hideFoot: false,
      isOpen: false,
    };

    this.footerVisibility = this.footerVisibility.bind(this);
  }

  componentDidMount() {
    this.props.getUserData();
    axios.defaults.baseURL = appResources.backendUrl;
    this.footerVisibility(null, this.props.location.pathname, this.props.tab === 'timeline');
  }

  componentWillReceiveProps(nextProps) {
    const thisPath = this.props.location.pathname;
    const nextPath = nextProps.location.pathname;
    this.footerVisibility(thisPath, nextPath, nextProps.tab === 'timeline');
    if (nextPath.indexOf('agenda') !== -1 && thisPath.indexOf('event') === -1) {
      this.props.clearDate();
    }
    if (
      (nextPath.indexOf('zoeken') !== -1 || nextPath === '/') &&
      !(thisPath === '/' || thisPath.indexOf('event') !== -1 || thisPath.indexOf('document') !== -1)
    ) {
      this.props.specifySearch();
    }
  }

  toggleMenu() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  footerVisibility(thisPath, nextPath, isTimeline) {
    if (thisPath !== nextPath) {
      if (
        nextPath.startsWith('/profiel') ||
        nextPath.startsWith('/over-de-raad') ||
        nextPath.startsWith('/evenement') ||
        nextPath.startsWith('/agenda') ||
        (nextPath.startsWith('/publieke-dossiers') &&
          !(this.props.is_admin || this.props.is_author)) ||
        nextPath.startsWith('/login') ||
        (nextPath.startsWith('/zoeken') && isTimeline) ||
        nextPath.startsWith('/activeer') ||
        nextPath.startsWith('/wachtwoord-reset')
      ) {
        if (!this.state.hideFoot) {
          this.setState({
            hideFoot: true,
          });
        }
      } else {
        if (this.state.hideFoot) {
          this.setState({
            hideFoot: false,
          });
        }
      }
    }
  }

  render() {
    const { openMenu, hideFoot } = this.state;

    const isFirefox = typeof InstallTrigger !== 'undefined';
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className={styles.component}>
            {(!hideFoot || this.props.is_admin) && <ActionMenu />}
            {/* app header */}
            <Topbar
              openMenu={this.state.isOpen}
              currentPath={this.props.location.pathname}
              toggleNav={() => this.toggleMenu()}
            />

            <MobileMenu active={this.state.isOpen} toggleNav={() => this.toggleMenu()} />

            <div className={styles.wrapper}>
              {/* app navigation */}
              <MainMenu
                active={openMenu}
                closeNav={() => this.setState({ openMenu: false })}
                toggleNav={() => this.setState({ openMenu: !openMenu })}
              />

              {/* app content */}
              <div
                id="content-wrap"
                style={isFirefox ? { overflowY: 'auto' } : {}}
                className={cx(styles.contentContainer, styles.pusher, openMenu && styles.pushed)}
              >
                <ErrorBoundary>
                  <div className="content-div">{this.props.children}</div>
                </ErrorBoundary>
                {/* app footer */}
                {false && !hideFoot && <Footer toggleNav={() => this.toggleMenu()} />}
              </div>
            </div>
            <DossierModal />
            <QueryModal />
            <MySnackBar />
            <AddNote />
            {(this.props.is_author || this.props.is_admin) && (
              <React.Fragment>
                <PublisherDossierModal />
                <EventModal />
                <AgendaItemModal />
                <DocumentModal />
                <EventAddDocumentModal />
                {this.props.is_admin && <AddUserModal />}
              </React.Fragment>
            )}
          </div>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

function mapStateToProps(state) {
  const { tab, user } = state;
  return {
    tab,
    is_admin: user.is_admin,
    is_author: user.type === 'auteur',
  };
}

export default connect(mapStateToProps, {
  getUserData,
  clearDate,
  specifySearch,
})(App);
