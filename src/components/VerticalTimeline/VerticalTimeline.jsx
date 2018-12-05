import React from 'react';
import Timeline from 'react-dual-timeline';
import ActionEvent from '@material-ui/icons/Event';
import EditorInsertDriveFile from '@material-ui/icons/InsertDriveFile';
import Videocam from '@material-ui/icons/Videocam';
import Folder from '@material-ui/icons/Folder';
import { StyleRoot } from 'radium';
import * as Colors from '@material-ui/core/colors';
import TimelineEvent from './TimelineEvent';
import appResources from '../../appResources';
import Pagination from '../general/Pagination';
import { isLoggedIn } from '../../helpers';
import {
  EVENT,
  CHILD_EVENT,
  DOCUMENT,
  MEDIA,
  RECEIVED_DOCUMENT,
  COUNCIL_ADDRESS,
  WRITTEN_QUESTION,
  FORMAT,
  MANAGEMENT_DOCUMENT,
  POLICY_DOCUMENT,
  MOTION,
  COMMITMENT,
  PUBLIC_DOSSIER,
} from '../../constants';

const iconStyle = {
  width: 40,
  height: 40,
  padding: 5,
  color: '#fff',
  borderRadius: '50%',
  background: appResources.eventColor,
};

/* todo: refactor this component */
class VerticalTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 1,
    };

    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    if (isLoggedIn()) {
      this.props.loadUserDossiers();
    }
    this.props.loadLatestData(this.state.pageNumber);
  }

  componentWillUnmount() {
    this.props.clearLatestData();
  }

  setIcon(type) {
    switch (type) {
      case EVENT:
        return <ActionEvent style={{ ...iconStyle, background: appResources.eventColor }} />;
      case CHILD_EVENT:
        return <ActionEvent style={{ ...iconStyle, background: appResources.eventColor }} />;
      case DOCUMENT:
        return (
          <EditorInsertDriveFile style={{ ...iconStyle, background: appResources.documentColor }} />
        );
      case MEDIA:
        return <Videocam style={{ ...iconStyle, background: Colors.teal200 }} />;
      case RECEIVED_DOCUMENT:
        return (
          <EditorInsertDriveFile
            style={{ ...iconStyle, background: appResources.received_document }}
          />
        );
      case COUNCIL_ADDRESS:
        return (
          <EditorInsertDriveFile
            style={{ ...iconStyle, background: appResources.council_address }}
          />
        );
      case WRITTEN_QUESTION:
        return (
          <EditorInsertDriveFile
            style={{ ...iconStyle, background: appResources.written_question }}
          />
        );
      case FORMAT:
        return <EditorInsertDriveFile style={{ ...iconStyle, background: appResources.format }} />;
      case MANAGEMENT_DOCUMENT:
        return (
          <EditorInsertDriveFile
            style={{ ...iconStyle, background: appResources.management_document }}
          />
        );
      case POLICY_DOCUMENT:
        return (
          <EditorInsertDriveFile
            style={{ ...iconStyle, background: appResources.policy_document }}
          />
        );
      case MOTION:
        return <EditorInsertDriveFile style={{ ...iconStyle, background: appResources.format }} />;
      case COMMITMENT:
        return (
          <EditorInsertDriveFile
            style={{ ...iconStyle, background: appResources.policy_document }}
          />
        );
      case PUBLIC_DOSSIER:
        return <Folder style={{ ...iconStyle, background: appResources.policy_document }} />;
      default:
        return <ActionEvent style={{ ...iconStyle, background: appResources.orange200 }} />;
    }
  }

  changePage(p) {
    this.setState({ pageNumber: p });
    this.props.loadLatestData(p);
  }

  render() {
    const {
      items,
      dossiers,
      showPopover,
      mediaWidthMed,
      mediaWidthSmall,
      lineColor,
      itemWidth,
      itemWidthMed,
      activeColor,
      paddingTop,
      eventPaperDepth,
      setSnackbar,
      handleOpenNewDossier,
    } = this.props;
    const notificationItems = items.map((notification, i) => {
      return (
        <div key={i} icon={this.setIcon(notification.type)} className="verticalTimeLineEvent">
          <TimelineEvent
            id={notification.id}
            item_id={notification.item_id}
            title={notification.title}
            date={notification.date}
            createdAt={notification.createdAt}
            location={notification.location}
            type={notification.type}
            eventPaperDepth={eventPaperDepth}
            showPopover={showPopover}
            dossiers={dossiers}
            setSnackbar={setSnackbar}
            handleOpenNewDossier={handleOpenNewDossier}
            downloadUrl={notification.download_url}
          />
        </div>
      );
    });

    return (
      <div className="homepage-updates-scroll-div" ref="scrollDiv">
        <StyleRoot>
          <Timeline
            animations={false}
            mediaWidthMed={mediaWidthMed}
            mediaWidthSmall={mediaWidthSmall}
            itemWidth={itemWidth}
            itemWidthMed={itemWidthMed}
            paddingTop={paddingTop}
            itemPadding={0}
            activeColor={activeColor}
            lineColor={lineColor}
            lineWidth={1.5}
            triangleOffset={200}
            circleWidth={40}
          >
            {notificationItems}
          </Timeline>
        </StyleRoot>
        <Pagination
          activePage={this.state.pageNumber}
          itemsCount={parseInt(this.props.resultsCount, 10)}
          color={appResources.in_content_color}
          onPageChange={this.changePage}
        />
      </div>
    );
  }
}

export default VerticalTimeline;
