import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import Homepage from './containers/Home/Home';
// import About from './containers/About/About';
// import FAQ from './containers/FAQ';
import Contact from './containers/Contact';
import TermsConditions from './containers/TermsConditions';
import OpenSource from './containers/OpenSource';
import SearchPage from './containers/Search/Search';
import PublicFolders from './containers/PublicFolders/PublicFolders';
import MyFolders from './containers/Dashboard/MyFolders/MyFolders';
import FavoritesPage from './containers/FavoritesPage';
import MyQueries from './containers/Dashboard/MyQuerries/MyQuerries';
import FolderContent from './containers/FolderContent';
import PublicAgenda from './containers/Agenda/PublicAgenda';
import AgendaDetail from './containers/Agenda/AgendaDetail/AgendaDetail';
import DocumentDetail from './containers/DocumentDetail/DocumentDetail';
import Profile from './containers/Profile/Profile';
import ActivatePage from './containers/Activation/ActivateInfoPage/ActivatePage';
import Login from './containers/Login/Login';
import ActivateAccount from './containers/Activation/ActivateAccount/ActivateAccount';
import PasswordReset from './containers/PasswordReset';
import NotFound from './containers/NotFound';
import MyNotifications from './containers/Dashboard/MyNotifications/MyNotifications';
import MyNotes from './containers/Dashboard/MyNotes/MyNotes';
import MyAgenda from './containers/Dashboard/MyAgenda/MyAgenda';
import FolderInvitation from './containers/FolderInvitation';
import PublicFolder from './containers/PublicFolder/PublicFolder';
import UserManagement from './containers/UserManagement/UserManagement';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Homepage} />
    <Route path="griffie" component={UserManagement} />
    <Route path="evenement/:eventId" component={AgendaDetail} />
    {/*<Route path="over-de-raad" component={About} />*/}
    <Route path="zoeken" component={SearchPage} />
    <Route path="agenda" component={PublicAgenda} />
    <Route path="document/:type/:docID*" component={DocumentDetail} />
    {/*<Route path="FAQ" component={FAQ} />*/}
    <Route path="contact" component={Contact} />
    <Route path="algemene-voorwaarden" component={TermsConditions} />
    <Route path="open-source-api" component={OpenSource} />
    <Route path="publieke-dossiers" component={PublicFolders} />
    <Route path="publieke-dossiers/:id" component={PublicFolder} />

    <Route path="mijn_kalender" component={MyAgenda} />
    <Route path="mijn_notities" component={MyNotes} />
    <Route path="notificaties" component={MyNotifications} />
    <Route path="bewaarde_zoekopdrachten" component={MyQueries} />
    <Route path="favorieten" component={FavoritesPage} />
    <Route path="folders" component={MyFolders} />
    <Route path="folder/:id" component={FolderContent} />
    <Route path="publieke-dossiers/:id" component={FolderContent} />
    <Route path="profiel" component={Profile} />
    <Route path="folder-delen/:id" component={FolderInvitation} />

    <Route path="activeer" component={ActivatePage} />
    <Route path="activeer-account/:code" component={ActivateAccount} />
    <Route path="login" component={Login} />
    <Route path="wachtwoord-reset/bevestigen" component={PasswordReset} />
    <Route path="*" component={NotFound} />
  </Route>
);
