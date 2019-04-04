import appResources from '../appResources';

export const events = {
  data: [],
  isLoading: false,
  date: ''
};

export const combined = {
  resultsCount: 0,
  data: [],
  isLoading: false,
  apiCallCount: 0,
  searchType: 'q'
};

export const sortByState = '-last_modified';

export const filters = [];

export const activePage = 1;

export const activeTab = 'list';

export const snackBar = {
  message: '',
  visibility: false,
  type: 'general',
  action: null
};

export const dossierInitial = {
  itemID: '',
  visibility: false,
  item_type: 'combined'
};

export const addNoteInitial = {
  document: [],
  visibility: false
};

export const userInitial = {
  name: '',
  userID: '',
  username: '',
  prof_pic: `${appResources.backendUrl}media/profile_pictures/default_pic.png`,
  firstname: '',
  surname: '',
  token: '',
  email: '',
  is_admin: false,
  type: 'regular',
  dossiers: [],
  dossierCount: 0,
  favorites: [],
  favoriteCount: 0,
  queries: [],
  queriesCount: 0,
  isLoading: false,
  clearForm: 0,
  notifications: [],
  allUsers: [],
  allUsersCount: 0,
  myAgenda: [],
  notes: [],
  selectedCombinedItem: null
};

export const latestDataInitial = {
  data: [],
  isLoading: false,
  resultsCount: 0
};

export const publicDossierInitial = {
  title: '',
  combined_id: -1,
  created_at: '',
  last_modified: '',
  parent_dossier: '',
  isLoading: false,
  document_count: 0,
  dossier_count: 0,
  published: false,
  documents: [],
  dossiers: []
};

export const singleEventInitial = {
  loading: false,
  eventData: {},
  childEventsData: [],
  speakers: []
};

export const actionMenuInitial = {
  open: false
};

export const queryInitial = {
  visibility: false
};

export const loadingInitial = false;

export const publisherInitial = {
  docData: false,
  addUserModalVisibility: false,
  userToEdit: false,
  publicDossierModalVisibility: false,
  publicDossierSelectedID: null,
  publicDossierSelectedDocuments: [],
  publicDossierSelectedDossiers: [],
  newEventModalVisibility: false,
  newEventSelectedID: null,
  eventDocumentModalVisibility: false,
  eventDocumentModalDocuments: [],
  newAgendaItemModalVisibility: false,
  newAgendaItemSelectedID: null,
  newAgendaItemSelectedDocuments: [],
  newAgendaItemSelectedDossiers: [],
  newAgendaItemSelectedIndex: null,
  selectedEventID: null,
  newDocumentModalVisibility: false
};
