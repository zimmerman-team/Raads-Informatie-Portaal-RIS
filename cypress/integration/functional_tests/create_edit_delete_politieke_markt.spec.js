let date = 14;
context('Create/Edit/Delete Politieke Markt (event with rooms)', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Find calendar date without PM', () => {
    const now = new Date();
    const start = `${now.getFullYear()}-${now.getMonth() + 1}-${date}`;
    const end = `${now.getFullYear()}-${now.getMonth() + 1}-${date + 1}`;
    cy.request(`${Cypress.env('backendUrl')}/api/combined/?item_type=event,child_event&start_date=${start}&end_date=${end}&q=Politieke Markt`)
      .then(res => {
        if (res.body.count > 0) {
          date++;
        }
      });
  });
  it('Open "create event" modal', () => {
    cy.get('#action-menu-button').click();
    cy.wait(1000);
    cy.queryByText('Nieuw evenement toevoegen').parent().click();
    cy.wait(1000);
    cy.get('.TextField-module-input').eq(0).focus();
    cy.get('.TextField-module-eventRow').eq(1).click();
    cy.get('.EventDate-module-datePicker').eq(0).children().eq(0).children().eq(0).click();
    cy.wait(1000);
    cy.queryByText(date.toString()).parent().click();
    cy.queryByText('OK').parent().parent().click();
    cy.get('.EventDate-module-datePicker').eq(1).children().eq(0).click();
    cy.wait(1000);
    cy.queryByText('OK').parent().parent().click();
    cy.wait(1000);
    cy.queryByText('Toevoegen').click({ force: true });
    cy.wait(3000);
    cy.queryByText('Agenda succesvol toegevoegd!').should('exist');
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
  });
  it('Commit search query', () => {
    cy.get('#searchBar').type('Politieke Markt', { force: true });
    cy.get('.search-btn').click({ force: true });
    cy.wait(3000);
    cy.queryByText('Zoekterm: Politieke Markt').should('exist');
  });
  it('Find and click the event created', () => {
    cy.get('.title-div').eq(0).children().click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', '/evenement');
    cy.wait(3000);
  });
  it('Add agenda item to room', () => {
    cy.get('.RoomTile-module-addAgendaItemBtn').eq(0).click({ force: true });
    cy.wait(1000);
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
    cy.wait(3000);
    cy.get('.DossierTreeView-module-addIcon').eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Toevoegen aan evenement').click();
    cy.wait(1000);
    cy.queryByText('Agendapunt succesvol toegevoegd!').should('exist');
  });
  it('Delete agenda item from room', () => {
    cy.get('.agenda-list-item').eq(0).children().eq(1).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Agendapunt verwijderen').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Agendapunt succesvol verwijderd!').should('exist');
  });
  it('Edit event', () => {
    cy.get('#action-menu-button').click();
    cy.queryByText('Bewerk Evenement').parent().click();
    cy.wait(1000);
    cy.get('.RoomSelection-module-checkbox').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.queryByText('Wijzigingen opslaan').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Agenda succesvol bewerkt!').should('exist');
    cy.wait(1000);
    cy.queryByText('Plenair').should('not.exist');
  });
  it('Delete event', () => {
    cy.wait(1000);
    cy.get('#action-menu-button').click();
    cy.queryByText('Evenement verwijderen').parent().click();
    cy.wait(1000);
  });
  it('Log out', () => {
    cy.logout();
  });
});
