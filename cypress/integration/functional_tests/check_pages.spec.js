context('Checking if pages are loaded', () => {
  it('Go to home', () => {
    cy.visit('/');
    cy.wait(1000);
  });
  it('Go to searchpage', () => {
    cy.visit('/zoeken');
    cy.wait(1000);
  });
  it('Go to calendar', () => {
    cy.visit('/agenda');
    cy.wait(2000);
  });
  it('Go to public-dossiers', () => {
    cy.visit('/publieke-dossiers');
    cy.wait(1000);
  });
  it('Go to public-dossiers-detail', () => {
    cy.visit('/publieke-dossiers/1');
    cy.wait(1000);
  });
  it('Go to document detail', () => {
    cy.visit('/document/0/1');
    cy.wait(1000);
  });
  it('Go to event detail', () => {
    cy.visit('/evenement/1');
    cy.wait(3000);
  });
  it('Go to my notifications', () => {
    cy.login();
    cy.visit('/notificaties');
    cy.wait(1000);
    cy.logout();
  });
  it('Go to my queries', () => {
    cy.login();
    cy.visit('/bewaarde_zoekopdrachten');
    cy.wait(1000);
    cy.logout();
  });
  it('Go to my favorites', () => {
    cy.login();
    cy.visit('/favorieten');
    cy.wait(1000);
    cy.logout();
  });
  it('Go to my folders', () => {
    cy.login();
    cy.visit('/folders');
    cy.wait(1000);
    cy.logout();
  });
  it('Go to my my_agenda', () => {
    cy.login();
    cy.visit('/mijn_kalender');
    cy.wait(1000);
    cy.logout();
  });
  it('Go to my my-notes', () => {
    cy.login();
    cy.visit('/mijn_notities');
    cy.wait(1000);
    cy.logout();
  });
  it('Go to my profile', () => {
    cy.login();
    cy.visit('/profiel');
    cy.wait(1000);
    cy.logout();
  });
});
