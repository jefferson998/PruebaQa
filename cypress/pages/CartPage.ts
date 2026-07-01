type Chainable = Cypress.Chainable<JQuery<HTMLElement>>;

class CartPage {
  elements = {
    cartItems: (): Chainable => cy.get(".cart_item"),
    checkoutButton: (): Chainable => cy.get('[data-test="checkout"]'),
  };

  checkout(): void {
    this.elements.checkoutButton().click();
  }
}

export default new CartPage();
