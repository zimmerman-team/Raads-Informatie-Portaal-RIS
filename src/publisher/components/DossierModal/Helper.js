import axios from 'axios';
import appResources from '../../../appResources';

export function getPublicDossier(id, that) {
  axios
    .get(`${appResources.backendUrl}public-dossiers/${id}/`, {
      headers: { Authorization: `Token ${that.props.token}` },
    })
    .then(response => {
      that.setState({
        editMode: true,
        titleExists: false,
        title: response.data.title,
        loadingExistingDossier: false,
        published: response.data.published,
        selectedPublicDossierTitle: response.data.title,
        selectedPublicDossierDocuments: response.data.documents,
        selectedPublicDossierDossiers: response.data.dossiers,
      });
    })
    .catch(e => {});
}
