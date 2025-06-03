import { expect, $ } from '@wdio/globals';

describe('Wall-E wallet flow', () => {
  it('registers, logs in and sends money', async () => {
    // Navigate to register screen
    await $('~login-create-account-button').click();

    // Fill registration form
    await $('~register-email-input').setValue('test@example.com');
    await $('~register-password-input').setValue('test1234');
    await $('~register-submit-button').click();

    // Home screen should display balance
    const balance = await $('~home-balance-text');
    await balance.waitForExist({ timeout: 10000 });
    expect(await balance.isExisting()).to.be.true;

    // Send money
    await $('~home-send-money-button').click();
    await $('~transfer-recipient-input').setValue('alice@example.com');
    await $('~transfer-amount-input').setValue('5');
    await $('~transfer-submit-button').click();

    // View transactions
    await $('~home-view-history-button').click();
    const list = await $('~transactions-list');
    await list.waitForExist({ timeout: 10000 });
    expect(await list.isExisting()).to.be.true;
  });
});
