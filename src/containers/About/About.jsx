import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import appResources from '../../appResources';
import AboutIcon from '../../components/icons/About';
import PageHeader from '../../components/PageHeader/PageHeader';

const raadImage = appResources.homepage.picture;

class About extends React.Component {
  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Over de Raad`;
  }

  render() {
    return (
      <div className="basePage about-page">
        <Grid fluid>
          <PageHeader icon={<AboutIcon />} title="Over de Raad" />

          <div className="about-page-block">
            <p style={{ fontSize: '16px', fontWeight: '400' }}>
              Generieke omschrijving van de Werkzaamheden van de Raad. Als raadslid of als inwoner
              van Gemeente {appResources.municipality} kunt u ons nu nog beter volgen via
              raadsinformatie portaal. Blijf op de hoogte van uw stad en de besluiten die door de
              raad worden genomen, Raadsinformatie Portaal Gemeente {appResources.municipality}{' '}
              staat voor openheid en transparantie. Raadsdocumenten zijn nu via onze zoekmachine
              voor iedereen vindbaar en inzichtelijk. Momenteel kijkt u naar betáversie 2.0 van dit
              raadsinformatie portaal
            </p>
            {/*<img src={raadImage} alt="raads" />*/}
            <p>
              Als raadslid of als inwoner van Gemeente {appResources.municipality} kunt u ons nu nog
              beter volgen via dit raadsinformatie portaal. Blijf op de hoogte van uw stad en de
              besluiten die door de raad worden genomen, Raadsinformatie Portaal Gemeente{' '}
              {appResources.municipality} staat voor openheid en transparantie. Raadsdocumenten zijn
              nu via onze zoekmachine voor iedereen vindbaar en inzichtelijk. Momenteel kijkt u naar
              betáversie 2.0 van dit raadsinformatie portaal
            </p>
          </div>

          {false && (
            <div>
              <div className="about-page-block">
                <h2>Generieke omschrijving van de Werkzaamheden van de Raad.</h2>
                <p>
                  Als raadslid of als inwoner van Gemeente {appResources.municipality} kunt u ons nu
                  nog beter volgen via dit raadsinformatie portaal. Blijf op de hoogte van uw stad
                  en de besluiten die door de raad worden genomen, Gemeente X staat voor openheid en
                  transparantie. Raadsdocumenten zijn nu via onze zoekmachine voor iedereen vindbaar
                  en inzichtelijk. Momenteel kijkt u naar betáversie 2.0 van dit raadsinformatie
                  portaal
                </p>
              </div>

              <div className="about-page-block">
                <h2>De mensen achter de Raad</h2>
                <p>
                  Als raadslid of als inwoner van Gemeente {appResources.municipality} kunt u ons nu
                  nog beter volgen via dit raadsinformatie portaal. Blijf op de hoogte van uw stad
                  en de besluiten die door de raad worden genomen, Gemeente X staat voor openheid en
                  transparantie. Raadsdocumenten zijn nu via onze zoekmachine voor iedereen vindbaar
                  en inzichtelijk. Momenteel kijkt u naar betáversie 2.0 van dit raadsinformatie
                  portaal
                </p>
              </div>

              <div className="about-page-block" style={{ margin: '30px 0' }}>
                <Grid fluid style={{ paddingLeft: 0 }}>
                  <Row>
                    <Col sm={12} md={12} lg={6}>
                      <h2>Het Dagelijks Bestuur</h2>
                      <Table className="notes-table">
                        <TableBody>
                          {appResources.aboutContent.dailyBoard.map((i, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <b>{i.label}:</b>
                                </TableCell>
                                <TableCell>{i.value}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Col>
                    <Col sm={12} md={12} lg={6}>
                      <h2>De Raad</h2>
                      <Table className="notes-table">
                        <TableBody>
                          {appResources.aboutContent.raad.map((r, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell style={{ width: '25%' }}>
                                  <b>{r.label}:</b>
                                </TableCell>
                                <TableCell style={{ width: '25%' }}>{r.value}</TableCell>
                                <TableCell style={{ width: '25%' }}>
                                  <b>Fractie:</b>
                                </TableCell>
                                <TableCell style={{ width: '25%' }}>{r.fractie}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Col>
                  </Row>
                </Grid>
              </div>

              <div className="about-page-block" style={{ paddingBottom: 20 }}>
                <h2>Contact met de Raad</h2>
                <Grid fluid style={{ paddingLeft: 0 }}>
                  <Row>
                    <Col sm={12} md={12} lg={6}>
                      <Table className="notes-table">
                        <TableBody>
                          {appResources.aboutContent.contact.slice(0, 5).map((i, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <b>{i.label}:</b>
                                </TableCell>
                                <TableCell>
                                  <a href={i.link} target="_blank">
                                    {i.value}
                                  </a>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Col>
                    <Col sm={12} md={12} lg={6}>
                      <Table className="notes-table">
                        <TableBody>
                          {appResources.aboutContent.contact.slice(5, 9).map((i, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <b>{i.label}:</b>
                                </TableCell>
                                <TableCell>
                                  <a href={i.link} target="_blank">
                                    {i.value}
                                  </a>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Col>
                  </Row>
                </Grid>
              </div>
            </div>
          )}
        </Grid>
      </div>
    );
  }
}

export default About;
