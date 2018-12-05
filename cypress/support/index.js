import './commands';

afterEach(function() {
  if (this.currentTest.state === 'failed') {
    Cypress.runner.stop()
  }
});
