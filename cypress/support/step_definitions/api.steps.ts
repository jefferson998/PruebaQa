import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

const baseUrl = (): string => Cypress.env("apiBaseUrl");

const apiHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const apiKey = Cypress.env("reqresApiKey");
  const reqresEnv = Cypress.env("reqresEnv");
  if (!apiKey) {
    throw new Error(
      "Falta configurar Cypress.env('reqresApiKey'). Crea cypress.env.json a partir de cypress.env.json.example, o exporta CYPRESS_reqresApiKey."
    );
  }
  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "X-Reqres-Env": reqresEnv || "dev",
    ...extra,
  };
}

const logRequest = (method: string, url: string, body?: any, headers?: any) => {
  cy.allure().step(`${method} ${url}`, false);
  cy.allure().parameter("Method", method);
  cy.allure().parameter("URL", url);
  if (headers) {
    const safeHeaders = { ...headers };
    if (safeHeaders["x-api-key"]) {
      safeHeaders["x-api-key"] = "***REDACTED***";
    }
    cy.allure().parameter("Headers", JSON.stringify(safeHeaders, null, 2));
  }
  if (body) {
    cy.allure().attachment("Request Body", JSON.stringify(body, null, 2), "application/json");
  }
}

const logResponse = (response: any) => {
  cy.allure().parameter("Status", response.status);
  cy.allure().parameter("Status Text", response.statusText);
  cy.allure().attachment("Response Body", JSON.stringify(response.body, null, 2), "application/json");
}

When(
  "se envia una peticion POST a {string} con el siguiente cuerpo:",
  (endpoint: string, body: string) => {
    const projectId = Cypress.env("reqresProjectId");
    const url = endpoint.includes("?") 
      ? `${baseUrl()}${endpoint}&project_id=${projectId}`
      : `${baseUrl()}${endpoint}?project_id=${projectId}`;
    const headers = apiHeaders();
    const parsedBody = JSON.parse(body);
    logRequest("POST", url, parsedBody, headers);
    cy.request({
      method: "POST",
      url,
      headers,
      body: parsedBody,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("response");
    });
  }
);

When(
  "se envia una peticion POST a {string} con nombre {string} y cargo {string}",
  (endpoint: string, name: string, job: string) => {
    const projectId = Cypress.env("reqresProjectId");
    const url = endpoint.includes("?") 
      ? `${baseUrl()}${endpoint}&project_id=${projectId}`
      : `${baseUrl()}${endpoint}?project_id=${projectId}`;
    const headers = apiHeaders();
    const body = { data: { name, job } };
    logRequest("POST", url, body, headers);
    cy.request({
      method: "POST",
      url,
      headers,
      body,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("response");
    });
  }
);

When("se realiza una peticion GET al usuario recien creado", () => {
  cy.get("@response").then((response: any) => {
    const userId = response.body.data.id || response.body.id;
    const projectId = Cypress.env("reqresProjectId");
    const url = `${baseUrl()}/collections/users/records/${userId}?project_id=${projectId}`;
    const headers = apiHeaders();
    logRequest("GET", url, undefined, headers);
    cy.request({
      method: "GET",
      url,
      headers,
      failOnStatusCode: false,
    }).then((getResponse) => {
      logResponse(getResponse);
      cy.wrap(getResponse).as("getResponse");
    });
    const createdData = response.body.data.data || response.body.data || response.body;
    cy.wrap(createdData).as("createdBody");
  });
});

When("se realiza una peticion GET al endpoint {string}", (endpoint: string) => {
  const projectId = Cypress.env("reqresProjectId");
  const url = endpoint.includes("?") 
    ? `${baseUrl()}${endpoint}&project_id=${projectId}`
    : `${baseUrl()}${endpoint}?project_id=${projectId}`;
  const headers = apiHeaders();
  logRequest("GET", url, undefined, headers);
  cy.request({
    method: "GET",
    url,
    headers,
    failOnStatusCode: false,
  }).then((response) => {
    logResponse(response);
    cy.wrap(response).as("getResponse");
  });
});

Then("el codigo de respuesta debe ser {int}", (statusCode: number) => {
  const alias = (this as any).getResponse ? "@getResponse" : "@response";
  cy.get(alias).its("status").should("eq", statusCode);
});

Then(
  "la respuesta contiene el {string} igual a {string} y el {string} igual a {string}",
  (field1: string, value1: string, field2: string, value2: string) => {
    cy.get("@response").then((response: any) => {
      const data = response.body.data.data || response.body.data || response.body;
      expect(data[field1]).to.eq(value1);
      expect(data[field2]).to.eq(value2);
    });
  }
);

Then(
  "la respuesta contiene un {string} y una fecha de creacion {string}",
  (idField: string, createdAtField: string) => {
    cy.get("@response").then((response: any) => {
      const data = response.body.data || response.body;
      expect(data).to.have.property(idField);
      if (data.hasOwnProperty(createdAtField)) {
        expect(data).to.have.property(createdAtField);
      }
    });
  }
);

Then(
  "el usuario consultado tiene el mismo {string} y {string} enviados en la creacion",
  () => {
    cy.get("@getResponse").then((getResponse: any) => {
      cy.get("@createdBody").then((createdBody: any) => {
        const responseData = getResponse.body.data.data || getResponse.body.data;
        expect(responseData.name).to.eq(createdBody.name);
        expect(responseData.job).to.eq(createdBody.job);
      });
    });
  }
);

When("se realiza una peticion DELETE al usuario recien creado", () => {
  cy.get("@response").then((response: any) => {
    const userId = response.body.id;
    const projectId = Cypress.env("reqresProjectId");
    const url = `${baseUrl()}/collections/users/records/${userId}?project_id=${projectId}`;
    const headers = apiHeaders();
    logRequest("DELETE", url, undefined, headers);
    cy.request({
      method: "DELETE",
      url,
      headers,
      failOnStatusCode: false,
    }).then((deleteResponse) => {
      logResponse(deleteResponse);
      cy.wrap(deleteResponse).as("deleteResponse");
    });
  });
});

When(
  "se envia una peticion PUT a {string} con nombre {string} y cargo {string}",
  (endpoint: string, name: string, job: string) => {
    const projectId = Cypress.env("reqresProjectId");
    const url = endpoint.includes("?") 
      ? `${baseUrl()}${endpoint}&project_id=${projectId}`
      : `${baseUrl()}${endpoint}?project_id=${projectId}`;
    const headers = apiHeaders();
    const body = { data: { name, job } };
    logRequest("PUT", url, body, headers);
    cy.request({
      method: "PUT",
      url,
      headers,
      body,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("response");
    });
  }
);

When("se realiza una peticion PUT al usuario recien creado con nombre {string} y cargo {string}", (name: string, job: string) => {
  cy.get("@response").then((response: any) => {
    const userId = response.body.id;
    const projectId = Cypress.env("reqresProjectId");
    const url = `${baseUrl()}/collections/users/records/${userId}?project_id=${projectId}`;
    const headers = apiHeaders();
    const body = { data: { name, job } };
    logRequest("PUT", url, body, headers);
    cy.request({
      method: "PUT",
      url,
      headers,
      body,
      failOnStatusCode: false,
    }).then((putResponse) => {
      logResponse(putResponse);
      cy.wrap(putResponse).as("putResponse");
    });
  });
});
