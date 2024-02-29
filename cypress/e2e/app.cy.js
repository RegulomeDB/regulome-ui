/// <reference types="cypress" />

describe("Navigation", () => {
  it("should navigate to other pages from the home page", () => {
    cy.visit("/");
    cy.url().should("include", "/query");
    cy.get(`[data-testid="navigation-help"]`).click();
    cy.url().should("include", "/help");
  });
});
