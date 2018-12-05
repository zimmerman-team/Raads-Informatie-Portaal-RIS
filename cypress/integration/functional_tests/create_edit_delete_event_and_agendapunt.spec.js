context('Create/Edit/Delete event/agenda item', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Open "create event" modal', () => {
    cy.get('#action-menu-button').click();
    cy.wait(1000);
    cy.queryByText('Nieuw evenement toevoegen').parent().click();
    cy.wait(1000);
    cy.get('.TextField-module-input').eq(0).focus();
    cy.get('.TextField-module-eventRow').eq(0).click();
    cy.get('.TextField-module-titleInput').eq(0).type(Cypress.env('testEventTitle'));
    cy.get('.TextField-module-titleInput').eq(1).type(Cypress.env('testEventLocation'));
    cy.get('.TextField-module-descriptionInput').type(Cypress.env('testEventDescription'));
    cy.get('.EventDate-module-datePicker').eq(0).children().eq(0).children().eq(0).click();
    cy.wait(1000);
    cy.queryByText('13').parent().click();
    cy.queryByText('OK').parent().parent().click();
    cy.get('.EventDate-module-datePicker').eq(1).children().eq(0).click();
    cy.wait(1000);
    cy.queryByText('OK').parent().parent().click();
    cy.wait(1000);
    cy.get('.EventModal-module-button').eq(1).click();
    cy.wait(1000);
    cy.queryByText('Agenda succesvol toegevoegd!').should('exist');
    cy.queryByText('Voeg nu de agenda items toe').click();
    cy.wait(2000);
    cy.location('pathname').should('include', 'evenement');
  });
  it('Add agenda item', () => {
    cy.queryByText('Nieuw agendapunt toevoegen').should('exist');
    cy.get('.TextField-module-titleInput').eq(0).type(Cypress.env('testEventAgendaItemTitle'));
    cy.get('.TextField-module-descriptionInput').type(Cypress.env('testEventAgendaItemDescription'));
    cy.wait(1000);
    cy.get('.TextField-module-input').eq(6).focus();
    cy.wait(3000);
    cy.get('.TextField-module-suggestionsList').eq(6).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-suggestionsList').eq(6).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-button').eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('.TextField-module-input').eq(7).focus();
    cy.wait(1000);
    cy.get('.DossierTreeView-module-addIcon').eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Toevoegen aan evenement').click();
    cy.wait(1000);
    cy.queryByText('Agendapunt succesvol toegevoegd!').should('exist');
  });
  it('Add Event related document', () => {
    cy.queryByText('Documenten toevoegen aan vergadering').click({ force: true });
    cy.get('.TextField-module-input').focus();
    cy.wait(2000);
    cy.get('.TextField-module-suggestionsList').children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-button').eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Toevoegen').click();
  });
  it('Delete Event related document', () => {
    cy.get('[data-cy=related-document-menu-testid]').eq(0).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Gerelateerde document verwijderen').click({ force: true });
    cy.wait(1000);
  });
  it('Delete agenda item document', () => {
    cy.get('.item-menu').eq(2).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Agendapunt document verwijderen').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Agendapunt item succesvol verwijderd!').should('exist');
  });
  it('Delete agenda item dossier', () => {
    cy.get('.item-menu').eq(3).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Agendapunt dossier verwijderen').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Agendapunt item succesvol verwijderd!').should('exist');
  });
  it('Edit agenda item', () => {
    cy.get('.item-menu').eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Bewerk agendapunt').click({ force: true });
    cy.wait(3000);
    cy.get('.TextField-module-titleInput').clear().type(Cypress.env('testEventAgendaItemTitle2'));
    cy.get('.TextField-module-descriptionInput').clear().type(Cypress.env('testEventAgendaItemDescription2'));
    cy.queryByText('Wijzigingen opslaan').click();
    cy.wait(2000);
    cy.queryByText('Agendapunt succesvol aangepast').should('exist');
    cy.wait(1000);
  });
  it('Delete agenda item', () => {
    cy.get('.item-menu').eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Agendapunt verwijderen').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Agendapunt succesvol verwijderd!').should('exist');
    cy.wait(1000);
  });
  it('Edit event', () => {
    cy.get('#action-menu-button').click();
    cy.queryByText('Bewerk Evenement').parent().click();
    cy.wait(1000);
    cy.get('.TextField-module-titleInput').eq(0).clear().type(Cypress.env('testEventTitle2'));
    cy.get('.TextField-module-titleInput').eq(1).clear().type(Cypress.env('testEventLocation2'));
    cy.get('.TextField-module-descriptionInput').clear().type(Cypress.env('testEventDescription2'));
    cy.queryByText('Wijzigingen opslaan').click();
    cy.wait(1000);
    cy.queryByText('Agenda succesvol bewerkt!').should('exist');
    cy.wait(1000);
  });
  it('Delete event', () => {
    cy.get('#action-menu-button').click();
    cy.queryByText('Evenement verwijderen').parent().click();
    cy.wait(1000);
  });
  it('Log out', () => {
    cy.logout();
  });
});
