context('Add/Delete favorite functionality', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Add favorite', () => {
    cy.wait(3000);
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Toevoegen aan favorieten').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Item toegevoegd aan favorieten').should('exist');
  });
  it('Go to my favorites page', () => {
    cy.navMenuItemClick(8, 'favorieten');
    cy.wait(2000);
    cy.get('.title-div').eq(0).children().eq(0).click({ force: true });
    cy.wait(3000);
    cy.location('pathname').should('not.include', 'favorieten');
  });
  it('Delete favorite', () => {
    cy.navMenuItemClick(8, 'favorieten');
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Verwijderen uit favorieten').click({ force: true });
    cy.wait(1000);
  });
  it('Log out', () => {
    cy.logout();
  });
});
