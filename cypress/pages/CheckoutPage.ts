type Chainable = Cypress.Chainable<JQuery<HTMLElement>>;

class CheckoutPage {
  elements = {
    firstName: (): Chainable => cy.get('[data-test="firstName"]'),
    lastName: (): Chainable => cy.get('[data-test="lastName"]'),
    postalCode: (): Chainable => cy.get('[data-test="postalCode"]'),
    continueButton: (): Chainable => cy.get('[data-test="continue"]'),
    cancelButton: (): Chainable => cy.get('[data-test="cancel"]'),
    finishButton: (): Chainable => cy.get('[data-test="finish"]'),
    errorMessage: (): Chainable => cy.get('[data-test="error"]'),
    completeHeader: (): Chainable => cy.get(".complete-header"),
  };

  fillShippingInfo(
    firstName?: string,
    lastName?: string,
    postalCode?: string
  ): void {
    if (firstName) this.elements.firstName().type(firstName);
    if (lastName) this.elements.lastName().type(lastName);
    if (postalCode) this.elements.postalCode().type(postalCode);
  }

  continue(): void {
    this.elements.continueButton().click();
  }

  cancel(): void {
    this.elements.cancelButton().click();
  }

  finish(): void {
    this.elements.finishButton().click();
  }
}

export default new CheckoutPage();
