import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-bootstrap';
import CircularProgress from 'material-ui/CircularProgress';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/general/Pagination';
import SortByMenu from '../../../components/general/SortByMenu';
import { SavedQuerriesCell } from '../../../components/Table';
import appResources from '../../../appResources';
import { loadUserQueries, removeQuery, setSavedQuery } from '../../../actions/userActions';
import HeaderIcon from '../../../components/icons/Search';
import PageHeader from '../../../components/PageHeader/PageHeader';

class MyQuerries extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      page_size: 10,
      sort_by: 'name',
    };

    this.setSortBy = this.setSortBy.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.getOrderedQueries = this.getOrderedQueries.bind(this);
  }

  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Bewaaren zoekopdrachten`;
    window.addEventListener('resize', this.resize);
    this.props.loadUserQueries(this.state.page, this.state.page_size);
  }

  setSortBy(value) {
    this.setState({ sort_by: value });
  }

  onPageChange(page) {
    const { page_size } = this.state;
    this.setState({ page }, () => {
      this.props.loadUserQueries(page, page_size);
    });
  }

  getOrderedQueries() {
    const { sort_by } = this.state;
    const { queries } = this.props;
    const sortField = sort_by[0] === '-' ? sort_by.substring(1) : sort_by;

    let result = _.sortBy(queries, sortField);
    result = sort_by[0] !== '-' ? result : result.reverse();
    return result;
  }

  render() {
    const { sort_by, page } = this.state;
    const { queries, isLoading, queriesCount } = this.props;
    const cols = [
      {
        accessor: 'title',
        Cell: props => (
          <SavedQuerriesCell
            data={props}
            removeQuery={this.props.removeQuery}
            setSavedQuery={this.props.setSavedQuery}
          />
        ),
        headerClassName: 'one-column-header',
        className: 'query-big-cell',
      },
    ];

    return (
      <div className="folders-page-container">
        {isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Grid fluid>
          <PageHeader
            icon={<HeaderIcon />}
            title="Mijn bewaarde zoekopdrachten"
            description="Hier kunt u uw bewaarde zoekopdrachten verwijderen"
          />
          <Row className="search-results">
            <Col sm={12} md={12} lg={12}>
              <div className="sort-by-outside">
                <hr />
                <label className="sort-by-inside">
                  <b style={{ marginLeft: '0' }}>{queriesCount}</b> bewaarde zoekopdrachten
                  <SortByMenu setSortBy={this.setSortBy} selected={sort_by} justName />
                </label>
                <hr style={{ marginBottom: '40px' }} />
              </div>
              <div>
                <Table pageSize={10} data={this.getOrderedQueries(queries)} columns={cols} />
                <Pagination
                  activePage={page}
                  itemsCount={parseInt(queriesCount, 10)}
                  color={appResources.in_content_color}
                  onPageChange={this.onPageChange}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    queries: user.queries,
    isLoading: user.isLoading,
    queriesCount: user.queriesCount,
  };
}

export default connect(mapStateToProps, {
  removeQuery,
  setSavedQuery,
  loadUserQueries,
})(MyQuerries);
