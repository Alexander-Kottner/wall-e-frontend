describe('User flows', () => {
  const delay_demo = 0;
  const delay_typing = 0;
  
  const timestamp = Date.now();
  const userEmail = `user${timestamp}@example.com`;
  const userPassword = 'Password123!';
  const alias = `user${timestamp}`;
  const recipientEmail = `recipient${timestamp}@example.com`;
  const recipientAlias = `recipient${timestamp}`;

  it('registers a new user', () => {
    cy.visit('/');
    cy.wait(300);

    cy.get('[data-testid="goto-register"]').click();
    cy.wait(300);

    cy.get('[data-testid="register-email"]').type(userEmail, { delay: delay_typing });
    cy.get('[data-testid="register-password"]').type(userPassword, { delay: delay_typing });
    cy.get('[data-testid="register-alias"]').type(alias, { delay: delay_typing });
    cy.get('[data-testid="register-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="current-balance"]').should('be.visible');
    cy.wait(delay_demo);

    cy.get('[data-testid="logout-button"]').click();
  });

  it('registers the recipient user', () => {
    cy.visit('/');
    cy.wait(300);

    cy.get('[data-testid="goto-register"]').click();
    cy.wait(300);

    cy.get('[data-testid="register-email"]').type(recipientEmail, { delay: delay_typing });
    cy.get('[data-testid="register-password"]').type(userPassword, { delay: delay_typing });
    cy.get('[data-testid="register-alias"]').type(recipientAlias, { delay: delay_typing });
    cy.get('[data-testid="register-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="current-balance"]').should('be.visible');
    cy.wait(delay_demo);

    cy.get('[data-testid="logout-button"]').click();
  });

  it('logs in as the user, makes a DEBIN, sends money, checks transaction history and logs out', () => {
    cy.visit('/');
    cy.wait(300);

    cy.get('[data-testid="login-email"]').type(userEmail, { delay: delay_typing });
    cy.get('[data-testid="login-password"]').type(userPassword, { delay: delay_typing });
    cy.get('[data-testid="login-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="goto-debin"]').click();
    cy.wait(300);
    cy.get('[data-testid="debin-amount"]').type('100', { delay: delay_typing });
    cy.get('[data-testid="debin-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="current-balance"]').should('contain', '100')
    cy.wait(delay_demo);

    cy.get('[data-testid="goto-transfer"]').click();
    cy.wait(300);
    cy.get('[data-testid="transfer-recipient"]').type(recipientEmail, { delay: delay_typing });
    cy.get('[data-testid="transfer-amount"]').type('5', { delay: delay_typing });
    cy.get('[data-testid="transfer-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="goto-transactions"]').click({ force: true });
    cy.wait(300);
    cy.get('[data-testid="transactions-list"]').should('exist');
    cy.get('[data-testid="transaction-item"]').its('length').should('be.greaterThan', 0);
    cy.wait(delay_demo);

    cy.get('[data-testid="back-home"]').click();
    cy.wait(300);

    cy.get('[data-testid="logout-button"]').click();
  });

  it('logs in as the recipient, tops up, sends money back, and checks transaction history', () => {
    cy.visit('/');
    cy.wait(300);

    cy.get('[data-testid="login-email"]').type(recipientEmail, { delay: delay_typing });
    cy.get('[data-testid="login-password"]').type(userPassword, { delay: delay_typing });
    cy.get('[data-testid="login-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="goto-debin"]').click();
    cy.wait(300);
    cy.get('[data-testid="debin-amount"]').type('10', { delay: delay_typing });
    cy.get('[data-testid="debin-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="current-balance"]').should('contain', '15');
    cy.wait(delay_demo);

    cy.get('[data-testid="goto-transfer"]').click();
    cy.wait(300);
    cy.get('[data-testid="transfer-recipient"]').type(userEmail, { delay: delay_typing });
    cy.get('[data-testid="transfer-amount"]').type('2', { delay: delay_typing });
    cy.get('[data-testid="transfer-submit"]').click();
    cy.wait(delay_demo);

    cy.get('[data-testid="goto-transactions"]').click({ force: true });
    cy.wait(300);
    cy.get('[data-testid="transactions-list"]').should('exist');
    cy.get('[data-testid="transaction-item"]').its('length').should('be.greaterThan', 0);
    cy.wait(delay_demo);

    cy.get('[data-testid="back-home"]').click();
    cy.wait(300);

    cy.get('[data-testid="logout-button"]').click();
  });
});

