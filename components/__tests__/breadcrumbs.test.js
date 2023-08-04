import { render, screen } from "@testing-library/react";
import Breadcrumbs from "../breadcrumbs";
import GlobalContext from "../global-context";

describe("Test the Breadcrumbs React component", () => {
  it("should render breadcrumbs Home/Help", async () => {
    const breadcrumbs = [
      {
        title: "Help",
        href: "/help",
      },
    ];
    const context = {
      breadcrumbs,
    };
    render(
      <GlobalContext.Provider value={context}>
        <Breadcrumbs />
      </GlobalContext.Provider>
    );

    const breadcrumbElement = screen.getByLabelText("breadcrumbs");
    expect(breadcrumbElement).toBeInTheDocument();

    const homeBreadcrumb = screen.getByTestId("/");
    expect(homeBreadcrumb).toBeInTheDocument();
    expect(homeBreadcrumb).toHaveTextContent("Home");

    const labsBreadcrumb = screen.getByTestId("/help");
    expect(labsBreadcrumb).toBeInTheDocument();
    expect(labsBreadcrumb).toHaveTextContent("Help");
  });

  it("should not render breadcrumbs", async () => {
    const context = {};
    render(
      <GlobalContext.Provider value={context}>
        <Breadcrumbs />
      </GlobalContext.Provider>
    );

    const breadcrumbElement = screen.queryByLabelText("breadcrumbs");
    expect(breadcrumbElement).toBeNull;
  });
});
