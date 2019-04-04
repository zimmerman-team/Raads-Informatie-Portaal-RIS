import appResources from '../../appResources';

const data = [
  {
    title: 'Open menu',
    icon: 'menu-hamburger',
    route: '/close',
    bottomBorder: false,
    controller: true,
    highlight: true
  },
  {
    title: 'Raadszoekmachine',
    icon: 'home',
    route: '/',
    bottomBorder: false,
    controller: false,
    highlight: true
  },
  {
    title: 'Zoeken',
    icon: 'search',
    route: '/zoeken',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Agenda',
    icon: 'calendar',
    route: '/agenda',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Publieke dossiers',
    icon: 'public_dossiers',
    route: '/publieke-dossiers',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Over de Raad',
    icon: 'about',
    route: '/over-de-raad',
    bottomBorder: true,
    controller: false,
    externalLink: appResources.externalAboutLink
  },
  {
    title: 'Notificaties',
    icon: 'notifications',
    route: '/notificaties',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Bewaarde zoekopdrachten',
    icon: 'queries',
    route: '/bewaarde_zoekopdrachten',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Favorieten',
    icon: 'favorites',
    route: '/favorieten',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Mijn folders',
    icon: 'folders',
    route: '/folders',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Mijn notities',
    icon: 'my_notes',
    route: '/mijn_notities',
    bottomBorder: false,
    controller: false
  },
  {
    title: 'Profiel aanpassen',
    icon: 'profile',
    route: '/profiel',
    bottomBorder: true,
    controller: false
  }
];

export default data;
