export default {
  basicColor: '#0c74d5',
  header: {
    text: '#fff',
    background: '#0c74d5',
    titleNavbar: {
      text: '#fff',
      background: '#F75001',
    },
  },
  footer: {
    text: '#fff',
    background: '#0c74d5',
    griffieURL: 'https://www.rotterdam.nl/gemeenteraad/griffie/',
    municipalityURL: 'https://www.rotterdam.nl/gemeenteraad/',
  },
  drawer: {
    linkColor: '#0C74D5',
  },
  agenda_item_selected_color: 'rgba(12, 116, 213, 0.65)',
  in_content_color: '#4486c4',
  color_normal: '#4486c4',
  color_darkened: '#315e88',
  background_color: '#13426f',
  doc_list_icon_color: '#8ABBE8',
  event_list_icon_color: '#4496EE',
  breadcrumbs: {
    background: 'rgba(1, 143, 179, 0.3)',
  },
  homepage: {
    header1: 'Wat doet de raad in Gemeente X?',
    text1:
      'Als raadslid of als inwoner van Gemeente X kunt u ons nu nog beter volgen via dit raadsinformatie portaal. Blijf op de hoogte van uw stad en de besluiten die door de raad worden genomen, Raadsinformatie Portaal Gemeente X staat voor openheid en transparantie. Raadsdocumenten zijn nu via onze zoekmachine voor iedereen vindbaar en inzichtelijk. Momenteel kijkt u naar betáversie 2.0 van dit raadsinformatie portaal',
    picture: require('../../images/almere_landscape.jpg'),
  },
  secondColor: '#F75001',
  specialTextColor: '#0C74D5',
  darkGreyTextColor: '#4D4D4D',
  TextFieldHintStyleColor: 'rgba(255, 255, 255, 0.6)',
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
    { label: 'Agenda punten', obj: { key: 0, value: 'item_type=event', label: 'Agenda punten' } },
    { label: 'Documenten', obj: { key: 1, value: 'item_type=document', label: 'Documenten' } },
    {
      label: 'Publieke dossiers',
      obj: { key: 7, value: 'item_type=public_dossier', label: 'Publieke dossiers' },
    },
    {
      label: 'P&C Cyclus',
      obj: { key: 2, value: 'item_type=received_document', label: 'P&C Cyclus' },
    },
    {
      label: 'Brief aan de raad',
      obj: { key: 3, value: 'item_type=council_address', label: 'Brief aan de raad' },
    },
    {
      label: 'Schriftelijke vragen',
      obj: { key: 4, value: 'item_type=written_question', label: 'Schriftelijke vragen' },
    },
    { label: 'Formats', obj: { key: 5, value: 'item_type=format', label: 'Formats' } },
    {
      label: 'Raadsbrieven',
      obj: { key: 6, value: 'item_type=management_document', label: 'Raadsbrieven' },
    },
    {
      label: 'Presidium besluitenlijsten',
      obj: { key: 7, value: 'item_type=policy_document', label: 'Presidium besluitenlijsten' },
    },
  ],
  externalAboutLink: 'https://gemeenteraad.almere.nl/',
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
      { label: 'Facebook', value: 'Rotterdam', link: 'https://www.facebook.com/gem.Rotterdam' },
      { label: 'Twitter', value: '@rotterdam', link: 'https://twitter.com/rotterdam' },
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
