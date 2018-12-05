import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { getNLItemName, getGBItemName, getNLFormattedItemName } from '../../constants';
import { activePage, sortByState } from '../../reducers/initialState';

export function removeAddFilters(that) {
  const url = that.props.location.search;
  const params = getAllUrlParams(url);
  const sort_by = get(params, 'sorteer', null);
  const item_types = get(params, 'item_type', null);
  const zoekterms = get(params, 'zoekterm', null);
  const page = get(params, 'pagina', null);
  const start_date = get(params, 'start_date', null);
  const end_date = get(params, 'end_date', null);

  if (that.props.sortBy !== sort_by) {
    that.props.setSortBy(sort_by ? sort_by : sortByState, false);
  }

  if (that.props.page !== page) {
    that.props.setActivePage(page ? parseInt(page, 10) : activePage, false);
  }

  const itemTypeFilters = filter(that.props.filters, f => {
    return f.type === 'item_type';
  });
  if (item_types) {
    const items = item_types.split(',');
    for (let i = 0; i < itemTypeFilters.length; i++) {
      const filter = itemTypeFilters[i];
      if (
        !find(items, f => {
          return getGBItemName(f) === filter.value.split('=')[1];
        })
      ) {
        that.props.removeFilter(filter.type, filter.id, false);
      }
    }
    for (let i = 0; i < items.length; i++) {
      if (
        !find(itemTypeFilters, f => {
          return f.type === 'item_type' && f.value === `item_type=${getGBItemName(items[i])}`;
        })
      ) {
        that.props.addFilter(
          'item_type',
          `item_type=${getGBItemName(items[i])}`,
          `Type: ${getNLFormattedItemName(items[i])}`,
          false,
        );
      }
    }
  } else {
    for (let i = 0; i < itemTypeFilters.length; i++) {
      that.props.removeFilter(itemTypeFilters[i].type, itemTypeFilters[i].id, false);
    }
  }

  const searchFilters = filter(that.props.filters, f => {
    return f.type === 'search';
  });
  if (zoekterms) {
    const items = zoekterms.split(',');

    for (let i = 0; i < searchFilters.length; i++) {
      const filter = searchFilters[i];
      if (
        !find(items, f => {
          return f === filter.value;
        })
      ) {
        that.props.removeFilter(filter.type, filter.id, false);
      }
    }
    for (let i = 0; i < items.length; i++) {
      if (
        !find(searchFilters, f => {
          return f.type === 'search' && f.value === items[i];
        })
      )
        that.props.addFilter(
          'search',
          items[i],
          `Zoekterm: ${decodeURIComponent(items[i])}`,
          false,
        );
    }
  } else {
    for (let i = 0; i < searchFilters.length; i++) {
      that.props.removeFilter(searchFilters[i].type, searchFilters[i].id, false);
    }
  }

  const dateFilter = filter(that.props.filters, f => {
    return f.type === 'date';
  });
  if (start_date && end_date) {
    that.props.addFilter(
      'date',
      `start_date=${start_date}&end_date=${end_date}`,
      `${start_date} - ${end_date}`,
      false,
    );
  } else {
    for (let i = 0; i < dateFilter.length; i++) {
      that.props.removeFilter(dateFilter[i].type, dateFilter[i].id, false);
    }
  }

  that.props.loadCombined();
}

export function setURLfilters(filters, sortBy, page) {
  let url = `/zoeken/?sorteer=${sortBy}&pagina=${page}`;

  const filterGroups = [{ key: 'zoekterm', values: [] }, { key: 'item_type', values: [] }];

  for (let x = 0; x < filters.length; x++) {
    const filter = filters[x];
    if (filter.type === 'search') {
      filterGroups[0].values.push(filter.value);
    } else if (filter.type === 'item_type') {
      filterGroups[1].values.push(getNLItemName(filter.value.split('=')[1]));
    }
  }

  if (filterGroups[0].values.length > 0)
    url = `${url}&${filterGroups[0].key}=${filterGroups[0].values.join()}`;

  if (filterGroups[1].values.length > 0)
    url = `${url}&${filterGroups[1].key}=${filterGroups[1].values.join()}`;

  const updFilters = filter(filters, f => {
    return f.type !== 'search' && f.type !== 'item_type';
  });

  for (let i = 0; i < updFilters.length; i++) {
    let filter = '';
    if (updFilters[i].type === 'date') {
      filter = updFilters[i].value;
    }
    url = `${url}&${filter}`;
  }
  return url;
}

export function getURLfilters(that) {
  const url = that.props.location.search;
  const params = getAllUrlParams(url);
  const sort_by = get(params, 'sorteer', null);
  const item_types = get(params, 'item_type', null);
  const zoekterms = get(params, 'zoekterm', null);
  const page = get(params, 'pagina', null);
  const start_date = get(params, 'start_date', null);
  const end_date = get(params, 'end_date', null);
  if (sort_by) {
    that.props.setSortBy(sort_by, false);
  }

  if (page) {
    that.props.setActivePage(parseInt(page, 10), false);
  }

  if (item_types) {
    const items = item_types.split(',');
    for (let i = 0; i < items.length; i++) {
      if (
        !find(that.props.filters, f => {
          return f.type === 'item_type' && f.value === `item_type=${getGBItemName(items[i])}`;
        })
      )
        that.props.addFilter(
          'item_type',
          `item_type=${getGBItemName(items[i])}`,
          `Type: ${getNLFormattedItemName(items[i])}`,
          false,
        );
    }
  }

  if (zoekterms) {
    const items = zoekterms.split(',');
    for (let i = 0; i < items.length; i++) {
      if (
        !find(that.props.filters, f => {
          return f.type === 'search' && f.value === items[i];
        })
      )
        that.props.addFilter(
          'search',
          items[i],
          `Zoekterm: ${decodeURIComponent(items[i])}`,
          false,
        );
    }
  }

  if (start_date && end_date) {
    that.props.addFilter(
      'date',
      `start_date=${start_date}&end_date=${end_date}`,
      `${start_date} - ${end_date}`,
      false,
    );
  }

  that.props.loadCombined();
}

function getAllUrlParams(url) {
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  const obj = {};

  if (queryString) {
    queryString = queryString.split('#')[0];
    const arr = queryString.split('&');

    for (let i = 0; i < arr.length; i++) {
      const a = arr[i].split('=');

      let paramNum;
      let paramName = a[0].replace(/\[\d*\]/, v => {
        paramNum = v.slice(1, -1);
        return '';
      });

      const paramValue = typeof a[1] === 'undefined' ? true : a[1];

      paramName = paramName.toLowerCase();

      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(paramValue);
        } else {
          obj[paramName][paramNum] = paramValue;
        }
      } else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}
