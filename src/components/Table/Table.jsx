import React from 'react';
import ReactTable from 'react-table';

const Table = ({ data, columns, SubComponent, pageSize }) => {
  return (
    <ReactTable
      data={data}
      sortable={false}
      columns={columns}
      pageSize={pageSize}
      SubComponent={SubComponent}
      noDataText={'geen data gevonden'}
    />
  );
};

export default Table;
