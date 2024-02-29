/// <reference types="cypress" />

describe("Navigation tests", () => {
  it("displays the navigation linkes", () => {
    cy.visit("/");
    cy.get(`[data-testid="navigation-contact"]`).should("exist");
    cy.get(`[data-testid="navigation-help"]`).should("exist");
    cy.get(`[data-testid="navigation-annotations"]`).should("exist");
    cy.get(`[data-testid="navigation-experiments"]`).should("exist");
  });
});
