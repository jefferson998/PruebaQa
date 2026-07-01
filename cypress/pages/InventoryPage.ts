type Chainable = Cypress.Chainable<JQuery<HTMLElement>>;

class InventoryPage {
  elements = {
    addToCartButton: (sku: string): Chainable =>
      cy.get(`[data-test="add-to-cart-${sku}"]`),
    removeButton: (sku: string): Chainable =>
      cy.get(`[data-test="remove-${sku}"]`),
    cartLink: (): Chainable => cy.get('[data-test="shopping-cart-link"]'),
    cartBadge: (): Chainable => cy.get(".shopping_cart_badge"),
    sortContainer: (): Chainable =>
      cy.get('[data-test="product-sort-container"]'),
    itemPrices: (): Chainable => cy.get(".inventory_item_price"),
    burgerMenuButton: (): Chainable => cy.get("#react-burger-menu-btn"),
    logoutLink: (): Chainable => cy.get("#logout_sidebar_link"),
  };

  addProduct(sku: string): void {
    this.elements.addToCartButton(sku).click();
  }

  removeProduct(sku: string): void {
    this.elements.removeButton(sku).click();
  }

  goToCart(): void {
    this.elements.cartLink().click();
  }

  sortBy(criterion: string): void {
    this.elements.sortContainer().select(criterion);
  }

  logout(): void {
    this.elements.burgerMenuButton().click();
    this.elements.logoutLink().should("be.visible").click();
  }
}

export default new InventoryPage();
