context('Create/Edit/Delete public dossier', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Open "create public dossier" modal', () => {
    cy.get('#action-menu-button').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Dossier toevoegen').parent().click({ force: true });
    cy.wait(1000);
    cy.get('.TextField-module-titleInput').type(Cypress.env('testPublicDossierTitle'));
    cy.get('.TextField-module-input').eq(1).focus();
    cy.wait(5000);
    cy.get('.TextField-module-suggestionsList').eq(1).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-suggestionsList').eq(1).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-button').eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('.TextField-module-input').eq(2).focus();
    cy.get('.DossierTreeView-module-addIcon').eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('.TextField-module-arrowIcon').eq(1).click({ force: true });
    cy.wait(1000);
    cy.get('.PublisherModal-module-button').eq(1).click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', 'publieke-dossier');
    cy.wait(1000);
    cy.queryByText('Dossier succesvol toegevoegd!').should('exist');
  });
  it('Edit public dossier', () => {
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Bewerk dossier').click({ force: true });
    cy.wait(3000);
    cy.get('.TextField-module-titleInput').clear().type(Cypress.env('testPublicDossierTitle2'));
    cy.wait(1000);
    cy.get('.TextField-module-removeIcon').eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('.PublisherModal-module-button').eq(1).click({ force: true });
    cy.wait(2000);
    cy.queryByText('Dossier succesvol bijgewerkt!').should('exist');
  });
  it('Delete public dossier', () => {
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Verwijder dossier').click({ force: true });
    cy.wait(2000);
    cy.queryByText('Dossier succesvol verwijderd').should('exist');
  });
  it('Log out', () => {
    cy.logout();
  });
});
