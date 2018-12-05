export default {
  basicColor: '#018FB3',
  header: {
    text: '#fff',
    background: '#038fb3',
    titleNavbar: {
      text: '#fff',
      background: '#F75001',
    },
  },
  footer: {
    text: '#fff',
    background: '#038fb3',
    griffieURL: 'https://gemeenteraad.almere.nl/de-gemeenteraad/de-raadsgriffie/',
    municipalityURL: 'https://gemeenteraad.almere.nl/',
  },
  agenda_item_selected_color: 'rgba(1, 143, 179, 0.65)',
  in_content_color: '#3a9ab2',
  color_normal: '#3a9ab2',
  color_darkened: '#0a6f89',
  background_color: '#115566',
  doc_list_icon_color: '#9EBAC2',
  event_list_icon_color: '#558794',
  drawer: {
    linkColor: '#0C74D5',
  },
  homepage: {
    header1: 'Wat doet de raad in Gemeente Almere?',
    text1:
      'Als raadslid of als inwoner van Gemeente Almere kunt u ons nu nog beter volgen via dit raadsinformatie portaal. Blijf op de hoogte van uw stad en de besluiten die door de raad worden genomen, Raadsinformatie Portaal Gemeente Almere staat voor openheid en transparantie. Raadsdocumenten zijn nu via onze zoekmachine voor iedereen vindbaar en inzichtelijk. Momenteel kijkt u naar betáversie 2.0 van dit raadsinformatie portaal',
    picture: require('../../images/almere_landscape.jpg'),
  },
  breadcrumbs: {
    background: 'rgba(1, 143, 179, 0.3)',
  },
  secondColor: '#F75001',
  specialTextColor: '#0C74D5',
  darkGreyTextColor: '#4D4D4D',
  TextFieldHintStyleColor: '#018FB3',
  contact: {
    address1: 'Raadsgriffie Almere',
    address2: 'Postbus 200',
    address3: '1300 AE Almere',
    telephone: '(036) - 539 99 95',
    email: 'raadsgriffie@almere.nl',
    twitter: {
      name: '@RaadvanAlmere',
      link: 'https://twitter.com/raadvanalmere',
    },
    facebook: {
      name: 'RaadvanAlmere',
      link: 'https://www.facebook.com/RaadvanAlmere',
    },
    instangram: null,
    youtube: {
      name: ' RaadvanAlmere',
      link: 'https://www.youtube.com/user/raadvanalmere',
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
      { label: 'Facebook', value: 'RaadvanAlmere', link: 'https://www.facebook.com/RaadvanAlmere' },
      { label: 'Twitter', value: '@RaadvanAlmere', link: 'https://twitter.com/raadvanalmere' },
      {
        label: 'YouTube',
        value: 'RaadvanAlmere',
        link: 'https://www.youtube.com/user/raadvanalmere',
      },
    ],
  },
};
