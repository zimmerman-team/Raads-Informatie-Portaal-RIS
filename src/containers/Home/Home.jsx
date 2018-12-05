import React from 'react';
import { connect } from 'react-redux';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import VerticalTimeline from '../../components/VerticalTimeline/VerticalTimeline';
import SearchBlock from '../../components/SearchField/SearchField';
import appResources from '../../appResources';
import { setSnackBar, setDossierModal } from '../../actions/generalActions';
import { loadLatestData, clearLatestData } from '../../actions/latestDataActions';
import { loadUserDossiers, addToDossier, addFavorite } from '../../actions/userActions';
import cx from 'classnames';
import styles from './Home.module.scss';
import ContentHeader from '../../components/ContentHeader/ContentHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import { specifySearch } from '../../actions/combinedActions';
import LiveStreamTile from './HomeComponents/LiveStreamTile';
import PublicDossierTile from './HomeComponents/PublicDossierTile';
import staticText from './Home.mock';
import { RadioButton, RadioButtonGroup } from 'material-ui';

const radioStyle = {
  width: 'fit-content',
  display: 'inline-flex',
  whiteSpace: 'nowrap',
  marginRight: 30,
};

/* todo: refactor this container */
class Home extends React.Component {
  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Home`;
  }

  render() {
    return (
      <div className={cx(styles.component, 'homepage-main')}>
        <Grid fluid>
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <div className={cx(styles.homepageHeader, 'homepage-header')}>
                <h1 style={{ color: appResources.in_content_color, fontWeight: 'lighter' }}>
                  {staticText.bigHeaderText} {appResources.municipality}
                </h1>
                <ContentHeader title={staticText.searchHeader} />
                <SearchBlock isSearchPage={false} hintText={staticText.searchHintText} />
                <div className={styles.searchCheckboxDiv}>
                  <RadioButtonGroup
                    name="search_type"
                    defaultSelected={this.props.searchType}
                    onChange={(e, value) => this.props.specifySearch(value)}
                  >
                    <RadioButton
                      value="q"
                      label="Alle raadsinformatie doorzoeken"
                      labelStyle={{ color: '#717171' }}
                      iconStyle={{
                        fill:
                          this.props.searchType === 'q' ? appResources.in_content_color : '#ccc',
                        marginRight: 6,
                      }}
                      style={radioStyle}
                    />
                    <RadioButton
                      value="name__icontains"
                      label="Alleen titels doorzoeken"
                      labelStyle={{ color: '#717171' }}
                      iconStyle={{
                        fill:
                          this.props.searchType === 'name__icontains'
                            ? appResources.in_content_color
                            : '#ccc',
                        marginRight: 6,
                      }}
                      style={radioStyle}
                    />
                  </RadioButtonGroup>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12} className="homepage-raad-block">
              {/* todo: implement content header component consistantly */}
              <ContentHeader icon="public" title={appResources.homepage.header1} />
              <p>{appResources.homepage.text1}</p>
              <span
                className="more-info-link"
                onClick={() => window.open(appResources.externalAboutLink, '_blank')}
              >
                {staticText.moreInfo}
              </span>
            </Col>
          </Row>
          <hr />
          {false && (
            <div>
              <Row className="show-grid">
                <PublicDossierTile />
              </Row>
              <hr />
              <Row className="show-grid">
                <LiveStreamTile />
              </Row>
              <hr />
            </div>
          )}
          <Row className="show-grid">
            <Col sm={12} md={12} lg={12}>
              <div className="jr-timeline" style={{ marginBottom: '20px' }}>
                <ContentHeader
                  glyph="refresh"
                  title={staticText.updatesHeader.concat(' '.concat(appResources.municipality))}
                />
                {this.props.isLoading && (
                  <div className="circular-progress">
                    <CircularProgress size={80} thickness={5} />
                  </div>
                )}
                <VerticalTimeline
                  paddingTop={20}
                  itemWidth={350}
                  itemWidthMed={100}
                  activeColor="#fff"
                  showPopover
                  eventPaperDepth={0}
                  mediaWidthMed={1500}
                  mediaWidthSmall={8000}
                  dossiers={this.props.dossiers}
                  items={this.props.timelineItems}
                  lineColor={appResources.header.background}
                  setSnackbar={this.props.setSnackBar}
                  handleOpenNewDossier={this.props.setDossierModal}
                  loadLatestData={this.props.loadLatestData}
                  clearLatestData={this.props.clearLatestData}
                  loadUserDossiers={this.props.loadUserDossiers}
                  resultsCount={this.props.resultsCount}
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
  const { user, latestData, combined } = state;
  return {
    dossiers: user.dossiers,
    timelineItems: latestData.data,
    isLoading: latestData.isLoading,
    resultsCount: latestData.resultsCount,
    searchType: combined.searchType,
  };
}

export default connect(mapStateToProps, {
  setSnackBar,
  addFavorite,
  addToDossier,
  loadLatestData,
  specifySearch,
  setDossierModal,
  clearLatestData,
  loadUserDossiers,
})(Home);
