context('Add/Edit/Delete notification', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login();
  });
  it('Go to search page', () => {
    cy.navMenuItemClick(2, 'zoeken');
  });
  it('Add notification', () => {
    cy.wait(3000);
    cy.get('.item-menu').eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.queryByText('Stel notificatie in').click({ force: true });
    cy.wait(1000);
    cy.queryByText('Notificatie succesvol toegevoegd.').should('exist');
  });
  it('Go to my notifications page', () => {
    cy.navMenuItemClick(6, 'notificaties');
  });
  it('Edit notification', () => {
    cy.get('.rt-tbody').children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(2000);
    cy.queryByText('Notificatie gedeactiveerd').should('exist');
    cy.get('.rt-tbody').children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).click({ force: true });
    cy.wait(2000);
    cy.queryByText('Notificatie geactiveerd').should('exist');
  });
  it('Delete notification', () => {
    cy.get('.MyNotifications-module-checkbox').children().eq(0).children().eq(0).click({ force: true });
    cy.wait(1000);
    cy.get('#my-notifications-delete-btn').click();
  });
  it('Log out', () => {
    cy.logout();
  });
});
