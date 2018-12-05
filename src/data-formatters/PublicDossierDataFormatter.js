import appResources from '../appResources';
import { getFormattedType, getItemDetailUrl } from '../helpers';
import moment from 'moment';

export function formatPublicDossiers(data) {
  return data.map(item => {
    return {
      id: item.id,
      title: item.title,
      published: item.published,
      color: appResources.doc_list_icon_color,
      created_at: item.created_at,
      last_modified: item.last_modified,
      options: {
        origin_id: item.id,
        combined_id: item.combined_id,
        type: 'public_dossier',
      },
    };
  });
}

export function formatPublicDossierDocs(data) {
  return data.map(item => {
    return {
      content_id: item.item_id,
      id: item.item_id,
      combined_id: item.id,
      status_changes: 'Afdoeningsvoorstel ontvangen',
      portfolio: 'To be implemented',
      theme: 'To be implemented',
      title: {
        title: item.name,
        description: '',
        link: getItemDetailUrl(item.item_type, item.item_id),
      },
      status_updated: 'Afdoeningsvoorstel ontvangen',
      created_at: moment(item.date).format('DD-MM-YYYY'),
      last_modified: moment(item.last_modified).format('DD-MM-YYYY'),
      open_status: 'Nee',
      document_status: 'Geamendeert',
      options: {
        origin_id: item.item_id,
        combined_id: item.id,
        type: item.item_type,
      },
      type: item.item_type,
      formatted_type: getFormattedType(item.item_type),
      download_url: item.url,
      url: getItemDetailUrl(item.item_type, item.item_id),
    };
  });
}

export function formatPublicDossierDossiers(data) {
  return data.map(item => {
    return {
      content_id: item.item_id,
      id: item.item_id,
      combined_id: item.id,
      status_changes: 'Afdoeningsvoorstel ontvangen',
      portfolio: 'To be implemented',
      theme: 'To be implemented',
      title: {
        title: item.name,
        description: '',
        link: getItemDetailUrl('public_dossier', item.item_id),
      },
      published: item.published,
      status_updated: 'Afdoeningsvoorstel ontvangen',
      created_at: moment(item.date).format('DD-MM-YYYY'),
      last_modified: moment(item.last_modified).format('DD-MM-YYYY'),
      open_status: 'Nee',
      document_status: 'Geamendeert',
      options: {
        origin_id: item.item_id,
        combined_id: item.id,
        type: 'Publieke dossier',
      },
      type: 'public_dossier',
      formatted_type: getFormattedType('public_dossier'),
      url: getItemDetailUrl('public_dossier', item.item_id),
    };
  });
}
