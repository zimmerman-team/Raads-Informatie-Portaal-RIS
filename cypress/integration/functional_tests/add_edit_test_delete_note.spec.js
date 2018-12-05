context('Add/Edit/Test/Delete note', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Add "Documenten" filter', () => {
    cy.get('.filters-label').click({ force: true });
    cy.queryByText('Type Raadsdocument').click();
    cy.wait(3000);
    cy.get('.options-div > div').eq(1).children().eq(0).click({ force: true });
    cy.contains('Toon').click();
    cy.wait(1000);
    cy.queryByText('Type: Documenten').should('exist');
  });
  it('Go to document detail page', () => {
    cy.get('.title-cell').first().children().eq(1).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', 'document');
  });
  it('Open "create note" modal', () => {
    cy.get('#action-menu-button').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Notitie toevoegen aan dit document').parent().click({ force: true });
    cy.wait(1000);
    cy.get('#note-title').type(Cypress.env('testNoteTitle'));
    cy.get('#note-description').type(Cypress.env('testNoteContent'));
    cy.queryByText('Notitie toevoegen').parent().click({ force: true });
  });
  it('Test note', () => {
    cy.queryByText(Cypress.env('testNoteTitle')).click({ force: true });
    cy.queryByText('Mijn notitie bewerken').should('exist');
    cy.get('#note-title').should('have.value', Cypress.env('testNoteTitle'));
    cy.queryByText('Annuleren').parent().click({ force: true });
  });
  it('Go to my notes page', () => {
    cy.navMenuItemClick(11, 'mijn_notities');
  });
  it('Edit note', () => {
    cy.get('.small-cell').first().children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Notitie bewerken').click({ force: true });
    cy.queryByText('Mijn notitie bewerken').should('exist');
    cy.get('#note-title').clear().type(Cypress.env('testNoteTitle2'));
    cy.get('#note-description').clear().type(Cypress.env('testNoteContent2'));
    cy.queryByText('Notitie opslaan').parent().click({ force: true });
    cy.wait(3000);
  });
  it('Delete note', () => {
    cy.get('.small-cell').first().children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Notitie verwijderen').click({ force: true });
    cy.queryByText('Opmerking verwijderd').should('exist');
    cy.wait(1000);
  });
  it('Log out', () => {
    cy.logout();
  });
});
