context('Add/Test/Delete my agenda', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Add "Agenda punt" filter', () => {
    cy.get('.filters-label').click({ force: true });
    cy.queryByText('Type Raadsdocument').click();
    cy.wait(1000);
    cy.get('.options-div > div').eq(0).children().eq(0).click({ force: true });
    cy.contains('Toon').click();
    cy.wait(1000);
    cy.queryByText('Type: Agenda punten').should('exist');
  });
  it('Add my agenda', () => {
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Toevoegen aan persoonlijke agenda').click({ force: true });
    cy.wait(1000);
  });
  it('Go to my agenda page', () => {
    cy.navMenuItemClick(10, 'mijn_kalender');
  });
  it('Test my agenda', () => {
    cy.get('.title-div').first().children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', 'evenement');
    cy.wait(15000);
  });
  it('Go to my agenda page', () => {
    cy.navMenuItemClick(10, 'mijn_kalender');
  });
  it('Delete my agenda', () => {
    cy.get('.rt-tbody').children().eq(0).children().eq(0).children().eq(4).children().eq(0).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Evenement verwijderen').click({ force: true });
    cy.wait(1000);
    cy.queryByText("Item verwijderd van mijn agenda's").should('exist');
  });
  it('Log out', () => {
    cy.logout();
  });
});
