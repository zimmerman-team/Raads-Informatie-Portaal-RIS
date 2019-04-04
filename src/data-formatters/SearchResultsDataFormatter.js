import moment from 'moment';
import vis from 'vis';
import get from 'lodash/get';
import appResources from '../appResources';
import {
  getHorizontalTimelineItemStyle,
  getTimelineGroup,
  getItemDetailUrl,
  getFormattedType
} from '../helpers';

export function formatSearchResults(response) {
  const data = [];
  for (let i = 0; i < response.data.results.length; i++) {
    const item = response.data.results[i];
    data.push({
      title: {
        title: item.name,
        description: get(item, 'doc_content.content', ''),
        link: getItemDetailUrl(item.item_type, item.item_id),
        has_content: item.has_content
      },
      status_updated: 'Afdoeningsvoorstel ontvangen',
      published: item.published,

      event_date: item.date !== null ? moment(item.date).format('DD-MM-YYYY') : '',

      open: {
        text: 'Gesloten',
        icon: {
          text: 'assignment_turned_in',
          color: '#444'
        }
      },
      status: {
        text: 'Besloten',
        icon: {
          text: 'clear',
          color: '#ff0000'
        }
      },
      url: item.url,
      type: getFormattedType(item.item_type),
      options: {
        origin_id: item.item_id,
        combined_id: item.id,
        type: item.item_type
      },
      docData: {
        title: item.name,
        id: item.item_id,
        author: item.author,
        statusName: item.status,
        subject: item.subject,
        portfolio: item.portfolio,
        publicDossier: item.public_dossier,
        type: item.item_type,
        published: item.published,
        prettyType: getFormattedType(item.item_type)
      }
    });
  }
  return data;
}

export function formatFoldersResults(response) {
  const data = [];
  for (let i = 0; i < response.data.results.length; i++) {
    const item = response.data.results[i];
    data.push({
      id: item.id,
      owner: item.owner,
      content: formatFileResults(item.content),
      status_changes: 'Afdoeningsvoorstel ontvangen',
      portfolio: 'Portefeuille Naam',
      theme: 'Thema Naam',
      title: {
        title: item.title,
        description: '',
        link: `/folder/${item.id}`
      },
      status_updated: 'Afdoeningsvoorstel ontvangen',
      created_at: moment(item.created_at).format('DD-MM-YYYY'),
      last_modified: moment(item.last_modified).format('DD-MM-YYYY'),
      open: {
        text: 'Gesloten',
        icon: {
          text: 'assignment_turned_in',
          color: '#444'
        }
      },
      status: {
        text: 'Besloten',
        icon: {
          text: 'clear',
          color: '#ff0000'
        }
      },
      options: {
        origin_id: item.id,
        combined_id: item.id,
        type: 'Toezegging'
      },
      type: 'Toezegging'
    });
  }
  return data;
}

export function formatFileResults(content) {
  const data = [];
  if (content) {
    for (let i = 0; i < content.length; i++) {
      const item = content[i].content;
      if (item.type && item.type === 'Geupload document') {
        const url =
          item.url.indexOf('http') !== -1 ? `${item.url}` : `${appResources.backendUrl}${item.url}`;
        data.push({
          id: item.id,
          status_changes: 'Afdoeningsvoorstel ontvangen',
          portfolio: 'To be implemented',
          theme: 'To be implemented',
          title: {
            title: item.name,
            description: '',
            link: url
          },
          status_updated: 'Afdoeningsvoorstel ontvangen',

          created_at: moment(item.date.substring(0, item.date.indexOf('T'))).format('DD-MM-YYYY'),

          last_modified: moment(
            item.last_modified.substring(0, item.last_modified.indexOf('T'))
          ).format('DD-MM-YYYY'),
          open_status: 'Nee',
          document_status: 'Geamendeert',
          options: {
            origin_id: item.id,
            combined_id: item.id,
            type: item.type
          },
          type: item.type,
          formatted_type: item.type,
          url
        });
      } else if (item.item_type) {
        data.push({
          content_id: item.content_id,
          id: item.item_id,
          status_changes: 'Afdoeningsvoorstel ontvangen',
          portfolio: 'To be implemented',
          theme: 'To be implemented',
          title: {
            title: item.name,
            description: '',
            link: getItemDetailUrl(item.item_type, item.item_id, item.parent_id)
          },
          status_updated: 'Afdoeningsvoorstel ontvangen',

          event_date:
            item.item_type === 'event' || item.item_type === 'child_event'
              ? moment(item.date.substring(0, item.date.indexOf('T'))).format('DD-MM-YYYY')
              : '',

          last_modified: moment(
            item.last_modified.substring(0, item.last_modified.indexOf('T'))
          ).format('DD-MM-YYYY'),
          open_status: 'Nee',
          document_status: 'Geamendeert',
          options: {
            origin_id: item.item_id,
            combined_id: item.id,
            type: item.item_type
          },
          type: item.item_type,
          formatted_type: getFormattedType(item.item_type),
          url: item.url
        });
      } else if (item.doc_title) {
        data.push({
          id: item.id,
          status_changes: 'Afdoeningsvoorstel ontvangen',
          portfolio: 'To be implemented',
          theme: 'To be implemented',
          description: item.description,
          title: {
            title: item.title,
            description: item.description,
            link: '#'
          },
          status_updated: 'Afdoeningsvoorstel ontvangen',

          event_date:
            item.item_type === 'event' || item.item_type === 'child_event'
              ? moment(item.date.substring(0, item.date.indexOf('T'))).format('DD-MM-YYYY')
              : '',

          last_modified: moment(
            item.last_modified.substring(0, item.last_modified.indexOf('T'))
          ).format('DD-MM-YYYY'),

          doc_id: item.document_id,
          open_status: 'Nee',
          document_status: 'Geamendeert',
          options: {
            origin_id: item.id,
            combined_id: null,
            type: 'note'
          },
          type: item.type,
          formatted_type: 'Notitie',
          url: '#'
        });
      }
    }
  }
  return data;
}

export function formatTimelineData(results) {
  const formattedData = [];
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    formattedData.push({
      id: item.id,
      content:
        item.name !== null
          ? item.name.length > 50
            ? `${item.name.substring(0, 35)}...`
            : item.name
          : '',
      title: item.name !== null ? (item.name.length > 50 ? item.name : '') : '',
      start: item.date ? moment(item.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      style:
        item.has_content !== false
          ? getHorizontalTimelineItemStyle(item.type)
          : `pointer-events: none;background-color: ${appResources.emptyEventColor};border-color: ${
              appResources.emptyEventColor
            };cursor: pointer;color: ${appResources.darkGreyTextColor};`,
      group: getTimelineGroup(item.type)
    });
  }
  return new vis.DataSet(formattedData);
}

export function getTimelineDates(results) {
  if (results.length > 0) {
    return [
      results[0].date !== null
        ? moment(results[0].date).format('YYYY-MM-DD')
        : moment(results[1].date).format('YYYY-MM-DD'),
      results[results.length - 1].date !== null
        ? moment(results[results.length - 1].date).format('YYYY-MM-DD')
        : moment(results[results.length - 2].date).format('YYYY-MM-DD')
    ];
  }
  return [moment(), moment()];
}
