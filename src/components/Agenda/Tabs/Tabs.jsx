import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import ReactHLS from 'react-hls';
import ContainerDimensions from 'react-container-dimensions';
import Table from '../../Table/Table';
import ItemMenu from '../../../components/OptionMenu/OptionMenu';
import { AgendaTitleCell, DecisionTitleCell } from '../../Table';
import appResources from '../../../appResources';

class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: [],
      views: [],
      selectedTab: 0,
    };

    this.createTabs = this.createTabs.bind(this);
    this.createViews = this.createViews.bind(this);
  }

  componentWillMount() {
    this.setState({
      tabs: this.createTabs(),
      views: this.createViews(),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedTab !== this.state.selectedTab) {
      this.setState({
        tabs: this.createTabs(),
      });
    }
  }

  createTabs() {
    const { selectedTab } = this.state;
    const { eventData, childEventsData } = this.props;
    const tabs = [];
    const rooms = [eventData].concat(childEventsData);
    let agendaItemsTotalCount = 0;
    rooms.forEach(r => {
      agendaItemsTotalCount += r.agenda_count;
    });
    rooms.forEach((room, i) => {
      if (!_.isEmpty(room)) {
        tabs.push(
          <div
            key={`tab-${i}`}
            onClick={() => this.setState({ selectedTab: i })}
            className={`tab ${selectedTab === i ? 'selected' : ''}`}
          >
            <div className="tab-name">
              {room.parent_event !== null && room.parent_event !== undefined
                ? room.classification.toUpperCase()
                : 'COMPLETE AGENDA'}
            </div>
            <span>
              {room.parent_event !== null
                ? room.agenda_count !== 0
                  ? room.agenda_count
                  : room.document_count
                : agendaItemsTotalCount !== 0
                  ? agendaItemsTotalCount
                  : room.document_count}
            </span>
          </div>,
        );
      }
    });
    return tabs;
  }

  createViews() {
    const { selectedTab } = this.state;
    const { dossiers, eventData, childEventsData } = this.props;
    const views = [];
    const completeAgenda = eventData;
    let rooms = [eventData].concat(childEventsData);
    let allRoomsAgendaItems = [];
    rooms.forEach((r, i) => {
      if (!_.isEmpty(r)) {
        const agenda_items = r.agenda.map(a => {
          return {
            ...a,
            location: r.location,
            start_time: r.start_time,
            // documents: r.documents,
            document_count: r.document_count,
          };
        });
        rooms[i].agenda = agenda_items;
        allRoomsAgendaItems = allRoomsAgendaItems.concat(agenda_items);
      }
    });
    completeAgenda.agenda = allRoomsAgendaItems;
    rooms = [completeAgenda].concat(childEventsData);
    rooms.forEach((room, i) => {
      if (!_.isEmpty(room)) {
        let videoUrl = '';
        let videoName = '';
        let videoDate = '';
        if (room.event_media) {
          if (room.event_media.length !== 0) {
            videoUrl = room.event_media[0].httpstream;
            videoName = room.event_media[0].filename.slice(
              0,
              room.event_media[0].filename.lastIndexOf('.'),
            );
            videoDate = room.start_time;
          }
        }
        views.push(
          <TabView
            id={i}
            room={room}
            key={`view-${i}`}
            dossiers={dossiers}
            selectedTab={selectedTab}
            roomDocs={room.documents}
            video={{
              url: videoUrl,
              name: videoName,
              date: videoDate,
            }}
          />,
        );
      }
    });
    return views;
  }

  render() {
    const { tabs, views, selectedTab } = this.state;
    return (
      <div>
        <div className="event-tabs">
          {tabs}
          <hr />
        </div>
        <div className="event-tab-view">{views[selectedTab]}</div>
      </div>
    );
  }
}

export default Tabs;

class TabView extends React.Component {
  getTableData(data, selectedTab, roomDocs) {
    if (data.agenda.length > 0) {
      return data.agenda.map((item, i) => {
        return {
          id: i,
          dossier: '',
          notes_count: 0,
          title: item.notes,
          documents: item.media,
          document_count: item.media.length,
          // options: {
          //     origin_id: item.id,
          //     combined_id: item.item_id,
          //     type: item.item_type
          // },
          location: selectedTab === 0 ? item.location : data.location,
          start_time:
            selectedTab === 0
              ? moment(item.start_time).format('HH:mm')
              : moment(data.start_time).format('HH:mm'),
          date:
            selectedTab === 0
              ? moment(item.start_time).format('DD-MM-YYYY')
              : moment(data.start_time).format('DD-MM-YYYY'),
        };
      });
    } else if (roomDocs !== undefined) {
      return [
        {
          id: -1,
          dossier: '',
          notes_count: 0,
          title: 'Gerelateerde documenten',
          documents: roomDocs,
          document_count: roomDocs.length,
          location: data.location,
          start_time: moment(data.start_time).format('HH:mm'),
          date: moment(data.start_time).format('DD-MM-YYYY'),
        },
      ];
    }
    return [];
  }

  render() {
    const { id, room, video, selectedTab, roomDocs } = this.props;
    const data = this.getTableData(room, selectedTab, roomDocs);
    return (
      <div className="tab-view-container">
        {data.map((d, i) => {
          return (
            <RowView key={i} data={d} tab={id} id={d.id} video={video} selectedTab={selectedTab} />
          );
        })}
      </div>
    );
  }
}

