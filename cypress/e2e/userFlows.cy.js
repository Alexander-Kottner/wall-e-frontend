describe('User flows', () => {
  const timestamp = Date.now();
  const userEmail = `user${timestamp}@example.com`;
  const userPassword = 'Password123!';
  const alias = `user${timestamp}`;
  const recipientEmail = `recipient${timestamp}@example.com`;

  it('registers a new user', () => {
    cy.visit('/');
    cy.get('[data-testid="goto-register"]').click();
    cy.get('[data-testid="register-email"]').type(userEmail);
    cy.get('[data-testid="register-password"]').type(userPassword);
    cy.get('[data-testid="register-alias"]').type(alias);
    cy.get('[data-testid="register-submit"]').click();
    cy.get('[data-testid="current-balance"]').should('be.visible');
    cy.get('[data-testid="logout-button"]').click();
  });

  // Helper function for login
  function login() {
    cy.visit('/');
    cy.get('[data-testid="login-email"]').type(userEmail);
    cy.get('[data-testid="login-password"]').type(userPassword);
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="current-balance"]').should('be.visible');
  }

  describe('when logged in', () => {
    beforeEach(() => {
      login();
    });

    it('views current balance', () => {
      cy.get('[data-testid="current-balance"]').should('contain', '$');
    });

    it('sends money to another user and checks transaction history', () => {
      cy.get('[data-testid="goto-transfer"]').click();
      cy.get('[data-testid="transfer-recipient"]').type(recipientEmail);
      cy.get('[data-testid="transfer-amount"]').type('5');
      cy.get('[data-testid="transfer-submit"]').click();

      cy.get('[data-testid="goto-transactions"]').click();
      cy.get('[data-testid="transactions-list"]').should('exist');
      cy.get('[data-testid="transaction-item"]').its('length').should('be.greaterThan', 0);
    });
  });
});
