context('Edit/Delete profile', () => {
  it('Login', () => {
    cy.visit('/');
    cy.login(Cypress.env('deleteUsername'), Cypress.env('deletePassword'));
  });
  it('Go to profile page', () => {
    cy.navMenuItemClick(12, 'profiel');
  });
  it('Edit profile', () => {
    cy.get('#uname_input').clear().type(Cypress.env('deleteUsername2'));
    cy.get('#current_pass_input').clear().type(Cypress.env('deletePassword'));
    cy.get('#new_pass_input').clear().type(Cypress.env('deletePassword2'));
    cy.get('#new_pass_2_input').clear().type(Cypress.env('deletePassword2'));
    cy.queryByText('Updates Bewaren').parent().click({ force: true });
    cy.wait(1000);
    cy.queryByText('Profielgegevens worden succesvol bijgewerkt.').should('exist');
    cy.wait(1000);
    cy.reload();
    cy.wait(3000);
  });
  it('Edit profile with initial credentials', () => {
    cy.get('#uname_input').clear().type(Cypress.env('deleteUsername'));
    cy.get('#current_pass_input').clear().type(Cypress.env('deletePassword2'));
    cy.get('#new_pass_input').clear().type(Cypress.env('deletePassword'));
    cy.get('#new_pass_2_input').clear().type(Cypress.env('deletePassword'));
    cy.queryByText('Updates Bewaren').parent().click({ force: true });
    cy.wait(1000);
    cy.queryByText('Profielgegevens worden succesvol bijgewerkt.').should('exist');
    cy.wait(1000);
    cy.reload();
    cy.wait(3000);
  });
  // Commented this cause every time we run this test
  // task then validated test user needs to be created manually
  // it('Delete profile', () => {
  //   cy.get('.delete-profile-txt').click({ force: true });
  //   cy.wait(1000);
  //   cy.queryByText('Ja').parent().click({ force: true });
  //   cy.wait(1000);
  //   cy.queryByText('Account verwijderd').should('exist');
  // });
});
