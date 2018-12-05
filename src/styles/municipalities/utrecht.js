export default {
  basicColor: '#333333',
  header: {
    text: '#fff',
    background: '#333333',
    titleNavbar: {
      text: '#fff',
      background: '#CC0000',
    },
  },
  footer: {
    text: '#fff',
    background: '#333333',
    griffieURL: 'https://www.utrecht.nl/gemeenteraad/',
    municipalityURL: 'https://www.utrecht.nl/gemeenteraad/',
  },
  agenda_item_selected_color: 'rgba(51, 51, 51, 0.65)',
  in_content_color: '#cc0200',
  color_normal: '#716f6f',
  color_darkened: '#cc0200',
  background_color: '#444444',
  doc_list_icon_color: '#716F6F',
  event_list_icon_color: '#CC0200',
  drawer: {
    linkColor: '#333333',
  },
  homepage: {
    header1: 'Wat doet de raad in Gemeente Utrecht',
    text1:
      'Als raadslid of als inwoner van Gemeente Utrecht kunt u ons nu nog beter volgen via dit raadsinformatie portaal. Blijf op de hoogte van uw stad en de besluiten die door de raad worden genomen, Raadsinformatie Portaal Gemeente Utrecht staat voor openheid en transparantie. Raadsdocumenten zijn nu via onze zoekmachine voor iedereen vindbaar en inzichtelijk. Momenteel kijkt u naar betáversie 2.0 van dit raadsinformatie portaal',
    picture: require('../../images/almere_landscape.jpg'),
  },
  breadcrumbs: {
    background: 'rgba(42, 85, 135, 0.3)',
  },
  secondColor: '#2A5587',
  specialTextColor: '#2A5587',
  darkGreyTextColor: '#4D4D4D',
  TextFieldHintStyleColor: '#2A5587',
  contact: {
    address1: 'Stadhuis, Korte Minrebroederstraat 2',
    address2: 'Postbus 16200',
    address3: '3500 CE Utrecht',
    telephone: '030 - 286 10 69',
    email: 'griffie.gemeenteraad@utrecht.nl',
    twitter: {
      name: '@GemeenteUtrecht',
      link: 'https://twitter.com/gemeenteutrecht',
    },
    facebook: {
      name: 'Utrecht',
      link: 'https://www.facebook.com/GemeenteUtrecht',
    },
    instangram: null,
    youtube: null,
  },
  documentTypes: [
    { label: 'Agenda punten', obj: { key: 0, value: 'item_type=event', label: 'Agenda punten' } },
    { label: 'Documenten', obj: { key: 1, value: 'item_type=document', label: 'Documenten' } },
  ],
  externalAboutLink: 'https://www.utrecht.nl/bestuur-en-organisatie/gemeenteraad/',
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
    ],
  },
};
