import moment from 'moment';

const data = {
  createTitle: 'Nieuw agendapunt toevoegen',
  editTitle: 'Bewerk agendapunt',
  initialState: {
    editMode: false,
    selectedGriffier: null,
    selectedMedewerker: null,
    title: '',
    description: '',
    event: {},
    nextAgendaID: '-',
    timeError: false,
    timeErrorText: '',
    selectedAgendaItem: null,
    toEditAgendaItem: null,
    toEditAgendaItemItems: null,
    loadingExistingAgendaItem: false,
    showStartTime: false,
    showEndTime: false,
    startTime: `${moment().format('HH')}:${moment().format('mm')}`,
    endTime: `${moment().format('HH')}:${moment()
      .add(1, 'minutes')
      .format('mm')}`,
    isLoading: false,
    clearTimes: false,
    order: null,
  },
};
export default data;
