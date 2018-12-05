context('Save/Test/Delete search query functionality', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Commit search query', () => {
    cy.get('#searchBar').type(Cypress.env('searchKeyword'), { force: true });
    cy.get('.search-btn').click({ force: true });
    cy.wait(1000);
    cy.queryByText(`Zoekterm: ${Cypress.env('searchKeyword')}`).should('exist');
  });
  it('Open "save search query" modal', () => {
    cy.get('#action-menu-button').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Bewaar huidige zoekopdracht').parent().click({ force: true });
    cy.get('#search-query-input').type(Cypress.env('testSearchQuery'), { force: true });
    cy.get('#search-query-submit-btn').click({ force: true });
    cy.wait(2000);
    cy.queryByText('Zoek zoekopdracht is succesvol opgeslagen').should('exist');
  });
  it('Go to my queries page', () => {
    cy.navMenuItemClick(7, 'bewaarde_zoekopdrachten');
  });
  it('Test search query', () => {
    cy.get('.title-cell').first().children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', 'zoeken');
    cy.queryByText(`Zoekterm: ${Cypress.env('searchKeyword')}`).should('exist');
  });
  it('Go to my queries page', () => {
    cy.navMenuItemClick(7, 'bewaarde_zoekopdrachten');
  });
  it('Delete search query', () => {
    cy.get('.title-cell').first().children().eq(1).click({ force: true });
    cy.wait(1000);
  });
  it('Log out', () => {
    cy.logout();
  });
});
