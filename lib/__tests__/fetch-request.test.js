import _ from "lodash";
import FetchRequest from "../fetch-request";

describe("Test GET requests to the data provider", () => {
  it("retrieves a single item from the server correctly", async () => {
    // Mock lab collection retrieval.
    const mockData = {
      name: "j-michael-cherry",
      "@id": "/labs/j-michael-cherry/",
      "@type": ["Lab", "Item"],
      title: "J. Michael Cherry, Stanford",
    };
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const request = new FetchRequest();
    let labItem = await request.getObject("/labs/j-michael-cherry/");
    expect(labItem).toBeTruthy();
    expect(_.isEqual(labItem, mockData)).toBeTruthy();

    labItem = await request.getObject(
      "/labs/j-michael-cherry?type=Lab",
      undefined,
      {
        isDbRequest: true,
      }
    );
    expect(labItem).toBeTruthy();
    expect(_.isEqual(labItem, mockData)).toBeTruthy();

    labItem = await request.getObject("/labs/j-michael-cherry", undefined, {
      isDbRequest: true,
    });
    expect(labItem).toBeTruthy();
    expect(_.isEqual(labItem, mockData)).toBeTruthy();
  });

  it("receives a network error object when fetch throws an error", async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw "Mock request error";
    });

    const request = new FetchRequest();
    const labItem = await request.getObject("/labs/j-michael-cherry/");
    expect(labItem).toBeTruthy();
    expect(labItem["@type"]).toContain("NetworkError");
    expect(labItem.status).toEqual("error");
    expect(labItem.code).toEqual("NETWORK");
    expect(FetchRequest.isResponseSuccess(labItem)).toBeFalsy();
  });

  it("returns default error value when GET request unsuccessful", async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            "@type": ["HTTPNotFound", "Error"],
            status: "error",
            code: 404,
            title: "Not Found",
            description: "The resource could not be found.",
            detail: "URL",
          }),
      })
    );

    const request = new FetchRequest();
    const labItem = await request.getObject("/labs/j-michael-cherry/", {
      notOK: "nope",
    });
    expect(labItem).toBeTruthy();
    expect(labItem.notOK).toEqual("nope");
  });

  it("returns a default error value on a network error", async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw "Mock request error";
    });

    const request = new FetchRequest();
    const labItem = await request.getObject("/labs/j-michael-cherry/", {
      notOK: "nope",
    });
    expect(labItem).toBeTruthy();
    expect(labItem.notOK).toEqual("nope");
  });
});

describe("Test URL-specific fetch requests", () => {
  it("retrieves a single item from the server correctly", async () => {
    // Mock lab collection retrieval.
    const mockData = {
      _csfrt_: "mock_csrf_token",
      "auth.userid": "email@example.com",
    };
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const request = new FetchRequest();
    const session = await request.getObjectByUrl(
      "http://localhost:8000/session"
    );
    expect(session).toBeTruthy();
    expect(_.isEqual(session, mockData)).toBeTruthy();
  });

  it("returns an error on throw", async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw "Mock request error";
    });

    const request = new FetchRequest();
    const session = await request.getObjectByUrl(
      "http://localhost:8000/labs/j-michael-cherry/"
    );
    expect(session).toBeTruthy();
    expect(session["@type"]).toContain("NetworkError");
    expect(session.status).toEqual("error");
    expect(session.code).toEqual("NETWORK");
    expect(FetchRequest.isResponseSuccess(session)).toBeFalsy();
  });

  it("returns a specific error on throw", async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw "Mock request error";
    });

    const request = new FetchRequest();
    const session = await request.getObjectByUrl(
      "http://localhost:8000/labs/j-michael-cherry/",
      null
    );
    expect(session).toBeNull();
  });

  it("returns a specific error value", async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            "@type": ["HTTPNotFound", "Error"],
            status: "error",
            code: 404,
            title: "Not Found",
            description: "The resource could not be found.",
            detail: "URL",
          }),
      })
    );

    const request = new FetchRequest();
    const session = await request.getObjectByUrl(
      "http://localhost:8000/session",
      null
    );
    expect(session).toBeNull();
  });

  it("returns a default error value", async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            "@type": ["HTTPNotFound", "Error"],
            status: "error",
            code: 404,
            title: "Not Found",
            description: "The resource could not be found.",
            detail: "URL",
          }),
      })
    );

    const request = new FetchRequest();
    const session = await request.getObjectByUrl(
      "http://localhost:8000/session"
    );
    expect(session).toBeTruthy();
    expect(session.status).toEqual("error");
    expect(session.code).toEqual(404);
  });
});

describe("Text fetch requests", () => {
  it("returns text with a successful request", async () => {
    const mockData = "## Markdown";
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockData),
      })
    );

    const request = new FetchRequest();
    const markdown = await request.getText("/markdown/path");
    expect(markdown).toEqual(mockData);
  });

  it("returns an error object when text request unsuccessful", async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        text: () =>
          Promise.resolve({
            "@type": ["HTTPNotFound", "Error"],
            status: "error",
            code: 404,
            title: "Not Found",
            description: "The resource could not be found.",
            detail: "URL",
          }),
      })
    );

    const request = new FetchRequest();
    const markdown = await request.getText("/markdown/path");
    expect(typeof markdown).toEqual("object");
    expect(markdown["@type"]).toContain("HTTPNotFound");
  });

  it("returns a default value when text request unsuccessful", async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        text: () =>
          Promise.resolve({
            "@type": ["HTTPNotFound", "Error"],
            status: "error",
            code: 404,
            title: "Not Found",
            description: "The resource could not be found.",
            detail: "URL",
          }),
      })
    );

    const request = new FetchRequest();
    const markdown = await request.getText("/markdown/path", "Error Message");
    expect(typeof markdown).toEqual("string");
    expect(markdown).toEqual("Error Message");
  });

  it("returns a network error on a text request", async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw "Mock request error";
    });

    const request = new FetchRequest();
    const markdown = await request.getText("/markdown/path");
    expect(markdown).toBeTruthy();
    expect(markdown["@type"]).toContain("NetworkError");
    expect(markdown.status).toEqual("error");
    expect(markdown.code).toEqual("NETWORK");
    expect(FetchRequest.isResponseSuccess(markdown)).toBeFalsy();
  });

  it("returns a default value for a network error on a text request", async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw "Mock request error";
    });

    const request = new FetchRequest();
    const markdown = await request.getText(
      "/markdown/path",
      "Proxima Centauri"
    );
    expect(markdown).toEqual("Proxima Centauri");
  });
});
