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

    it('shows the current balance after login', () => {
      cy.get('[data-testid="current-balance"]').should('contain', '$');
    });

    it('navigates to the transfer screen', () => {
      cy.get('[data-testid="goto-transfer"]').click();
      cy.get('[data-testid="transfer-recipient"]').should('be.visible');
    });

    it('sends money to another user', () => {
      cy.get('[data-testid="goto-transfer"]').click();
      cy.get('[data-testid="transfer-recipient"]').type(recipientEmail);
      cy.get('[data-testid="transfer-amount"]').type('5');
      cy.get('[data-testid="transfer-submit"]').click();
      // Optionally, check for a success message or updated balance here
    });

    it('makes a debin to add money to the account', () => {
      cy.get('[data-testid="goto-debin"]').click();
      cy.get('[data-testid="debin-amount"]').type('100');
      cy.get('[data-testid="debin-submit"]').click();
      cy.get('[data-testid="balance-refresh"]').click(); // Force refresh after DEBIN
      cy.get('[data-testid="current-balance"]', { timeout: 10000 })
        .invoke('text')
        .then((text) => {
          const match = text.match(/([0-9.]+)/);
          expect(match).to.not.be.null;
          const balance = parseFloat(match[1]);
          expect(balance).to.be.at.least(100);
        });
    });

    it('navigates to the transactions screen and checks transaction history', () => {
      cy.get('[data-testid="goto-transactions"]').click({ force: true });
      cy.get('[data-testid="transactions-list"]').should('exist');
      cy.get('[data-testid="transaction-item"]').its('length').should('be.greaterThan', 0);
    });
  });

  it('registers the recipient user', () => {
    cy.visit('/');
    cy.get('[data-testid="goto-register"]').click();
    cy.get('[data-testid="register-email"]').type(recipientEmail);
    cy.get('[data-testid="register-password"]').type(userPassword);
    cy.get('[data-testid="register-alias"]').type('Recipient');
    cy.get('[data-testid="register-submit"]').click();
    cy.get('[data-testid="current-balance"]').should('be.visible');
    cy.get('[data-testid="logout-button"]').click();
  });

  it('logs in as the recipient, tops up, sends money back, and checks transaction history', () => {
    cy.visit('/');
    cy.get('[data-testid="login-email"]').type(recipientEmail);
    cy.get('[data-testid="login-password"]').type(userPassword);
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="current-balance"]', { timeout: 10000 }).should('be.visible');
    // Top up recipient's account
    cy.get('[data-testid="goto-debin"]').click();
    cy.get('[data-testid="debin-amount"]').type('10');
    cy.get('[data-testid="debin-submit"]').click();
    cy.get('[data-testid="current-balance"]').should('contain', '10');
    // Send money back to original user
    cy.get('[data-testid="goto-transfer"]').click();
    cy.get('[data-testid="transfer-recipient"]').type(userEmail);
    cy.get('[data-testid="transfer-amount"]').type('2');
    cy.get('[data-testid="transfer-submit"]').click();
    // Check transaction history
    cy.get('[data-testid="goto-transactions"]').click({ force: true });
    cy.get('[data-testid="transactions-list"]').should('exist');
    cy.get('[data-testid="transaction-item"]').its('length').should('be.greaterThan', 0);
  });
});
