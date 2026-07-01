import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
const { allureCypress } = require("allure-cypress/reporter");

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

  allureCypress(on, config, {
    resultsDir: "allure-results",
  });

  return config;
}

export default defineConfig({
  allowCypressEnv: true,
  video: true,
  videoCompression: 32,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents,
    env: {
      baseUrl: "https://www.saucedemo.com",
      validUser: "standard_user",
      validPassword: "secret_sauce",
      invalidPassword: "wrong_password",
      CHECKOUT_FIRST_NAME: "Usuario",
      CHECKOUT_LAST_NAME: "Prueba",
      CHECKOUT_POSTCODE: "110111",
      reqresApiKey: "demo_key",
      reqresProjectId: "demo_project",
      reqresEnv: "dev",
      apiBaseUrl: "https://reqres.in/api",
      apiCollectionsUrl: "https://reqres.in/api",
    },
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    screenshotOnRunFailure: true,
  },
});
