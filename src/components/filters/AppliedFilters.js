import React from 'react';
import { connect } from 'react-redux';
import Badge from 'material-ui/Badge';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FiltersModal from './FiltersModal';
import SortByMenu from '../general/SortByMenu';
import appResources from '../../appResources';

const badgeStyle = {
  backgroundColor: '#F75002',
  color: '#FFFFFF',
  top: -8,
  right: 5,
  width: 20,
  height: 20,
};

class AppliedFilters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
    };
  }

  render() {
    const {
      isLoading,
      resultsCount,
      filters,
      setFilter,
      removeFilter,
      clearFilters,
      setSortBy,
      selectedsortby,
      keepInitialFilters,
    } = this.props;
    return (
      <div className="applied-filters-container">
        <FiltersModal
          chips={filters}
          filters={filters}
          setFilter={setFilter}
          resultsCount={resultsCount}
          keepInitialFilters={keepInitialFilters}
          removeFilter={removeFilter}
          show={this.state.showFilters}
          close={() => this.setState({ showFilters: false })}
        />
        <div className="first-row">
          <Badge badgeContent={filters.length} badgeStyle={badgeStyle} style={{ padding: 0 }}>
            <Glyphicon style={{ color: appResources.in_content_color }} glyph="filter" />
          </Badge>
          <label
            className="filters-label"
            style={{ color: appResources.in_content_color }}
            onClick={() => this.setState({ showFilters: true })}
          >
            Filters
          </label>
          <span
            className="remove-filters-span no-text-select"
            onClick={() => {
              !isLoading && clearFilters();
            }}
          >
            Verwijder filters
          </span>
        </div>
        <div className="second-row">
          <label className="results-count-label">
            <b>{isLoading ? '-' : resultsCount}</b> zoekresultaten{' '}
            <SortByMenu setSortBy={setSortBy} selected={selectedsortby} />
          </label>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { combined } = state;
  return {
    isLoading: combined.isLoading,
  };
}

export default connect(mapStateToProps)(AppliedFilters);
