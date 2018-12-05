context('Forgot password', () => {
  it('Go to login page and request forgot password reset email', () => {
    cy.visit('/login');
    cy.wait(1000);
    cy.queryByText('Wachtwoord vergeten?').click({ force: true });
    cy.wait(1000);
    cy.get('#passResetEmailInput').type(Cypress.env('testUserEmail'));
    cy.wait(1000);
    cy.queryByText('Verzenden').parent().click();
    cy.wait(1000);
    cy.queryByText('Wachtwoord reset email is verzonden.').should('exist');
    cy.wait(1000);
  });
});
