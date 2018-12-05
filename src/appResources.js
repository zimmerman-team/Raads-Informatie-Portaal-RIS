import { normalize } from 'path';
import { style, backendUrl, municipality } from './config';

export default {
  backendUrl,
  municipality,
  documentTitle: `RI Studio ${municipality}`,

  contact: style.contact,

  documentTypes: style.documentTypes,

  aboutContent: style.aboutContent,
  externalAboutLink: style.externalAboutLink,

  doc_list_icon_color: style.doc_list_icon_color,
  event_list_icon_color: style.event_list_icon_color,

  agenda_item_selected_color: style.agenda_item_selected_color,

  basicColor: style.basicColor,
  secondColor: style.secondColor,
  specialTextColor: style.specialTextColor,
  darkGreyTextColor: style.darkGreyTextColor,

  in_content_color: style.in_content_color,
  color_normal: style.color_normal,
  color_darkened: style.color_darkened,
  background_color: style.background_color,

  header: style.header,
  footer: style.footer,
  breadcrumbs: style.breadcrumbs,
  drawer: style.drawer,
  homepage: style.homepage,

  eventColor: '#FFCC80',
  documentColor: '#C5E1A4',
  backgroundColor: '#EEEEEE',
  dashboardBackgroundColor: '#4E4E4E',
  dashboardTextColor: '#D9D9D9',
  dashboardTableRowColor: '#676566',
  badgeActiveColor: '#47B71D',

  received_document: '#F8BBD0',
  council_address: '#D1C4E9',
  written_question: '#81D4FA',
  format: '#97A1D9',
  management_document: '#FFF176',
  policy_document: '#FFB74D',

  timelineEventColor: '#FFE8C6',
  timelineDocumentColor: '#E5F2D6',
  emptyEventColor: '#DBDBDB',

  twitterColor: '#55ACEE',
  facebookColor: '#3B5998',
  googleColor: '#DD4B39',

  itemMenuAnchorOrigin: {
    horizontal: 'left',
    vertical: 'center',
  },
  itemMenuTargetOrigin: {
    horizontal: 'right',
    vertical: 'top',
  },

  fontFamily: 'Roboto, sans-serif',

  headerIconStyle: {
    padding: '14px',
    display: 'inline-block',
    width: '48px',
    height: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    background: style.color_normal,
  },

  loginButStyle: {
    marginTop: '6%',
    marginBottom: '6%',
    width: '100%',
    height: '36px',
    borderRadius: '36px',
    backgroundColor: style.in_content_color,
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    label: {
      width: '39px',
      height: '16px',
      textTransform: 'none',
      fontFamily: 'Roboto, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: '36px',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#ffffff',
    },
  },

  TextFieldHintStyle: {
    marginLeft: '1%',
    color: '#444',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 'normal',
  },

  TextFieldHintStyle2: {
    marginBottom: '2%',
    marginLeft: '1%',
    color: style.basicColor,
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 'normal',
  },

  textFieldStyle: {
    width: '100%',
    marginTop: '4%',
  },

  textFieldInputStyle: {
    marginLeft: '1%',
    width: '98%',
    color: '#444',
  },

  profileFieldInputStyle: {
    width: 'calc(100% - 215px)',
    marginLeft: '215px',
    paddingBottom: '35px',
    color: '#444',
  },

  profileLabelInputStyle: {
    textTransform: normalize,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    paddingTop: '8px',
    width: '100%',
    height: '100%',
    fontSize: '25px',
    marginLeft: '20px',
    color: '#808080',
    lineHeight: '25px',
  },

  profileButtonStyle: {
    width: '200px',
    color: '#fff',
    background: style.color_normal,
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'none',
  },

  deleteButtonStyle: {
    float: 'right',
    width: '156.6px',
    textTransform: 'none',
  },

  normalWhiteLabel: {
    textTransform: 'none',
    color: '#fff',
  },

  normalButtonStyle: {
    float: 'right',
  },

  boldBigLabel: {
    marginLeft: '8px',
    marginRight: '8px',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: '16px',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: '1.44',
    letterSpacing: 'normal',
    textAlign: 'center',
  },

  profileButtonLabelStyle: {
    textAlign: 'center',
    width: '142px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'none',
  },

  checkBoxStyle: {
    marginTop: '6%',
    color: '#444',
    fill: '#444',
    textAlign: 'start',
  },

  notifCheckBoxStyle: {
    marginTop: '2px',
    width: '30px',
    display: 'inline-block',
    marginLeft: '22px',
    textAlign: 'start',
  },

  dashboardTextFieldHintStyle: {
    color: '#BBBBBB',
    fontWeight: 'normal',
  },

  pickerColors: [
    '#627687',
    '#C3CCD3',
    '#F4DEDC',
    '#F5C0A3',
    '#C8BFB9',
    '#DFD7C2',
    '#E7E7E7',
    '#DADADC',
    '#E95D61',
    '#FA8F86',
    '#E1C0A0',
    '#7CA1A0',
    '#9CB999',
    '#B896BD',
    '#AB9799',
    '#B4B3B0',
  ],

  locale: {
    format: 'MM/DD/YYYY',
    separator: ' - ',
    applyLabel: 'Toepassen',
    cancelLabel: 'Annuleren',
    fromLabel: 'Van',
    toLabel: 'Tot',
    customRangeLabel: 'Aangepast Bereik',
    weekLabel: 'W',
    daysOfWeek: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
    monthNames: [
      'januari',
      'februari',
      'maart',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
    ],
    firstDay: 1,
  },
  first_row_icons: [
    {
      glyph: 'search',
      text: 'SLIM & RELEVANT ZOEKEN',
    },
    {
      glyph: 'calendar',
      text: 'AGENDA RAADPLEGEN',
    },
    {
      glyph: 'folder-open',
      text: 'DOSSIERS MAKEN & DELEN',
    },
    {
      glyph: 'send',
      text: 'NOTIFICATIES ONTVANGEN',
    },
  ],
  second_row_icons: [
    {
      glyph: 'heart',
      text: 'FAVORIETEN BEWAREN',
    },
    {
      glyph: 'facetime-video',
      text: 'LIVE UITZENDINGEN VOLGEN',
    },
    {
      glyph: 'file',
      text: 'DOCUMENTEN DELEN',
    },
    {
      glyph: 'comment',
      text: 'INSPRAAK GEVEN',
    },
  ],
  floatLeft: {
    float: 'left',
  },
  sampleUpdates: [
    {
      id: 1,
      title: 'Informele bijeenkomst VSV Verzuim',
      date: '2017-04-18T10:04:00',
      createdAt: '2017-04-18T10:04:00',
      location: 'Stadhuis Almere',
      type: 'event',
    },
    {
      id: 2,
      title: 'Informele bijeenkomst VSV Verzuim',
      date: '2017-04-18T10:04:00',
      createdAt: '2017-04-18T10:04:00',
      location: 'Stadhuis Almere',
      type: 'document',
    },
    {
      id: 3,
      title: 'Informele bijeenkomst VSV Verzuim',
      date: '2017-04-18T10:04:00',
      createdAt: '2017-04-18T10:04:00',
      location: 'Stadhuis Almere',
      type: 'media',
    },
    {
      id: 4,
      title: 'Informele bijeenkomst VSV Verzuim',
      date: '2017-04-18T10:04:00',
      createdAt: '2017-04-18T10:04:00',
      location: 'Stadhuis Almere',
      type: 'event',
    },
    {
      id: 5,
      title: 'Informele bijeenkomst VSV Verzuim',
      date: '2017-04-18T10:04:00',
      createdAt: '2017-04-18T10:04:00',
      location: 'Stadhuis Almere',
      type: 'document',
    },
    {
      id: 6,
      title: 'Informele bijeenkomst VSV Verzuim',
      date: '2017-04-18T10:04:00',
      createdAt: '2017-04-18T10:04:00',
      location: 'Stadhuis Almere',
      type: 'media',
    },
  ],
  sampleDossiers: [
    {
      id: 0,
      title: 'Mijn eerste RIS mapje',
      color: 'red',
      content: [
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
      ],
      created_at: '2017-04-18T00:00:00',
      last_modified: '2017-04-18T00:00:00',
    },
    {
      id: 1,
      title: 'Werk & inkomen',
      content: [
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
      ],
      color: 'blue',
      created_at: '2017-04-18T00:00:00',
      last_modified: '2017-04-18T00:00:00',
    },
    {
      id: 2,
      title: 'Politieke markt voorbereiding donderdag 6 April',
      content: [
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
      ],
      color: 'green',
      created_at: '2017-04-18T00:00:00',
      last_modified: '2017-04-18T00:00:00',
    },
    {
      id: 3,
      title: 'Beleidsthema’s varia',
      content: [
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
      ],
      color: 'blue',
      created_at: '2017-04-18T00:00:00',
      last_modified: '2017-04-18T00:00:00',
    },
    {
      id: 4,
      title: 'Moties van belang',
      content: [
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
      ],
      color: 'orange',
      created_at: '2017-04-18T00:00:00',
      last_modified: '2017-04-18T00:00:00',
    },
    {
      id: 5,
      title: 'Map naam',
      content: [
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
        {
          added_by: 'lol',
          dossier: 1,
          id: 1,
          items: [
            {
              date: '2018-03-29T14:00:00',
              id: 100401,
              item_id: 3358,
              item_type: 'event',
              name: 'Gemeenteraad',
            },
          ],
        },
      ],
      color: 'blue',
      created_at: '2017-04-18T00:00:00',
      last_modified: '2017-04-18T00:00:00',
    },
  ],
  sampleFavorites: [
    {
      uid: 27425,
      id: 5830,
      name: 'Politieke Markt',
      date: 'maart 23, 2011',
      rawDate: '2016-03-23T14:00:00',
      url: 'n/a',
      type: 'event',
    },
    {
      uid: 34944,
      id: 31642,
      name: 'Transitie Sociaal Domein (RG-177) PRESENTATIE',
      date: 'december 28, 2016',
      rawDate: '2016-12-28T09:30:00',
      url: 'https://api.notubiz.nl/document/3380713/1',
      type: 'document',
    },
    {
      uid: 34954,
      id: 31649,
      name: 'Moties en Amendementen Programmabegroting 2014-2017 (RV-71)',
      date: 'december 28, 2016',
      rawDate: '2016-12-28T09:30:00',
      url: 'https://api.notubiz.nl/document/3380914/1',
      type: 'document',
    },
  ],
  sampleQueries: [
    {
      id: 1,
      title: 'Floriade',
      created_at: '2017-07-05T12:25:22.535611',
      search_chips: ['Floriade'],
      document_category: 'Alle',
      end_date: '2017-08-01T10:45:00',
      is_date_selected: false,
      ordering: '',
      search_text: 'Floriade',
      selected_type: 'Sorteer op document of agenda item',
      start_date: '2017-07-03T10:45:00',
    },
    {
      id: 2,
      title: 'Floriade - Budget',
      created_at: '2017-07-05T12:25:22.535611',
      search_chips: ['Floriade', 'Budget'],
      document_category: 'Alle',
      end_date: '2017-08-01T10:45:00',
      is_date_selected: false,
      ordering: '',
      search_text: 'Floriade Budget',
      selected_type: 'Sorteer op document of agenda item',
      start_date: '2017-07-03T10:45:00',
    },
    {
      id: 3,
      title: 'Politieke Markt',
      created_at: '2017-07-05T12:25:22.535611',
      search_chips: ['Politieke Markt'],
      document_category: 'Alle',
      end_date: '2017-08-01T10:45:00',
      is_date_selected: false,
      ordering: '',
      search_text: 'Politieke Markt',
      selected_type: 'Sorteer op document of agenda item',
      start_date: '2017-07-03T10:45:00',
    },
  ],
  samplePublicDossiers: ['Werk & inkomen', 'Parkeren', 'Kinderopvang', 'Afval', 'Mileu', 'Verkeer'],
  sampleVideos: [
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
    {
      title: 'Titel video',
      date: 'Donderdag 09 november 2017',
      location: 'Stadhuis',
      info: '1 maand geleden',
    },
  ],
  timelineGroups: [
    {
      id: 1,
      content: 'Agenda punten',
      order: 10,
    },
    {
      id: 2,
      content: 'Documenten',
      order: 9,
    },
    {
      id: 3,
      content: 'P&C Cyclus',
      order: 8,
    },
    {
      id: 4,
      content: 'Brief aan de raad',
      order: 7,
    },
    {
      id: 5,
      content: 'Schriftelijke vragen',
      order: 6,
    },
    {
      id: 6,
      content: 'Formats',
      order: 5,
    },
    {
      id: 7,
      content: 'Raadsbrieven',
      order: 4,
    },
    {
      id: 8,
      content: 'Presidium besluitenlijsten',
      order: 3,
    },
    {
      id: 9,
      content: 'Motie',
      order: 2,
    },
    {
      id: 10,
      content: 'Toezeggingen',
      order: 1,
    },
  ],
};