class RowView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expaned: false,
      selectedView: 'documents',
    };

    this.getTabViews = this.getTabViews.bind(this);
  }

  getTabViews(data) {
    const { id, video } = this.props;
    const views = {};

    const docColumns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <AgendaTitleCell id={id} data={props} />,
        headerClassName: 'tab-big-header',
        className: 'tab-big-cell',
      },
      {
        Header: 'Publicatie datum',
        accessor: 'date',
        Cell: props => <div>{moment(props.original.date).format('DD-MM-YYYY')}</div>,
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        Cell: props => <div>{moment(props.original.date).format('DD-MM-YYYY')}</div>,
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Type document',
        accessor: 'type',
        Cell: props => <div>Document</div>,
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div className="icon-text-cell menu-cell">
            <ItemMenu
              data={{
                uid: id !== -1 ? props.original.links[0].combined_id : props.original.combined_id,
                type: 'document',
                name: id !== -1 ? props.original.links[0].text : props.original.text,
                date: props.original.date,
                id: id !== -1 ? props.original.links[0].doc_id : props.original.id,
                url: id !== -1 ? props.original.links[0].url : props.original.url,
              }}
            />
          </div>
        ),

        headerClassName: 'tab-small-header',
        className: 'tab-small-cell',
      },
    ];

    const decColumns = [
      {
        Header: 'Titel',
        accessor: 'title',
        Cell: props => <DecisionTitleCell data={props} />,
        headerClassName: 'tab-big-header',
        className: 'tab-big-cell',
      },
      {
        Header: 'Publicatie datum',
        accessor: 'created_at',
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Laatst gewijzigd',
        accessor: 'last_modified',
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Type document',
        accessor: 'type',
        Cell: props => <div>Document</div>,
        headerClassName: 'tab-generic-header',
        className: 'tab-generic-cell',
      },
      {
        Header: 'Opties',
        accessor: 'options',
        Cell: props => (
          <div className="icon-text-cell menu-cell">
            <ItemMenu
              data={{
                uid: 0,
                type: 'document',
                name: 'lol',
                date: '12-20-2015',
                id: 0,
              }}
              favoriteMenuItemType={'Add'}
              handleOpenNewDossier={this.handleOpenNewDossier}
            />
          </div>
        ),

        headerClassName: 'tab-small-header',
        className: 'tab-small-cell',
      },
    ];

    views.documents =
      data.documents.length > 0 ? (
        <Table data={data.documents} pageSize={data.documents.length} columns={docColumns} />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>Geen documenten</div>
      );

    const dummyData = {
      decisions: [
        // {
        //     title: "Agenda besluitenlijst presidium 1 februari 2007",
        //     link: `/`,
        //     created_at: "18-12-2017",
        //     last_modified: "19-12-2017",
        // },
        // {
        //     title: "Agenda besluitenlijst presidium 1 februari 2007",
        //     link: `/`,
        //     created_at: "18-12-2017",
        //     last_modified: "19-12-2017",
        // },
        // {
        //     title: "Agenda besluitenlijst presidium 1 februari 2007",
        //     link: `/`,
        //     created_at: "18-12-2017",
        //     last_modified: "19-12-2017",
        // },
      ],
    };

    views.decisions =
      dummyData.decisions.length > 0 ? (
        <Table
          data={dummyData.decisions}
          pageSize={dummyData.decisions.length}
          columns={decColumns}
        />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>Geen besluitenlijst</div>
      );

    views.video =
      video.url !== '' ? (
        <div>
          <ContainerDimensions>
            {({ width, height }) => (
              <ReactHLS
                width={width > 500 ? width : 500}
                height={400}
                url={video.url.replace('http://', 'https://')}
              />
            )}
          </ContainerDimensions>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>Geen videostream</div>
      );

    return views;
  }

  render() {
    const { data } = this.props;
    const { expanded, selectedView } = this.state;
    const views = this.getTabViews(data);
    return (
      <div>
        <div className="row-view-container">
          <div className="top-div" onClick={() => this.setState({ expanded: !expanded })}>
            <i className="material-icons">
              {expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </i>
            <label style={{ color: appResources.in_content_color }}>{data.title}</label>
          </div>
          <div className="low-div">
            <div>
              <b>Locatie:</b> {data.location}
            </div>
            <div>
              <b>Datum:</b> {data.date}
            </div>
            <div>
              <b>Starttijd:</b> {data.start_time}
            </div>
            {data.dossier && (
              <div>
                <b>Dossier:</b> {data.dossier}
              </div>
            )}
            {data.voorzitter && (
              <div>
                <b>Voorzitter:</b> {data.voorzitter}
              </div>
            )}
            {data.griffier && (
              <div>
                <b>Griffier:</b> {data.griffier}
              </div>
            )}
          </div>
        </div>
        {expanded && (
          <div className="expandable-view-container">
            <div className="tabs">
              <div
                className={`tab ${selectedView === 'documents' ? 'selected' : ''}`}
                onClick={() => this.setState({ selectedView: 'documents' })}
              >
                Gerelateerde documenten
              </div>
              <div
                className={`tab ${selectedView === 'decisions' ? 'selected' : ''}`}
                onClick={() => this.setState({ selectedView: 'decisions' })}
              >
                Besluitenlijst
              </div>
              <div
                className={`tab ${selectedView === 'video' ? 'selected' : ''}`}
                onClick={() => this.setState({ selectedView: 'video' })}
              >
                Video
              </div>
            </div>
            <hr />
            <div className="view">{views[selectedView]}</div>
          </div>
        )}
      </div>
    );
  }
}
