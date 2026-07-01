import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../pages/LoginPage";
import InventoryPage from "../../pages/InventoryPage";
import CartPage from "../../pages/CartPage";
import CheckoutPage from "../../pages/CheckoutPage";

Given("el usuario ha iniciado sesion en SauceDemo", () => {
  LoginPage.login(Cypress.env("validUser"), Cypress.env("validPassword"));
  cy.url().should("include", "/inventory.html");
});

When("agrega el producto {string} al carrito", (sku: string) => {
  InventoryPage.addProduct(sku);
});

When("elimina el producto {string} del carrito", (sku: string) => {
  InventoryPage.removeProduct(sku);
});

When("va al carrito de compras", () => {
  InventoryPage.goToCart();
  cy.url().should("include", "/cart.html");
});

When("ordena los productos por {string}", (criterion: string) => {
  InventoryPage.sortBy(criterion);
});

When("cierra sesion desde el menu lateral", () => {
  InventoryPage.logout();
});

Then("el contador del carrito no es visible", () => {
  InventoryPage.elements.cartBadge().should("not.exist");
});

Then("el contador del carrito muestra {string}", (count: string) => {
  InventoryPage.elements.cartBadge().should("have.text", count);
});

Then("el carrito queda vacio", () => {
  InventoryPage.elements.cartBadge().should("not.exist");
});

Then("los precios quedan ordenados de forma {string}", (orden: string) => {
  InventoryPage.elements.itemPrices().then(($prices: JQuery<HTMLElement>) => {
    const precios = [...$prices].map((el) =>
      parseFloat(el.innerText.replace("$", ""))
    );
    const esperado =
      orden === "ascendente"
        ? [...precios].sort((a, b) => a - b)
        : [...precios].sort((a, b) => b - a);
    expect(precios).to.deep.equal(esperado);
  });
});

Then("el usuario es redirigido a la pagina de login", () => {
  cy.url().should("eq", "https://www.saucedemo.com/");
  cy.get("#login-button").should("be.visible");
});


Then("el carrito muestra el producto {string}", (productName: string) => {
  cy.contains(productName).should("be.visible");
});

Then("el carrito no muestra el producto {string}", (productName: string) => {
  cy.contains(".cart_item", productName).should("not.exist");
});

Then("el carrito esta vacio", () => {
  CartPage.elements.cartItems().should("not.exist");
});

When("procede al checkout", () => {
  CartPage.checkout();
});

Then("el usuario regresa al carrito de compras", () => {
  cy.url().should("include", "/cart.html");
});


When(
  "completa los datos de envio con nombre {string}, apellido {string} y codigo postal {string}",
  (firstName: string, lastName: string, postalCode: string) => {
    CheckoutPage.fillShippingInfo(firstName, lastName, postalCode);
  }
);

When("continua al resumen de la compra", () => {
  CheckoutPage.continue();
});

When("cancela el checkout", () => {
  CheckoutPage.cancel();
});

When("finaliza la compra", () => {
  CheckoutPage.finish();
});

Then("el usuario llega al formulario de datos de envio", () => {
  cy.url().should("include", "/checkout-step-one.html");
});

Then("el usuario permanece en el formulario de datos de envio", () => {
  cy.url().should("include", "/checkout-step-one.html");
});

Then("el resumen muestra el producto {string}", (productName: string) => {
  cy.url().should("include", "/checkout-step-two.html");
  cy.contains(productName).should("be.visible");
});

Then("se muestra el mensaje {string}", (mensaje: string) => {
  cy.url().should("include", "/checkout-complete.html");
  CheckoutPage.elements.completeHeader().should("have.text", mensaje);
});

Then("se muestra el mensaje de error de checkout {string}", (mensaje: string) => {
  CheckoutPage.elements
    .errorMessage()
    .should("be.visible")
    .and("contain.text", mensaje);
});
