import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios/index';
import { Link } from 'react-router';
import { Col, Row, Grid } from 'react-bootstrap';
import { CircularProgress } from 'material-ui';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/general/Pagination';
import { MyNotesTitleCell } from '../../../components/Table';
import { loadMyNotes, removeNote } from '../../../actions/notesActions';
import { setAddNote } from '../../../actions/generalActions';
import appResources from '../../../appResources';
import NoteModal from '../../../components/modals/NoteModal';
import HeaderIcon from '../../../components/icons/MyNotes';
import PageHeader from '../../../components/PageHeader/PageHeader';
import ItemMenu from '../../../components/OptionMenu/OptionMenu';
import { getDocBackendUrl } from '../MyNotes/Helper';

class MyNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      smallScreen: false,
      notes: props.notes ? props.notes : [],
      page: 1,
      page_size: 10,
      noteContent: '',
      showNoteContent: false,
    };

    this.resize = this.resize.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  componentWillMount() {
    const { page, page_size } = this.state;
    this.props.loadMyNotes(page, page_size);
  }

  componentDidMount() {
    document.title = `${appResources.documentTitle} | Mijn Notities`;
    document.querySelector('#content-wrap').scrollTop = 0;
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      notes: nextProps.notes,
    });
  }

  resize() {
    this.setState({ smallScreen: window.innerWidth <= 760 });
  }

  onPageChange(page_num) {
    this.setState(
      { page: page_num, page_size: 10 },
      this.props.loadMyNotes(this.state.page, this.state.page_size),
    );
  }

  removeNote(id) {
    this.props.removeNote(id);
  }

  getDocDetails(data, type) {
    switch (parseInt(type, 10)) {
      case 0:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.text,
          date: data.date,
          notes: data.notes,
          type: 'Document',
          author: '',
          fileUrl: data.url.charAt(4) !== 's' ? data.url.replace('http', 'https') : data.url,
        };
      case 1:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.date,
          notes: data.notes,
          type: 'P&C Cyclus',
          author: '',
          fileUrl:
            data.document !== null
              ? data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 2:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.publication_date,
          notes: data.notes,
          type: 'Brief aan de raad',
          author: '',
          fileUrl:
            data.question_document !== null
              ? data.question_document.url.charAt(4) !== 's'
                ? data.question_document.url.replace('http', 'https')
                : data.question_document.url
              : '',
        };
      case 3:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.question_date,
          type: 'Schriftelijke vragen',
          notes: data.notes,
          author: data.portfolio_holder || '',
          fileUrl:
            data.question_document !== null
              ? data.question_document.url.charAt(4) !== 's'
                ? data.question_document.url.replace('http', 'https')
                : data.question_document.url
              : '',
        };
      case 4:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.date_created,
          notes: data.notes,
          type: 'Formats',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 5:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.publication_date,
          notes: data.notes,
          type: 'Presidium besluitenlijsten',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 6:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.publication_date,
          notes: data.notes,
          type: 'Raadsbrieven',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 7:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.date_created || data.meeting_date,
          notes: data.notes,
          type: 'Motie',
          author: data.portfolio_holder || '',
          fileUrl:
            data.document !== null
              ? data.document.url.charAt(4) !== 's'
                ? data.document.url.replace('http', 'https')
                : data.document.url
              : '',
        };
      case 8:
        return {
          id: data.id,
          category: 'Brief aan de Raad',
          status: 'Onvoldoende Besproken',
          name: data.title,
          date: data.commitment_date,
          notes: data.notes,
          type: 'Toezeggingen',
          author: data.portfolio_holder || '',
          fileUrl:
            data.new_document !== null
              ? data.new_document.url.charAt(4) !== 's'
                ? data.new_document.url.replace('http', 'https')
                : data.new_document.url
              : '',
        };
      default:
        return '';
    }
  }

  editNote(note) {
    const url = `${appResources.backendUrl}${getDocBackendUrl(note)}`;
    const _this = this;

    axios
      .get(url)
      .then(response => {
        const data = response.data;
        const docDetails = _this.getDocDetails(data, note.type);
        _this.props.setAddNote(docDetails, true, note);
      })
      .catch(error => {});
  }

  getDocTypeName(type) {
    switch (parseInt(type, 10)) {
      case 0:
        return 'Document';
      case 1:
        return 'Ontvangen documenten';
      case 2:
        return 'Raad adres';
      case 3:
        return 'Schriftelijke vragen';
      case 4:
        return 'Openbaar document';
      case 5:
        return 'Beleidsdocument';
      case 6:
        return 'Management document';
      case 7:
        return 'Motie';
      case 8:
        return 'Toezeggingen';
      default:
        return '';
    }
  }

  render() {
    const { isLoading, dossiers } = this.props;
    const { notes, page, page_size, smallScreen, noteContent, showNoteContent } = this.state;

    const bigScreenCols = [
      {
        Header: 'Notitie Titel',
        accessor: 'title',
        Cell: props => <MyNotesTitleCell data={props} editNote={this.editNote} />,
        headerClassName: 'notes-big-header',
        className: 'notes-big-cell',
      },
      {
        Header: 'Datum aangemaakt',
        accessor: 'created_at',
        headerClassName: 'notes-generic-header',
        className: 'notes-generic-cell',
      },
      {
        Header: 'Datum Bewerkt',
        accessor: 'last_modified',
        headerClassName: 'notes-generic-header',
        className: 'notes-generic-cell',
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: props => <div>{this.getDocTypeName(props.original.type)}</div>,
        headerClassName: 'notes-generic-header',
        className: 'notes-generic-cell',
      },

      {
        Header: 'Gelinked Bestand',
        accessor: 'doc_title',
        Cell: props => (
          <Link
            to={`/document/${props.original.type}/${props.original.doc_id}`}
            style={{ color: appResources.in_content_color }}
          >
            {props.original.doc_title}
          </Link>
        ),
        headerClassName: 'notes-generic-header',
        className: 'notes-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <ItemMenu
            data={props}
            dossiers={dossiers}
            optionType={'notes'}
            extraFunction={this.editNote}
          />
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

    const smallScreenCols = [
      {
        Header: 'Notitie Titel',
        accessor: 'title',
        Cell: props => <MyNotesTitleCell data={props} />,
        headerClassName: 'notes-big-header',
        className: 'notes-big-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <ItemMenu
            data={props}
            dossiers={dossiers}
            optionType={'notes'}
            extraFunction={this.editNote}
          />
        ),
        headerClassName: 'small-header',
        className: 'small-cell',
      },
    ];

    return (
      <div className="basePage folders-page-container">
        <NoteModal
          show={showNoteContent}
          content={noteContent}
          close={() => {
            this.setState({
              noteContent: '',
              showNoteContent: false,
            });
          }}
        />

        {isLoading && (
          <div className="general-loader">
            <CircularProgress size={80} thickness={5} />
          </div>
        )}
        <Grid fluid>
          <PageHeader
            icon={<HeaderIcon />}
            title="Mijn Notities"
            description="Hier staan uw notities gelinked aan uw documenten"
          />
          <Row className="show-grid search-results">
            <Col sm={12} md={12} lg={12}>
              <div>
                <Table
                  type="notes"
                  data={notes}
                  pageSize={page_size}
                  columns={smallScreen ? smallScreenCols : bigScreenCols}
                />
                <Pagination
                  activePage={page}
                  onPageChange={this.onPageChange}
                  itemsCount={notes.length}
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
  const { user, isLoading } = state;
  return {
    dossiers: user.dossiers,
    notes: user.notes,
    isLoading,
  };
}

export default connect(mapStateToProps, {
  loadMyNotes,
  removeNote,
  setAddNote,
})(MyNotes);
