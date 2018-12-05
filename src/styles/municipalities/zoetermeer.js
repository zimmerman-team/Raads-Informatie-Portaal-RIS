export default {
  basicColor: '#0072B9',
  header: {
    text: '#fff',
    background: '#0072B9',
    titleNavbar: {
      text: '#0072B9',
      background: '#fff',
    },
  },
  footer: {
    text: '#fff',
    background: '#0072B9',
    griffieURL: 'https://www.zoetermeer.nl/gemeenteraad/griffie_43941/',
    municipalityURL: 'https://www.zoetermeer.nl/',
  },
  drawer: {
    linkColor: '#0072B9',
  },
  breadcrumbs: {
    background: 'rgba(0, 114, 185, 0.3)',
  },
  secondColor: '#FFE00F',
  specialTextColor: '#2A5587',
  darkGreyTextColor: '#4D4D4D',
  TextFieldHintStyleColor: '#2A5587',
  contact: {
    address1: 'Coolsingel 40 Rotterdam',
    address2: null,
    address3: null,
    telephone: '(010) 267 34 00',
    email: 'info@griffie.rotterdam.nl',
    twitter: {
      name: '@rotterdam',
      link: 'https://twitter.com/rotterdam',
    },
    facebook: {
      name: 'Rotterdam',
      link: 'https://www.facebook.com/gem.Rotterdam',
    },
    instangram: {
      name: 'gemeenterotterdam',
      link: 'https://www.instagram.com/gemeenterotterdam/',
    },
    youtube: {
      name: 'Gemeente Rotterdam',
      link: 'https://www.youtube.com/user/GemeenteRotterdam',
    },
  },
  documentTypes: [
    { label: 'Events', obj: { key: 0, value: 'item_type=event', label: 'Events' } },
    { label: 'Documenten', obj: { key: 1, value: 'item_type=document', label: 'Documenten' } },
  ],
  aboutContent: {
    dailyBoard: [
      { label: 'Burgermeester', value: 'J.Janssen' },
      { label: 'Griffier', value: 'K. Kleermaker' },
      { label: 'Voorzitter', value: 'R. Roderick' },
      { label: 'Wethouder Finacien', value: 'B. Brouwer' },
      { label: 'Wethouder Planologie', value: 'A. Adriaanse' },
    ],
    raad: [
      { label: 'Raadslid', value: 'J.Janssen', fractie: 'StadsBelangen' },
      { label: 'Voorzitter', value: 'K. Kleermaker', fractie: 'StadsBelangen' },
      { label: 'Wethouder Milieu', value: 'R. Roderick', fractie: 'StadsBelangen' },
      { label: 'Wethouder Finacien', value: 'B. Brouwer', fractie: 'StadsBelangen' },
      { label: 'Wethouder Planologie', value: 'A. Adriaanse', fractie: 'StadsBelangen' },
    ],
    contact: [
      { label: 'Formulier', value: 'Link', link: '#' },
      { label: 'Raadsagenda', value: 'Link', link: '#' },
      { label: 'Chat', value: 'Link', link: '#' },
      { label: 'Klachten', value: 'Link', link: '#' },
      { label: 'Suggesties', value: 'Link', link: '#' },
      {
        label: 'Facebook',
        value: 'Gemeente Utrecht',
        link: 'https://www.facebook.com/GemeenteUtrecht',
      },
      { label: 'Twitter', value: '@GemeenteUtrecht', link: 'https://twitter.com/gemeenteutrecht' },
      {
        label: 'Instagram',
        value: 'gemeenterotterdam',
        link: 'https://www.instagram.com/gemeenterotterdam',
      },
      {
        label: 'YouTube',
        value: 'Gemeente Rotterdam',
        link: 'https://www.youtube.com/user/GemeenteRotterdam',
      },
    ],
  },
};
