import { $, $$, expect } from '@wdio/globals';
import 'expect-webdriverio';

describe('Wallet App iOS', () => {
    it('registers, logs in and performs a transfer', async () => {
        // Go to register screen
        const gotoRegister = await $('~goto-register');
        await gotoRegister.waitForDisplayed({ timeout: 10000 });
        await gotoRegister.click();

        // Fill registration form
        await $('~register-email').setValue('test@example.com');
        await $('~register-password').setValue('password123');
        await $('~register-alias').setValue('TestUser');
        await $('~register-submit').click();

        // Home screen should show balance
        const balance = await $('~current-balance');
        await balance.waitForDisplayed({ timeout: 10000 });
        expect(await balance.getText()).toMatch(/\$/);

        // Navigate to transfer and send money
        await $('~goto-transfer').click();
        await $('~transfer-recipient').setValue('friend@example.com');
        await $('~transfer-amount').setValue('1');
        await $('~transfer-submit').click();

        // Open transaction history
        await $('~goto-transactions').click();
        const list = await $('~transactions-list');
        await list.waitForDisplayed({ timeout: 10000 });
        const items = await $$('~transaction-item');
        expect(items.length).toBeGreaterThan(0);
    });
});
