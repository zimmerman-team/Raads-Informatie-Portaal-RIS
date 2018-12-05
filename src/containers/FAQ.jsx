import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Anchor from '@trendmicro/react-anchor';
import Breadcrumbs from '@trendmicro/react-breadcrumbs';
import appResources from '../appResources.js';

class FAQ extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showPaper: false,
      question: '',
      name: '',
      email: '',
      questionError: '',
      nameError: '',
      emailError: '',
    };

    this.setModalVisibility = this.setModalVisibility.bind(this);
    this.setPaperVisibility = this.setPaperVisibility.bind(this);
    this.emailValidation = this.emailValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | FAQ`;
  }

  handleSubmit() {
    this.emailValidation(this.state.email);
    if (this.state.emailError === '' && this.state.name !== '' && this.state.question !== '') {
      window.open(
        `mailto:info@zimmermanzimmerman.nl?subject=RI Almere: Nieuwe vraag van ${
          this.state.name
        }&body=Hoi!%0D%0A%0D%0AMijn vraag is: ${
          this.state.question
        }%0D%0A%0D%0AHartelijke groet,%0D%0A${this.state.name}%0D%0A`,
        '_self',
      );
      this.setPaperVisibility();
      this.setModalVisibility();
      this.setState({
        question: '',
        name: '',
        email: '',
        questionError: '',
        nameError: '',
        emailError: '',
      });
    } else {
      let nameError, questionError, emailError;
      if (this.state.name === '') {
        nameError = 'This field cannot be empty';
      }
      if (this.state.question === '') {
        questionError = 'This field cannot be empty';
      }
      if (this.state.email === '' && this.state.emailError === '') {
        emailError = 'This field cannot be empty';
      }
      this.setState({ nameError, questionError, emailError });
    }
  }

  emailValidation(value) {
    let emailError;
    if (value !== '') {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailError = !regex.test(value) ? 'Not a valid email.' : '';
    } else {
      emailError = '';
    }

    this.setState({ email: value, emailError });
  }

  setPaperVisibility() {
    this.setState({
      showPaper: !this.state.showPaper,
    });
  }

  setModalVisibility() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  render() {
    return (
      <div className="main-no-top-padding" id="top">
        <div className="breadcrumb-div" style={{ background: appResources.breadcrumbs.background }}>
          <Breadcrumbs>
            <Breadcrumbs.Item>
              <Anchor href="/">HOME</Anchor>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item active>VEELGESTELDE VRAGEN</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
        <Dialog
          open={this.state.showModal}
          autoScrollBodyContent={false}
          onRequestClose={this.props.setModalVisibility}
          bodyStyle={{ padding: '0.8rem', paddingBottom: '2rem' }}
        >
          <a className="cancel-btn" onClick={this.setModalVisibility}>
            SLUITEN <Glyphicon glyph="remove" style={{ color: '#4D4D4D' }} />
          </a>
          <div
            style={{ marginTop: '3rem', textAlign: 'center', lineHeight: '25px' }}
            className="notesHeaderTitle"
          >
            UW VRAAG IS DOORGESTUURD<br />
            <br />
            WE PROBEREN BINNEN 2 WERKDAGEN<br />
            <br />
            ANTWOORD TE GEVEN OP UW VRAAG.<br />
            <br />
          </div>
          <br />
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => this.setState({ showModal: false, showPaper: true })}
              primary
              label="STEL NOG EEN VRAAG"
              labelStyle={{
                fontWeight: 'bold',
                fontSize: '1.4rem',
                padding: '1.5rem 3rem 1.5rem 3rem',
              }}
            />
          </div>
          <br />
        </Dialog>
        {this.state.showPaper && (
          <div className="paper-div-container">
            <Paper zDepth={2} style={{ padding: '2rem' }}>
              <a className="cancel-btn" onClick={this.setPaperVisibility}>
                SLUITEN <Glyphicon glyph="remove" style={{ color: '#4D4D4D' }} />
              </a>
              <div style={{ marginTop: '2rem' }} className="notesHeaderTitle">
                STEL ZELF EEN VRAAG
              </div>
              <br />
              <TextField
                errorText={this.state.questionError}
                fullWidth
                hintText="Uw vraag"
                onChange={(event, newValue) => this.setState({ question: newValue })}
              />
              <br />
              <br />
              <TextField
                errorText={this.state.nameError}
                fullWidth
                hintText="Naam"
                onChange={(event, newValue) => this.setState({ name: newValue })}
              />
              <br />
              <br />
              <TextField
                errorText={this.state.emailError}
                fullWidth
                hintText="*Email adres"
                onChange={(event, newValue) => this.emailValidation(newValue)}
              />
              <br />
              <br />
              <Button
                onClick={this.handleSubmit}
                primary
                label="VERZENDEN"
                labelStyle={{ fontWeight: 'bold', fontSize: '1.4rem', padding: '2rem' }}
              />
            </Paper>
          </div>
        )}
        <div className="about-container">
          <div>
            <div style={{ float: 'left', paddingTop: '0.7rem' }} className="notesHeaderTitle">
              VEELGESTELDE <span className="title-no-bold">VRAGEN</span>
            </div>
            {false &&
              !this.state.showPaper && (
                <div className="faq-top-btn">
                  <Button
                    primary
                    label="STEL ZELF EEN VRAAG"
                    labelStyle={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                    onClick={this.setPaperVisibility}
                  />
                </div>
              )}
          </div>
          <br />
          <br />
          <hr />
          <br />
          <a className="FAQ-a-tag" href="#1">
            Voor wie is dit portaal gemaakt?
          </a>
          <br />
          <br />
          <a className="FAQ-a-tag" href="#2">
            Wat voor informatie kan ik vinden op dit portaal?
          </a>
          <br />
          <br />
          <a className="FAQ-a-tag" href="#3">
            Wat betekent open data?
          </a>
          <br />
          <br />
          <a className="FAQ-a-tag" href="#4">
            Wat betekent open source?
          </a>
          <br />
          <br />
          <hr id="1" />
          <a className="back-to-top" href="#top">
            <Glyphicon glyph="arrow-up" /> Back to top
          </a>
          <div
            style={{ fontSize: 22, fontWeight: 'bold', marginTop: '3rem', marginBottom: '2rem' }}
          >
            Voor wie is dit portaal gemaakt?
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Het raadsinformatie portaal is er voor iedereen. Of u nu raadslid, burger of
                ambtenaar bent, iedereen heeft toegang tot het portaal en de raadsinformatie. Dit
                vergroot de informatiepositie van raadsleden, inwoners, journalisten,
                belangenorganisaties en ambtenaren binnen en buiten de gemeente. Kortom, het portaal
                is er voor iedereen die actief of geïnteresseerd is in wat er besloten wordt binnen
                de gemeente.
              </p>
            </div>
          </div>
          <hr id="2" />
          <a className="back-to-top" href="#top">
            <Glyphicon glyph="arrow-up" /> Back to top
          </a>
          <div
            style={{ fontSize: 22, fontWeight: 'bold', marginTop: '3rem', marginBottom: '2rem' }}
          >
            Wat voor informatie kan ik vinden op dit portaal?
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Het online portaal biedt toegang tot alle raadsinformatie en een overzicht van alle
                evenementen binnen de gemeenteraad. Iedereen heeft toegang tot informatie die voor
                hem of haar belangrijk is: of u nu geïnteresseerd bent in wat er gebeurt op het
                gebied van veiligheid of milieu, of dat u graag wil weten wat er wordt besloten over
                uw wijk.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Raadsdocumenten bevatten een schat aan informatie. Dankzij het portaal kunt u de
                juiste raadsinformatie zoeken, vinden en opslaan. Eindelijk een online omgeving
                waarin u via een zoekmachine en een tijdslijn raadsinformatie makkelijk kunt vinden
                en gebruiken.
              </p>
            </div>
          </div>
          <hr id="3" />
          <a className="back-to-top" href="#top">
            <Glyphicon glyph="arrow-up" /> Back to top
          </a>
          <div
            style={{ fontSize: 22, fontWeight: 'bold', marginTop: '3rem', marginBottom: '2rem' }}
          >
            Wat betekent open data?
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Met open data wordt bedoeld het vrij beschikbaar stellen van informatie beschreven
                in licenties en gebruiksvoorwaarden. Doel is het gebruik er van optimaal te maken.
                Concreet betekend dit dat de data compleet en tijdig geleverd moet worden, direct
                afkomstig vanuit de bron, voor iedereen beschikbaar is, en automatische verwerkt kan
                worden - ofwel machine leesbaar.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Raadsdocumenten – zoals voorstellen, verslagen, moties en amendementen – zijn
                publieke informatie en dienen daarom ook beschikbaar te zijn voor iedereen. Helaas
                is dat vooralsnog zelden het geval. Alle aangesloten griffies hebben er voor gekozen
                om raadsdocumenten als open data aan te bieden.
              </p>
            </div>
          </div>
          <hr id="4" />
          <a className="back-to-top" href="#top">
            <Glyphicon glyph="arrow-up" /> Back to top
          </a>
          <div
            style={{ fontSize: 22, fontWeight: 'bold', marginTop: '3rem', marginBottom: '2rem' }}
          >
            Wat betekent open source?
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Als ontwikkelaar geven wij buitenstaanders toegang tot (een deel van){' '}
                <a target="_blank" href="https://github.com/zimmerman-zimmerman/RIS">
                  de broncode
                </a>. Open source software stelt programmeurs in staat om kosteloos een stuk van de
                broncode te hergebruiken of aan te passen. Open source oplossingen zijn daarom van
                iedereen. Als griffie ben je niet meer afhankelijk van één leverancier.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub-no-bold">
                Waarom doen we dit? Omdat wij ervan overtuigd zijn dat het portaal – die dankzij
                publiek geld tot stand is gekomen – in de kern beschikbaar moet zijn voor iedereen.
                In de praktijk betekend dit dat andere griffies het portaal gratis kunnen gebruiken
                en aanpassen. Een ander groot voordeel is dat dankzij andere ontwikkelaars en
                griffies het portaal zich sneller ontwikkeld en mogelijke problemen sneller worden
                opgelost. Bovendien kunnen extensies, plugins of andere componenten worden
                toegevoegd.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
