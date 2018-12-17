context('Create/Edit/Delete user', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Open "create user" modal', () => {
    cy.get('#action-menu-button').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Nieuwe gebruiker toevoegen').parent().click({ force: true });
    cy.wait(1000);
    cy.get('.ModalDropDown-module-dropDown').eq(0).click();
    cy.get('.ModalDropDown-module-dropDownItem').eq(0).click({ force: true });
    cy.get('.ModalTextField-module-input').eq(0).type(Cypress.env('testUserName'));
    cy.get('.ModalTextField-module-input').eq(1).type(Cypress.env('testUserSurname'));
    cy.get('.ModalTextField-module-input').eq(2).type(Cypress.env('testUserEmail'));
    cy.wait(1000);
    cy.get('.PublisherModal-module-button').eq(1).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Door de gebruiker gemaakte activeringslink naar hen verzonden').should('exist');
  });
  it('Edit user', () => {
    cy.navMenuItemClick(13, 'griffie');
    cy.wait(1000);
    cy.get('.sort-by-menu').children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Datum aflopend').click({ force: true });
    cy.get('#content-wrap').click();
    cy.wait(1000);
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Bewerk gebruiker').click({ force: true });
    cy.get('.ModalDropDown-module-dropDown').eq(0).click();
    cy.get('.ModalDropDown-module-dropDownItem').eq(1).click({ force: true });
    cy.get('.ModalTextField-module-input').eq(1).clear().type(Cypress.env('testUserSurname2'));
    cy.wait(1000);
    cy.get('.PublisherModal-module-button').eq(1).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Gebruiker succesvol bewerkt').should('exist');
  });
  it('Delete user', () => {
    cy.get('.sort-by-menu').children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Datum aflopend').click({ force: true });
    cy.get('#content-wrap').click();
    cy.wait(1000);
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Verwijder Gebruiker').click({ force: true });
    cy.wait(1000);
  });
  it('Log out', () => {
    cy.logout();
  });
});
