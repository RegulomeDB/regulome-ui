[![CircleCI](https://circleci.com/gh/RegulomeDB/regulome-ui/tree/dev.svg?style=svg)](https://circleci.com/gh/RegulomeDB/regulome-ui/tree/dev)
[![Coverage Status](https://coveralls.io/repos/github/RegulomeDB/regulome-ui/badge.svg)](https://coveralls.io/github/RegulomeDB/regulome-ui)

# Regulome-ui

This is the UI portion of the RegulomeDB project bootstrapped with [Next.js](https://nextjs.org). This relies on the [Genomic Data Services
](https://github.com/ENCODE-DCC/genomic-data-service) project to supply its data.

## Getting Started

You must first install [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac) and launch it so that its window with the blue title bar appears. Keep this app running in the background while you test `regulome-ui` locally.

1. Clone this repo (`regulome-ui`) and start the `Next.js` server:

```bash
# In regulome-ui repo.
# Note the build flag is only required if dependencies (e.g. package.json) have changed.
# regulome-ui branches change dependency versions frequently, so it makes sense to use the build flag
# whenever you switch between regulome-ui branches, or the dev branch gets new branches merged in.
$ docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the `regulome-ui` home page.

Changes you make to Javascript files hot reload this local `regulome-ui`.

When you have finished local development, stop and clean up the Docker instances in both terminals:

```bash
docker compose down -v
```

The Docker Desktop app should now show no running containers.

## Installing Packages

Install packages from the Docker environment itself (to ensure proper `npm` version and `package.json` format).

For example to install `uuid` package start interactive container:

```bash
docker compose -f docker-compose.test.yml run nextjs /bin/sh
```

In container run desired `npm install` command:

```bash
npm install uuid
```

Changes should be reflected in the `package*.json` files of local repository (exit container and commit them to `git`). Make sure to use `docker compose up --build` when starting the application the next time to rebuild Docker image with latest dependencies.

## Testing

### Jest Tests

Use Jest for unit testing individual functions and isolated React components that rely on simple data. More complex React components, e.g. those relying on server data, typically get tested better with Cypress.

To execute all Jest tests and clean up:

```bash
$ docker compose -f docker-compose.test.yml up --exit-code-from nextjs
....
$ docker compose -f docker-compose.test.yml down -v

```

Or run tests interactively:

```bash
# Start interactive container.
$ docker compose -f docker-compose.test.yml run nextjs /bin/sh
# In interactive container (modify test command as needed).
$ npm test
# Run specific Jest test (e.g. separated-list).
$ npm test -- separated-list
```

And stop and clean, exit the interactive container and then:

```bash
docker compose down -v
```

#### Writing Jest Tests

This project uses the [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro/). Next.js provides a [primer on creating your own Jest tests](https://nextjs.org/docs/testing#jest-and-react-testing-library). You need to use [RTL queries](https://testing-library.com/docs/react-testing-library/cheatsheet/#queries) to extract portions of the DOM to test. You then need a combination of the [Jest matchers](https://jestjs.io/docs/expect) and [RTL matchers](https://github.com/testing-library/jest-dom#table-of-contents) to perform the tests.

Jest tests use the [coveralls](https://coveralls.io/) code coverage service. We must strive to get 100% code coverage with Jest tests, or make separate tickets to get to 100% coverage if doing so in a primary ticket would cause too much code review churn.

##### Excluding Files From Coveralls

In extremely rare cases, some Javascript files might not make sense to write Jest tests for. In this case, you can exclude the file from coveralls coverage by including the following comment after the import lines:

```javascript
/* istanbul ignore file */
```

### Cypress Tests

Use [Cypress](https://www.cypress.io) for end-to-end integration testing, such as testing entire pages, interacting with those pages as a user would, and testing navigation between pages.

Run Cypress tests with Docker Compose.

1. Start `regulome-ui`:

```bash
docker compose up
```

2. Run Cypress tests:

```bash
docker compose -f docker-compose.cypress-m1.yml up --exit-code-from cypress
```

Note if you want to run Cypress locally using the official Cypress image (not for M1 macs) you can use the `docker-compose.cypress-on-circle.yml` in `./docker/cypress` folder, e.g.:

```bash
# Temporarily copy yml to root directory so Docker context is correct.
$ cp ./docker/cypress/docker-compose.cypress-on-circle.yml docker-compose.cypress.yml
# Run tests.
$ docker compose -f docker-compose.cypress.yml up --exit-code-from cypress
# Clean up untracked yml.
$ rm docker-compose.cypress.yml
```

3. Review video in `./cypress/videos/`.

4. Stop and clean up `regulome-ui` service in the terminal:

```bash
docker compose down -v
```

#### Writing Cypress Tests

Generally, each page or major feature on a page should have its own Cypress test, though some pages might have too few elements to justify this. [This Cypress tutorial](https://docs.cypress.io/guides/getting-started/writing-your-first-test#Write-your-first-test) provides a good starting point for writing these tests, which in many ways shares methods with Jest tests.

## Editor Setup

### Visual Studio Code

1. Install [Visual Studio Code](https://code.visualstudio.com/download) if needed.
1. Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension so you can see code-formatting errors.
1. Install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension. This automatically formats the code to standard on each save.
1. Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension. This lets you see and select Tailwind CSS classes as you type them, and shows the corresponding CSS when you hover over Tailwind CSS classes.

In addition, you might have a better experience if you set these in your Visual Studio Code JSON settings, either as your preferences (user settings) or specific to the regulome-ui project (workspace settings):

```json
  "css.validate": false,
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.tabSize": 2,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.classAttributes": ["class", "className"],
  "tailwindCSS.emmetCompletions": true,
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
```

Some of these might already exist in your settings, so search for them first to avoid conflicts.

## Automatic linting

This repo includes configuration for pre-commit hooks. To use pre-commit, install pre-commit, and activate the hooks:

```bash
pip install pre-commit==2.17.0
pre-commit install
```

Now every time you run `git commit` the automatic checks are run to check the changes you made.
