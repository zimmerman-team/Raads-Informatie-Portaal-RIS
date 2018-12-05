import appResources from '../../appResources';

const data = [
  {
    title: 'Home',
    icon: 'home',
    route: '/',
    loginNeeded: false,
  },
  {
    title: 'Zoeken',
    icon: 'search',
    route: '/zoeken',
    loginNeeded: false,
  },
  {
    title: 'Agenda',
    icon: 'calendar',
    route: '/agenda',
    loginNeeded: false,
  },
  {
    title: 'Publieke dossiers',
    icon: 'public_dossiers',
    route: '/publieke-dossiers',
    loginNeeded: false,
  },
  {
    title: 'Over de Raad',
    icon: 'about',
    route: '/over-de-raad',
    loginNeeded: false,
    externalLink: appResources.externalAboutLink,
  },
  {
    title: 'Notificaties',
    icon: 'notifications',
    route: '/notificaties',
    loginNeeded: true,
  },
  {
    title: 'Bewaarde zoekopdrachten',
    icon: 'queries',
    route: '/bewaarde_zoekopdrachten',
    loginNeeded: true,
  },
  {
    title: 'Favorieten',
    icon: 'favorites',
    route: '/favorieten',
    loginNeeded: true,
  },
  {
    title: 'Mijn folders',
    icon: 'folders',
    route: '/folders',
    loginNeeded: true,
  },
  {
    title: 'Mijn Kalender',
    icon: 'my_agenda',
    route: '/mijn_kalender',
    loginNeeded: true,
  },
  {
    title: 'Mijn notities',
    icon: 'my_notes',
    route: '/mijn_notities',
    loginNeeded: true,
  },
  {
    title: 'Profiel aanpassen',
    icon: 'profile',
    route: '/profiel',
    loginNeeded: true,
  },
];

export default data;
