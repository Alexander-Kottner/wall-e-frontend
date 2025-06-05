// Set TS_NODE_PROJECT to use the Cypress tsconfig
process.env.TS_NODE_PROJECT = 'cypress/tsconfig.json';

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js'
  },
  video: false
});
