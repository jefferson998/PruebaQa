import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

const collectionsUrl = (): string => Cypress.env("apiCollectionsUrl");


const projectId = () => {
  const id = Cypress.env("reqresProjectId");
  if (!id) {
    throw new Error(
      "Falta configurar Cypress.env('reqresProjectId'). Copia cypress.env.json.example a cypress.env.json y pega el Project ID que ves en el dashboard de reqres.in, o exporta CYPRESS_reqresProjectId."
    );
  }
  return id;
}

const apiHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const apiKey = Cypress.env("reqresApiKey");
  const reqresEnv = Cypress.env("reqresEnv");
  if (!apiKey) {
    throw new Error(
      "Falta configurar Cypress.env('reqresApiKey'). Ver README.md."
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


const collectionRecordsUrl = (collection: string, recordId?: string): string => {
  const base = recordId
    ? `${collectionsUrl()}/${collection}/records/${recordId}`
    : `${collectionsUrl()}/${collection}/records`;
  return `${base}?project_id=${projectId()}`;
}

When(
  "crea un registro en la coleccion {string} con nombre {string} y cargo {string}",
  (collection: string, name: string, job: string) => {
    const url = collectionRecordsUrl(collection);
    const headers = apiHeaders();
    const body = { data: { name, job } };
    logRequest("POST", url, body, headers);
    cy.request({
      method: "POST",
      url,
      headers,
      body,
      failOnStatusCode: false,
    }).then((response: Cypress.Response<any>) => {
      logResponse(response);
      cy.wrap(response).as("collectionResponse");
      if (response.body && response.body.data && response.body.data.id) {
        cy.wrap(response.body.data.id).as("recordId");
      }
      cy.wrap({ name, job }).as("createdData");
    });
  }
);

When("consulta el registro creado en la coleccion {string}", (collection: string) => {
  cy.get("@recordId").then((id) => {
    const url = collectionRecordsUrl(collection, String(id));
    const headers = apiHeaders();
    logRequest("GET", url, undefined, headers);
    cy.request({
      method: "GET",
      url,
      headers,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("collectionResponse");
    });
  });
});

When("consulta el registro eliminado en la coleccion {string}", (collection: string) => {
  cy.get("@recordId").then((id) => {
    const url = collectionRecordsUrl(collection, String(id));
    const headers = apiHeaders();
    logRequest("GET", url, undefined, headers);
    cy.request({
      method: "GET",
      url,
      headers,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("collectionResponse");
    });
  });
});

When(
  "edita el registro creado en la coleccion {string} con nombre {string} y cargo {string}",
  (collection: string, name: string, job: string) => {
    cy.get("@recordId").then((id) => {
      const url = collectionRecordsUrl(collection, String(id));
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
        cy.wrap(response).as("collectionResponse");
      });
    });
  }
);

When(
  "edita un registro inexistente en la coleccion {string} con id {string}",
  (collection: string, id: string) => {
    const url = collectionRecordsUrl(collection, id);
    const headers = apiHeaders();
    const body = { data: { name: "No deberia importar", job: "No deberia importar" } };
    logRequest("PUT", url, body, headers);
    cy.request({
      method: "PUT",
      url,
      headers,
      body,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("collectionResponse");
    });
  }
);

When("elimina el registro creado en la coleccion {string}", (collection: string) => {
  cy.get("@recordId").then((id) => {
    const url = collectionRecordsUrl(collection, String(id));
    const headers = apiHeaders();
    logRequest("DELETE", url, undefined, headers);
    cy.request({
      method: "DELETE",
      url,
      headers,
      failOnStatusCode: false,
    }).then((response) => {
      logResponse(response);
      cy.wrap(response).as("collectionResponse");
    });
  });
});

Then("el codigo de respuesta de la coleccion debe ser {int}", (statusCode: number) => {
  cy.get("@collectionResponse").its("status").should("eq", statusCode);
});

Then(
  "el registro creado contiene el {string} igual a {string} y el {string} igual a {string}",
  (field1: string, value1: string, field2: string, value2: string) => {
    cy.get("@collectionResponse").then((response: any) => {
      expect(response.body.data.data[field1]).to.eq(value1);
      expect(response.body.data.data[field2]).to.eq(value2);
    });
  }
);

Then(
  "el registro editado contiene el {string} igual a {string} y el {string} igual a {string}",
  (field1: string, value1: string, field2: string, value2: string) => {
    cy.get("@collectionResponse").then((response: any) => {
      expect(response.body.data.data[field1]).to.eq(value1);
      expect(response.body.data.data[field2]).to.eq(value2);
    });
  }
);

Then("el registro consultado coincide con los datos creados", () => {
  cy.get("@collectionResponse").then((response: any) => {
    cy.get("@createdData").then((createdData: any) => {
      expect(response.body.data.data.name).to.eq(createdData.name);
      expect(response.body.data.data.job).to.eq(createdData.job);
    });
  });
});
