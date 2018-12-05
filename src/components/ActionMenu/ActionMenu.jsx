import React from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import Badge from '@material-ui/core/Badge';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Button from '@material-ui/core/Button';
import ContentAdd from '@material-ui/icons/Add';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ActionMenuButton from './ActionMenuButton/ActionMenuButton';
import appResources from '../../appResources';
import { pageActions, publisherActions } from '../../constants';
import { getVisitCookie, isLoggedIn, getParameterByName } from '../../helpers';
import { handleActionClick, handleActionMenuClick } from '../../actions/generalActions';

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showExpl: getVisitCookie(),
    };

    this.getPageActions = this.getPageActions.bind(this);
    this.getPublisherActions = this.getPublisherActions.bind(this);
  }

  getPageActions() {
    const { location, handleActionClick } = this.props;
    // Okay so, if the link has anything more than the name of the initial page
    // it will be substringedto its starting page name and used accordingly
    // this is should be used for links like "/document/0/98888"
    // Where the numbers are actual id's
    const path =
      location.pathname.indexOf('/', 1) !== -1
        ? location.pathname.substring(0, location.pathname.indexOf('/', 1))
        : location.pathname;
    const actions = pageActions[path] || [];

    return actions.map((action, i) => {
      const width = i + 1 === actions.length && actions.length % 2 > 0 ? 12 : 6;
      return (
        <Col sm={12} md={width} lg={width} key={i}>
          <div className="action-container" onClick={() => handleActionClick(action.type)}>
            <label>{action.name}</label>
          </div>
        </Col>
      );
    });
  }

  getPublisherActions() {
    const { location, handleActionClick, loadedEvent, userType } = this.props;
    let path =
      location.pathname.indexOf('/', 1) !== -1
        ? location.pathname.substring(0, location.pathname.indexOf('/', 1))
        : location.pathname;
    let urlParams = {};

    if (
      path === '/evenement' &&
      !getParameterByName('zaal') &&
      !loadedEvent.isLoading &&
      loadedEvent.childEventsData.length > 0
    ) {
      path = '/event-with-rooms';
      urlParams = { id: this.props.params.eventId };
    } else if (
      path === '/evenement' &&
      !loadedEvent.isLoading &&
      (!getParameterByName('zaal') || loadedEvent.childEventsData.length === 0)
    ) {
      path = '/parent-event';
      urlParams = { id: this.props.params.eventId };
    } else if (path === '/publieke-dossiers' && this.props.params.id) {
      path = '/public-dossier';
      urlParams = { id: this.props.params.id };
    }

    let actions = publisherActions[path] || publisherActions['/'];
    if (userType === 'admin') {
      actions = [...actions, publisherActions.admin[0]];
    }

    return actions.map((action, i) => {
      const width = i + 1 === publisherActions.length && publisherActions.length % 2 > 0 ? 12 : 6;
      return (
        <Col sm={12} md={width} lg={width} key={i}>
          <div
            className="publisher-action-container"
            onClick={() => handleActionClick(action.type, urlParams)}
          >
            <label>{action.name}</label>
          </div>
        </Col>
      );
    });
  }

  render() {
    const { open, handleActionMenuClick, is_admin } = this.props;
    const actions = this.getPageActions();
    const pActions = this.getPublisherActions();
    const cookiesExpirationDate = new Date();
    cookiesExpirationDate.setFullYear(cookiesExpirationDate.getFullYear() + 1);
    return (
      <div>
        <ActionMenuButton
          menuOpen={this.props.open}
          handleActionMenuClick={this.props.handleActionMenuClick}
        />
        {open &&
          (!getVisitCookie() || isLoggedIn()) && (
            <ReactCSSTransitionGroup
              transitionName="action-menu-transition"
              transitionAppear
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}
            >
              <div className="action-menu-container" onClick={handleActionMenuClick}>
                <div className="action-menu-content">
                  <Grid fluid>
                    <Row>{actions}</Row>
                    {is_admin && <Row style={{ marginTop: 40 }}>{pActions}</Row>}
                  </Grid>
                </div>
              </div>
            </ReactCSSTransitionGroup>
          )}
        {open &&
          getVisitCookie() &&
          this.state.showExpl &&
          !isLoggedIn() && (
            <ReactCSSTransitionGroup
              transitionName="action-menu-transition"
              transitionAppear
              transitionAppearTimeout={500}
              transitionEnter={false}
              transitionLeave={false}
            >
              <div className="action-menu-container" onClick={handleActionMenuClick}>
                <div className="explanation-modal">
                  <h4>Dit + menu geeft extra akties en gepersonaliseerde opties.</h4>
                  <div className="icon-div">
                    <Badge
                      badgeContent={
                        <ContentAdd
                          color="#fff"
                          style={{ background: '#f75002', borderRadius: '50%' }}
                        />
                      }
                      className="cross"
                    >
                      <i className="material-icons">account_circle</i>
                    </Badge>
                  </div>
                  <label>Maak een account aan en:</label>
                  <ul>
                    <li>Bewaar uw favoriete agenda’s en documenten</li>
                    <li>
                      Volg documenten, amendementen, en motie’s in uw persoonlijke folders en voeg
                      notities toe{' '}
                    </li>
                    <li>
                      Volg Agenda's door notificaties in te stellen of toe te voegen aan uw
                      persoonlijke kalender
                    </li>
                  </ul>
                  <div className="btns-div">
                    <Button
                      label="Register"
                      labelColor="#fff"
                      backgroundColor={appResources.in_content_color}
                      onClick={() => {
                        document.cookie = `openedMenu=yes; expires=${cookiesExpirationDate.toUTCString()}`;
                        browserHistory.push('/login');
                      }}
                    />
                    <Button
                      label="Open menu"
                      labelColor="#fff"
                      backgroundColor="#f75002"
                      onClick={() => {
                        document.cookie = `openedMenu=yes; expires=${cookiesExpirationDate.toUTCString()}`;
                        this.setState({ showExpl: false });
                        handleActionMenuClick();
                      }}
                    />
                  </div>
                </div>
              </div>
            </ReactCSSTransitionGroup>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { actionMenu, user, singleEvent } = state;
  return {
    open: actionMenu.open,
    userType: user.type,
    is_admin: user.is_admin,
    loadedEvent: singleEvent,
  };
}

export default withRouter(
  connect(mapStateToProps, {
    handleActionClick,
    handleActionMenuClick,
  })(ActionMenu),
);
