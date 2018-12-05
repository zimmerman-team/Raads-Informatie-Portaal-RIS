import React from 'react';
import ReactTable from 'react-table';
import find from 'lodash/find';
import filter from 'lodash/filter';

const Table = ({ type = 'combined', data, columns, SubComponent, pageSize }) => {
  let cols = columns;
  if (type === 'combined') {
    const hasEvent = find(data, item => {
      return item.options
        ? item.options.type === 'event' || item.options.type === 'child_event'
        : undefined;
    });
    cols =
      hasEvent !== undefined
        ? columns
        : filter(columns, item => {
            return item.accessor !== 'event_date';
          });
  }
  return (
    <ReactTable
      data={data}
      sortable={false}
      columns={cols}
      pageSize={pageSize}
      SubComponent={SubComponent}
      noDataText={'geen data gevonden'}
    />
  );
};

export default Table;
