type Chainable = Cypress.Chainable<JQuery<HTMLElement>>;

class LoginPage {
  elements = {
    usernameInput: (): Chainable => cy.get("#user-name"),
    passwordInput: (): Chainable => cy.get("#password"),
    loginButton: (): Chainable => cy.get("#login-button"),
    errorMessage: (): Chainable => cy.get('[data-test="error"]'),
    pageTitle: (): Chainable => cy.get(".title"),
  };

  visit(url = "/"): void {
    cy.visit(url);
  }

  typeUsername(username?: string): void {
    if (username) {
      this.elements.usernameInput().type(username);
    }
  }

  typePassword(password?: string): void {
    if (password) {
      this.elements.passwordInput().type(password, { log: false });
    }
  }

  submit(): void {
    this.elements.loginButton().click();
  }

  login(username?: string, password?: string): void {
    this.visit();
    this.typeUsername(username);
    this.typePassword(password);
    this.submit();
  }
}

export default new LoginPage();
