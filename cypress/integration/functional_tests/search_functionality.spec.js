context('Test general search functionality', () => {
  it('Go to search page', () => {
    cy.visit('/');
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Commit search query', () => {
    cy.get('#searchBar').type(Cypress.env('searchKeyword'), { force: true });
    cy.get('.search-btn').click({ force: true });
    cy.wait(1000);
    cy.queryByText(`Zoekterm: ${Cypress.env('searchKeyword')}`).should('exist');
  });
  it('Add filter', () => {
    cy.get('.filters-label').click({ force: true });
    cy.queryByText('Type Raadsdocument').click();
    cy.wait(1000);
    cy.get('.options-div > div').eq(1).children().eq(0).click({ force: true });
    cy.contains('Toon').click();
    cy.wait(1000);
    cy.queryByText('Type: Documenten').should('exist');
  });
  it('Clear filters', () => {
    cy.get('.remove-filters-span').click({ force: true });
    cy.wait(3000);
  });
  it('Change views', () => {
    cy.queryByText('Tijdslijn').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Lijst').click({ force: true });
    cy.wait(1000);
  });
  it('Change sorting', () => {
    cy.get('.sort-by-menu').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Naam a/z').click({ force: true });
    cy.get('#content-wrap').click();
  });
  it('Click on 2nd page', () => {
    cy.get('#content-wrap').scrollTo('bottom');
    cy.wait(1000);
    cy.get('.pagination > li').eq(3).click({ force: true });
    cy.wait(1000);
  });
});
