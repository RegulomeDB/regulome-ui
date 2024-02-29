/// <reference types="cypress" />

describe("query tests", () => {
  it("it should navigate to search page for single variant", () => {
    cy.visit("/");
    cy.contains("SPDI").click();
    cy.contains("Submit").click();
    cy.url().should(
      "include",
      "/search?regions=NC_000009.12%3A4575119%3AG%3AA&genome=GRCh38&r2=0.8&ld=true"
    );
  });
  it("it should navigate to summary page for multiple variants", () => {
    cy.visit("/");
    cy.contains("Multiple variants").click();
    cy.contains("coordinates ranges").click();
    cy.contains("Submit").click();
    cy.url().should(
      "include",
      "/summary?regions=chr12%3A69360231-69360232+chr10%3A5852536-5852537+chr10%3A11699181-11699182+chr1%3A39026790-39026791+chr1%3A109726205-109726206&genome=GRCh38"
    );
  });
});
