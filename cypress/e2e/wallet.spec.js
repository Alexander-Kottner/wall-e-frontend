describe('Wallet app', () => {
  beforeEach(() => {
    // default intercepts for balance
    cy.intercept('GET', '/wallet/balance', { statusCode: 200, body: { balance: 100 } }).as('getBalance');
  });

  it('registers a new user', () => {
    cy.intercept('POST', '/auth/register', { statusCode: 200, body: {} }).as('register');
    cy.visit('/');
    cy.get('[data-testid="login-create-account"]').click();
    cy.get('[data-testid="register-email"]').type('new@example.com');
    cy.get('[data-testid="register-password"]').type('password123');
    cy.get('[data-testid="register-alias"]').type('newuser');
    cy.get('[data-testid="register-submit"]').click();
    cy.wait('@register');
    cy.wait('@getBalance');
    cy.get('[data-testid="home-balance"]').should('contain', '$100');
  });

  it('logs in an existing user', () => {
    cy.intercept('POST', '/auth/login', { statusCode: 200, body: {} }).as('login');
    cy.visit('/');
    cy.get('[data-testid="login-email"]').type('user@example.com');
    cy.get('[data-testid="login-password"]').type('secret');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait('@login');
    cy.wait('@getBalance');
    cy.get('[data-testid="home-balance"]').should('contain', '$100');
  });

  it('sends money and views updated history', () => {
    cy.intercept('POST', '/auth/login', { statusCode: 200, body: {} }).as('login');
    cy.visit('/');
    cy.get('[data-testid="login-email"]').type('user@example.com');
    cy.get('[data-testid="login-password"]').type('secret');
    cy.get('[data-testid="login-submit"]').click();
    cy.wait('@login');
    cy.wait('@getBalance');
    cy.get('[data-testid="home-send-money"]').click();

    cy.intercept('POST', '/transactions/p2p', { statusCode: 200, body: {} }).as('p2p');
    cy.get('[data-testid="transfer-recipient"]').type('other@example.com');
    cy.get('[data-testid="transfer-amount"]').type('50');
    cy.get('[data-testid="transfer-submit"]').click();
    cy.wait('@p2p');

    cy.get('[data-testid="home-view-history"]').click();
    cy.intercept('GET', '/wallet', {
      statusCode: 200,
      body: {
        allTransactions: [
          {
            id: '1',
            description: 'Transfer to other@example.com',
            createdAt: new Date().toISOString(),
            amount: 50,
            type: 'OUT'
          }
        ]
      }
    }).as('wallet');
    cy.wait('@wallet');
    cy.get('[data-testid="transaction-item"]').should('have.length', 1);
    cy.get('[data-testid="transaction-item"]').first().contains('$50');
  });
});
