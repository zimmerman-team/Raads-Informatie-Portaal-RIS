import rotterdam from './styles/municipalities/rotterdam';
import almere from './styles/municipalities/almere';
import utrecht from './styles/municipalities/utrecht';
import generalX from './styles/municipalities/generalX';

const muni = 'Almere'; // Almere | Utrecht | Rotterdam

const getMunicipalityStyle = function(municipality) {
  switch (municipality) {
    case 'Almere':
      return almere;
    case 'Utrecht':
      return utrecht;
    case 'Rotterdam':
      return rotterdam;
    default:
      return generalX;
  }
};

const getBackendUrl = function(municipality) {
  switch (municipality) {
    case 'Almere':
      return 'https://ris2-almere.zz-demos.net/api/';
    case 'Utrecht':
      return 'https://ris2-utrecht.zz-demos.net/api/';
    case 'Rotterdam':
      return 'https://ris2-rotterdam.zz-demos.net/api/';
    default:
      return 'http://localhost:8000/api/';
  }
};

export const backendUrl = getBackendUrl(muni);
export const municipality = muni;
export const style = getMunicipalityStyle(muni);
