import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AsyncComponent from './components/AsyncComponent/AsyncComponent';

const App = AsyncComponent(() => import('./App'));
const Homepage = AsyncComponent(() => import('./containers/Home/Home'));
// const About = AsyncComponent(() => import('./containers/About/About'));
// const FAQ = AsyncComponent(() => import('./containers/FAQ'));
const Contact = AsyncComponent(() => import('./containers/Contact'));
const TermsConditions = AsyncComponent(() => import('./containers/TermsConditions'));
const OpenSource = AsyncComponent(() => import('./containers/OpenSource'));
const SearchPage = AsyncComponent(() => import('./containers/Search/Search'));
const PublicFolders = AsyncComponent(() => import('./containers/PublicFolders/PublicFolders'));
const MyFolders = AsyncComponent(() => import('./containers/Dashboard/MyFolders/MyFolders'));
const FavoritesPage = AsyncComponent(() => import('./containers/FavoritesPage'));
const MyQueries = AsyncComponent(() => import('./containers/Dashboard/MyQuerries/MyQuerries'));
const FolderContent = AsyncComponent(() => import('./containers/FolderContent'));
const PublicAgenda = AsyncComponent(() => import('./containers/Agenda/PublicAgenda'));
const AgendaDetail = AsyncComponent(() => import('./containers/Agenda/AgendaDetail/AgendaDetail'));
const DocumentDetail = AsyncComponent(() => import('./containers/DocumentDetail/DocumentDetail'));
const Profile = AsyncComponent(() => import('./containers/Profile/Profile'));
const ActivatePage = AsyncComponent(() => import('./containers/Activation/ActivateInfoPage/ActivatePage'));
const Login = AsyncComponent(() => import('./containers/Login/Login'));
const ActivateAccount = AsyncComponent(() => import('./containers/Activation/ActivateAccount/ActivateAccount'));
const PasswordReset = AsyncComponent(() => import('./containers/PasswordReset'));
const NotFound = AsyncComponent(() => import('./containers/NotFound'));
const MyNotifications = AsyncComponent(() => import('./containers/Dashboard/MyNotifications/MyNotifications'));
const MyNotes = AsyncComponent(() => import('./containers/Dashboard/MyNotes/MyNotes'));
const MyAgenda = AsyncComponent(() => import('./containers/Dashboard/MyAgenda/MyAgenda'));
const FolderInvitation = AsyncComponent(() => import('./containers/FolderInvitation'));
const PublicFolder = AsyncComponent(() => import('./containers/PublicFolder/PublicFolder'));
const UserManagement = AsyncComponent(() => import('./containers/UserManagement/UserManagement'));

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