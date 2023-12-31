const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "3vpsct",
  defaultCommandTimeout: 30000,
  viewportWidth: 1282,
  viewportHeight: 800,
  watchForFileChanges: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
