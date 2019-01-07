import axios from 'axios';
import filter from 'lodash/filter';
import mock from './TextField.mock';
import appResources from '../../../appResources';

export function getSuggestions(type, page = 1, keyword = '', that) {
  const url = getURL(type, page, keyword, that);
  if (url !== '') {
    axios
      .get(
        `${appResources.backendUrl}${url}`,
        that.props.token !== '' ? { headers: { Authorization: `Token ${that.props.token}` } } : {},
      )
      .then(response => {
        that.setState({
          loading: false,
          itemsTotal: response.data.count,
          suggestions: that.state.suggestions.concat(formatData(type, response.data.results)),
        });
      })
      .catch(e => {
        that.setState({ loading: false });
      });
  } else {
    if (type === 'event_template') {
      const suggestions =
        appResources.municipality === 'Rotterdam' || appResources.municipality === 'Utrecht'
          ? mock.eventTemplates.slice(0, 1)
          : mock.eventTemplates;
      that.setState({
        loading: false,
        suggestions,
        itemsTotal: suggestions.length,
      });
    }
    if (type === 'doc_type') {
      that.setState({
        loading: false,
        suggestions: mock.documentTypes,
        itemsTotal: mock.documentTypes.length,
      });
    }
    if (type === 'status') {
      const items = filter(mock.statuses, status => {
        return status.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      that.setState({
        loading: false,
        suggestions: items,
        itemsTotal: items.length,
      });
    }
    if (type === 'subject') {
      const items = filter(mock.subjects, subject => {
        return subject.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      that.setState({
        loading: false,
        suggestions: items,
        itemsTotal: items.length,
      });
    }
    if (type === 'portfolio') {
      const items = filter(mock.portfolios, portfolio => {
        return portfolio.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      that.setState({
        loading: false,
        suggestions: items,
        itemsTotal: items.length,
      });
    }
    that.setState({ loading: false });
  }
}

function formatData(type, data) {
  switch (type) {
    case 'document':
      return data.map(d => {
        return {
          id: d.id,
          name: d.name,
          date: d.last_modified,
          type: d.item_type,
          item_id: d.item_id,
        };
      });
    case 'public_dossier':
      return data.map(d => {
        return {
          id: d.combined_id,
          name: d.title,
          date: d.last_modified,
          type: 'public_dossier',
          item_id: d.id,
          has_dossiers: d.has_dossiers,
          child_dossiers_count: d.child_dossiers_count,
        };
      });
    case 'event':
      return data.map(d => {
        return {
          id: d.id,
          name: d.name,
          date: d.last_modified,
          type: d.item_type,
          item_id: d.item_id,
        };
      });
    case 'author':
      return data.map(d => {
        return {
          id: d.id,
          name: `${d.first_name} ${d.last_name}`,
          type: d.type,
          email: d.email,
        };
      });
    case 'agenda_item':
      return data.map(d => {
        return {
          id: d.id,
          name: d.notes,
        };
      });
    default:
      return [];
  }
}

function getURL(type, page, keyword, that) {
  switch (type) {
    case 'document':
      return `combined/?format=json&item_type=document,received_document,council_address,written_question,format,policy_document,management_document,motion,commitment&ordering=-last_modified&page=${page}&page_size=50&q=${keyword}`;
    case 'public_dossier':
      return `public-dossiers/?page=${page}&page_size=50&ordering=-last_modified&search=${keyword}`;
    case 'event':
      return `combined/?format=json&item_type=event&ordering=-last_modified&page=${page}&page_size=50&q=${keyword}`;
    case 'author':
      return `accounts/users/?type=admin,auteur&search=${keyword}`;
    case 'agenda_item':
      return `agenda_items/?basic=true&search=${keyword}`;
    default:
      return '';
  }
}

export function getDossierChildren(userToken, that, node, toggled) {
  const { cursor } = that.state;
  axios
    .post(
      `${appResources.backendUrl}public-dossiers/child_dossiers/`,
      { id: that.props.modalType === 'dossier' ? node.id : node.item_id },
      { headers: { Authorization: `Token ${userToken}` } },
    )
    .then(response => {
      const children = filter(response.data, d => {
        return d.id !== parseInt(that.props.selectedPublicDossierID, 10);
      }).map(r => {
        return {
          name: r.name,
          id: that.props.modalType === 'dossier' ? r.id : r.combined_id,
          item_id: that.props.modalType === 'dossier' ? r.combined_id : r.id,
          has_dossiers: r.has_dossiers,
        };
      });
      node.children = children;
      if (cursor && node.has_dossiers) {
        node.active = true;
        cursor.active = false;
        node.toggled = false;
      }
      if (node.has_dossiers) {
        node.toggled = toggled;
        that.setState({ cursor: node });
      } else {
        that.setState({ cursor: { ...node, toggled: false } });
      }
    })
    .catch(e => {});
}
