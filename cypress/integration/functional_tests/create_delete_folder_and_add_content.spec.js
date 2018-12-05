context('Create/Delete personal folder and add content functionality', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Open "create folder" modal', () => {
    cy.wait(3000);
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Toevoegen aan folder').parentsUntil('.option-menu-item').last().click({ force: true });
    cy.wait(1000);
    cy.queryByText('Add new map').parentsUntil('.option-menu-item').last().click({ force: true });
    cy.wait(1000);
  });
  it('Create folder', () => {
    cy.get('#folder-name').type(Cypress.env('personalFolderName'), { force: true });
    cy.queryByText('Bewaren').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Pimpel Paars').click({ force: true });
    cy.queryByText('Afronden').click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', 'folders');
    cy.queryByText(Cypress.env('personalFolderName')).should('exist');
    cy.queryByText(Cypress.env('personalFolderName')).first().click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', 'folder');
  });
  it('Upload file', () => {
    cy.queryByText('Upload Document').parentsUntil('button').last().click({ force: true });
    cy.upload_file('dummy.pdf', '#file');
    cy.wait(3000);
  });
  it('Delete folder', () => {
    cy.get('.folderHeaderContainer').children().eq(2).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Verwijder').first().parentsUntil('.option-menu-item').last().click({ force: true });
    cy.wait(2000);
    cy.location('pathname').should('include', 'folders');
  });
  it('Log out', () => {
    cy.logout();
  });
});
