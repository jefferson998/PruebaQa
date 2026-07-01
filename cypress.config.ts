import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  allureWriter(on, config);

  return config;
}

export default defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents,
    env: {
      baseUrl: "https://www.saucedemo.com",
      allure: true,
      allureResultsPath: "allure-results",
      validUser: "standard_user",
      validPassword: "secret_sauce",
      invalidPassword: "wrong_password",
      CHECKOUT_FIRST_NAME: "Usuario",
      CHECKOUT_LAST_NAME: "Prueba",
      CHECKOUT_POSTCODE: "110111",
    },
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    video: true,
    screenshotOnRunFailure: true,
  },
});
