context('Create/Edit/Delete document', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Open "create document" modal', () => {
    cy.get('#action-menu-button').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Raadsdocument uploaden').parent().click({ force: true });
    cy.wait(1000);
    cy.upload_file('dummy.pdf', '.DocumentModal-module-uploadBoxInput');
    cy.wait(3000);
    cy.get('.TextField-module-input').eq(1).focus();
    cy.get('.TextField-module-suggestionsList').eq(1).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-input').eq(2).focus();
    cy.get('.TextField-module-suggestionsList').eq(2).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-input').eq(3).focus();
    cy.get('.TextField-module-suggestionsList').eq(3).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-input').eq(4).focus();
    cy.get('.TextField-module-suggestionsList').eq(4).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('.TextField-module-input').eq(5).focus();
    cy.get('.DossierTreeView-module-addIcon').eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('.DocumentModal-module-button').eq(1).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Bestand geupload').should('exist');
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Commit search query', () => {
    cy.get('#searchBar').type('dummy', { force: true });
    cy.get('.search-btn').click({ force: true });
    cy.wait(4000);
    cy.queryByText('Zoekterm: dummy').should('exist');
  });
  it('Edit document', () => {
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Bewerk document').click({ force: true });
    cy.wait(2000);
    cy.get('.TextField-module-input').eq(1).focus();
    cy.get('.TextField-module-suggestionsList').eq(1).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-input').eq(2).focus();
    cy.get('.TextField-module-suggestionsList').eq(2).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-input').eq(3).focus();
    cy.get('.TextField-module-suggestionsList').eq(3).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.get('.TextField-module-input').eq(4).focus();
    cy.get('.TextField-module-suggestionsList').eq(4).children().eq(1).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(2000);
    cy.get('.DocumentModal-module-button').eq(1).click({ force: true });
    cy.wait(2000);
    cy.queryByText('succesvol geupdatet').should('exist');
  });
  it('Delete document', () => {
    cy.wait(1000);
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Document verwijderen').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Document succesvol verwijderd').should('exist');
  });
  it('Log out', () => {
    cy.logout();
  });
});
