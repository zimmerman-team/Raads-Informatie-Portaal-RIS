import React from 'react';
import appResources from '../appResources';

export default class Contact extends React.Component {
  componentDidMount() {
    document.querySelector('#content-wrap').scrollTop = 0;
    document.title = `${appResources.documentTitle} | Contact`;
  }

  render() {
    return (
      <div className="main-no-top-padding content-contact">
        <div className="about-container">
          <div className="notesHeaderTitle">CONTACT</div>
          <br />
          <hr />
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12">
              <p className="about-sub">
                Voor vragen en of andere mededelingen over het raadsinformatie portaal kunt u
                contact opnemen met De raadsgriffie van {appResources.municipality}.
                <br />
                <br />
                Raadsgriffie {appResources.municipality}
                <br />
                {appResources.contact.address1}
                {appResources.contact.address1 && <br />}
                {appResources.contact.address2}
                {appResources.contact.address2 && <br />}
                {appResources.contact.address3}
                {appResources.contact.address3 && <br />}
                Telefoon: {appResources.contact.telephone}
                <br />
                E-mail: <a href={appResources.contact.email}>{appResources.contact.email}</a>
                <br />
                {appResources.contact.twitter && (
                  <span>
                    Twitter:{' '}
                    <a href={appResources.contact.twitter.link}>
                      {appResources.contact.twitter.name}
                    </a>
                    <br />
                  </span>
                )}
                {appResources.contact.facebook && (
                  <span>
                    Facebook:{' '}
                    <a href={appResources.contact.facebook.link}>
                      {appResources.contact.facebook.name}
                    </a>
                    <br />
                  </span>
                )}
                {appResources.contact.instangram && (
                  <span>
                    Instagram:{' '}
                    <a href={appResources.contact.instangram.link}>
                      {appResources.contact.instangram.name}
                    </a>
                    <br />
                  </span>
                )}
                {appResources.contact.youtube && (
                  <span>
                    Youtube:{' '}
                    <a href={appResources.contact.youtube.link}>
                      {appResources.contact.youtube.name}
                    </a>
                    <br />
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
