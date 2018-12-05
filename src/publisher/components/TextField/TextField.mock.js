import shortid from 'shortid';
import filter from 'lodash/filter';
import appResources from '../../../appResources';

const data = {
  eventTemplates: [{ id: 0, name: 'Nieuw evenement' }, { id: 1, name: 'Politieke Markt' }],
  documentTypes: filter(
    appResources.documentTypes.map(dt => {
      return {
        id: shortid.generate(),
        name: dt.label,
        value: dt.obj.value.split('=')[1],
      };
    }),
    d => {
      return d.value !== 'public_dossier' && d.value !== 'event';
    },
  ),
  statuses: [{ id: 0, name: 'Status 0' }, { id: 1, name: 'Status 1' }, { id: 2, name: 'Status 2' }],
  subjects: [
    { id: 0, name: 'Onderwerp 0' },
    { id: 1, name: 'Onderwerp 1' },
    { id: 2, name: 'Onderwerp 2' },
  ],
  portfolios: [
    { id: 0, name: 'Portefeuille 0' },
    { id: 1, name: 'Portefeuille 1' },
    { id: 2, name: 'Portefeuille 2' },
  ],
};
export default data;
