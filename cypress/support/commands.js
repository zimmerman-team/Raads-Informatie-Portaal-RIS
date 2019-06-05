import 'cypress-testing-library/add-commands';

Cypress.Commands.add('login', (u = Cypress.env('username'), p = Cypress.env('password')) => {
  cy.contains('Login/Registreren').click();
  cy.wait(1000);
  cy.get('#usernameInput').type(u);
  cy.get('#passwordInput').type(p);
  cy
    .contains('Log in')
    .first()
    .focus()
    .click();
  cy.wait(1000);
});

Cypress.Commands.add('logout', () => {
  cy.contains('Logout').click();
  cy.wait(1000);
  cy.queryByText('Succesvol afgemeld').should('exist');
});

Cypress.Commands.add('navMenuItemClick', (index, route) => {
  cy
    .get('.main-nav > ul > li')
    .eq(index)
    .children('div')
    .children('.menu-item')
    .children()
    .click({ force: true });
  cy.wait(1000);
  cy.location('pathname').should('include', route);
  cy.wait(2000);
});

Cypress.Commands.add('upload_file', (fileName, selector) => {
  cy.get(selector).then(subject => {
    cy.fixture(fileName, 'base64').then(content => {
      const el = subject[0];
      const blob = b64toBlob(content);
      const testFile = new File([blob], fileName);
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
    });
  });
});

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  blob.lastModifiedDate = new Date();
  return blob;
}
