import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../pages/LoginPage";

Given("el usuario esta en la pagina de login de SauceDemo", () => {
  LoginPage.visit();
});

When(
  "el usuario ingresa el usuario {string} y la contrasena valida",
  (username: string) => {
    LoginPage.typeUsername(username);
    LoginPage.typePassword(Cypress.env("validPassword"));
  }
);

When(
  "el usuario ingresa el usuario {string} y la contrasena {string}",
  (username: string, password: string) => {
    LoginPage.typeUsername(username);
    LoginPage.typePassword(password);
  }
);

When("hace clic en el boton de login", () => {
  LoginPage.submit();
});

Then("el usuario es redirigido a la pagina de productos", () => {
  cy.url().should("include", "/inventory.html");
});

Then("el titulo de la pagina muestra {string}", (expectedTitle: string) => {
  LoginPage.elements.pageTitle().should("have.text", expectedTitle);
});

Then("se muestra el mensaje de error de login {string}", (expectedMessage: string) => {
  LoginPage.elements
    .errorMessage()
    .should("be.visible")
    .and("contain.text", expectedMessage);
});

Then("el usuario permanece en la pagina de login", () => {
  cy.url().should("eq", "https://www.saucedemo.com/");
});
