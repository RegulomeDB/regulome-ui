/// <reference types="cypress" />

describe("Navigation", () => {
  it("should navigate to other pages from the home page", () => {
    cy.visit("/");

    // Make sure all the navigation links work.
    cy.get("[data-testid=awards]").click();
    cy.url().should("include", "/search?type=Award");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=documents]").click();
    cy.url().should("include", "/search?type=Document");
    cy.get("[data-testid=search-results-view-switch]").should("not.exist");
    cy.get("[data-testid=form-select]").should("not.exist");
    cy.get("[data-testid=search-results-count]").should("not.exist");
    cy.get("[data-testid=search-list]").should("not.exist");

    cy.get("[data-testid=donors]").click();

    cy.get("[data-testid=human-donors]").click();
    cy.url().should("include", "/search?type=HumanDonor");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=rodent-donors]").click();
    cy.url().should("include", "/search?type=RodentDonor");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=donors]").click();
    cy.get("[data-testid=human-donors]").should("not.exist");
    cy.get("[data-testid=rodent-donors]").should("not.exist");

    cy.get("[data-testid=genes]").click();
    cy.url().should("include", "/search?type=Gene");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=labs]").click();
    cy.url().should("include", "/search?type=Lab");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=ontologies]").click();

    cy.get("[data-testid=assay-terms]").click();
    cy.url().should("include", "/search?type=AssayTerm");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=phenotype-terms]").click();
    cy.url().should("include", "/search?type=PhenotypeTerm");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=samples-terms]").click();
    cy.url().should("include", "/search?type=SampleTerm");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=ontologies]").click();
    cy.get("[data-testid=assay-terms]").should("not.exist");
    cy.get("[data-testid=phenotype-terms]").should("not.exist");
    cy.get("[data-testid=sample-terms]").should("not.exist");

    cy.get("[data-testid=samples]").click();

    cy.get("[data-testid=in-vitro-systems]").click();
    cy.url().should("include", "/search?type=InVitroSystem");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 1);

    cy.get("[data-testid=primary-cells]").click();
    cy.url().should("include", "/search?type=PrimaryCell");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=technical-samples]").click();
    cy.url().should("include", "/search?type=TechnicalSample");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=tissues]").click();
    cy.url().should("include", "/search?type=Tissue");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=samples]").click();
    cy.get("[data-testid=tissues]").should("not.exist");
    cy.get("[data-testid=primary-cells]").should("not.exist");
    cy.get("[data-testid=technical-samples]").should("not.exist");

    cy.get("[data-testid=treatments]").click();
    cy.url().should("include", "/search?type=Treatment");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=users]").click();
    cy.url().should("include", "/search?type=User");
    cy.get("[data-testid=search-results-view-switch]").should("exist");
    cy.get("[data-testid=form-select]").should("exist");
    cy.get("[data-testid=search-results-count]").should("exist");
    cy.get("[data-testid=search-list]")
      .find("li")
      .its("length")
      .should("be.gte", 2);

    cy.get("[data-testid=profiles]").click();
    cy.url().should("include", "/profiles");
  });
});
