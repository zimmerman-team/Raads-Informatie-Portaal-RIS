import React from 'react';
import Badge from 'material-ui/Badge';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import classNames from 'classnames';
import FiltersModal from './FiltersModal';
import SortByMenu from '../general/SortByMenu';
import appResources from '../../appResources';
import { connect } from 'react-redux';

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
      activeTab,
      isLoading,
      setActiveTab,
      resultsCount,
      filters,
      setFilter,
      removeFilter,
      clearFilters,
      setSortBy,
      selectedsortby,
      keepInitialFilters,
      goBackToTodayTimeline,
      hideComp4Timeline,
    } = this.props;
    const listTabClass = classNames('tab-option', 'no-text-select', {
      active: activeTab === 'list',
    });
    const timelineTabClass = classNames('tab-option', 'no-text-select', {
      active: activeTab === 'timeline',
    });
    return (
      <div className="applied-filters-container" style={hideComp4Timeline ? { marginTop: 0 } : {}}>
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
        {!hideComp4Timeline && (
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
        )}
        <div className="second-row">
          <label className="results-count-label">
            <b>{isLoading ? '-' : resultsCount}</b> zoekresultaten{' '}
            {!hideComp4Timeline && <SortByMenu setSortBy={setSortBy} selected={selectedsortby} />}
          </label>
          {activeTab === 'timeline' && (
            <label className="go-back-label" onClick={goBackToTodayTimeline}>
              Terug naar vandaag
            </label>
          )}
          <div className="results-view-options">
            <span
              className={listTabClass}
              onClick={() => setActiveTab('list')}
              style={
                listTabClass.indexOf('active') !== -1
                  ? {
                      color: appResources.in_content_color,
                      borderColor: appResources.in_content_color,
                    }
                  : { color: '#a7a7a7' }
              }
            >
              <i
                className="material-icons"
                style={
                  listTabClass.indexOf('active') !== -1
                    ? {
                        color: appResources.in_content_color,
                        borderColor: appResources.in_content_color,
                      }
                    : { color: '#a7a7a7' }
                }
              >
                list
              </i>Lijst
            </span>
            <span
              className={timelineTabClass}
              onClick={() => setActiveTab('timeline')}
              style={
                timelineTabClass.indexOf('active') !== -1
                  ? {
                      color: appResources.in_content_color,
                      borderColor: appResources.in_content_color,
                    }
                  : { color: '#a7a7a7' }
              }
            >
              <i
                className="material-icons"
                style={
                  timelineTabClass.indexOf('active') !== -1
                    ? {
                        color: appResources.in_content_color,
                        borderColor: appResources.in_content_color,
                      }
                    : { color: '#a7a7a7' }
                }
              >
                alarm
              </i>Tijdslijn
            </span>
          </div>
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
