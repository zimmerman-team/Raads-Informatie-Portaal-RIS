import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-bootstrap';
import { CircularProgress } from 'material-ui';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/general/Pagination';
import MyAgendaTitleCell from '../../../components/Table/MyAgendaTitleCell';
import ItemMenu from '../../../components/OptionMenu/OptionMenu';
import appResources from '../../../appResources';
import {
  loadMyAgendas,
  addFavorite,
  removeAgenda,
  addNotification,
} from '../../../actions/userActions';
import PageHeader from '../../../components/PageHeader/PageHeader';
import { GeneralTitleCell } from '../../../components/Table';

class MyAgenda extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agendas: props.myAgenda ? props.myAgenda : [],
      page: 1,
      page_size: 10,
    };
  }

  componentWillMount() {
    this.props.loadMyAgendas();
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Mijn Kalender`;
    document.querySelector('#content-wrap').scrollTop = 0;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ agendas: nextProps.myAgenda });
  }

  render() {
    const { isLoading } = this.props;
    const { agendas, page, page_size } = this.state;

    const columns = [
      {
        Header: 'Titel',
        accessor: 'name',
        Cell: props => <MyAgendaTitleCell data={props} />,
        headerClassName: 'my-agenda-big-header',
        className: 'my-agenda-big-cell',
      },
      {
        Header: 'Locatie',
        accessor: 'location',
        Cell: props => (
          <GeneralTitleCell paddingTop={8} value={props.value} hasDescription={false} />
        ),
        headerClassName: 'my-agenda-generic-header',
        className: 'my-agenda-generic-cell',
      },
      {
        Header: 'Datum',
        accessor: 'start_date',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={8}
            hasDescription={false}
            value={moment(props.value).format('DD-MM-YYYY')}
          />
        ),
        headerClassName: 'my-agenda-generic-header',
        className: 'my-agenda-generic-cell',
      },
      {
        Header: 'Starttijd',
        accessor: 'start_time',
        Cell: props => (
          <GeneralTitleCell
            paddingTop={8}
            hasDescription={false}
            value={moment(props.value).format('DD-MM-YYYY')}
          />
        ),
        headerClassName: 'my-agenda-generic-header',
        className: 'my-agenda-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div style={{ paddingTop: 10, marginBottom: -10 }}>
            <ItemMenu data={props} optionType={'my_agenda'} />
          </div>
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
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
            icon={<div>{agendas.length}</div>}
            title="Agenda’s in Mijn Kalender"
            description="Hier kunt u door u geselecteerde agenda punten volgen en bekijken"
          />
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div>
                <Table type="agenda" data={agendas} columns={columns} pageSize={page_size} />
                <Pagination
                  activePage={page}
                  onPageChange={page_num => this.setState({ page: page_num })}
                  itemsCount={agendas.length}
                  color={appResources.in_content_color}
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
    myAgenda: user.myAgenda,
  };
}

export default connect(mapStateToProps, {
  loadMyAgendas,
  addFavorite,
  removeAgenda,
  addNotification,
})(MyAgenda);
