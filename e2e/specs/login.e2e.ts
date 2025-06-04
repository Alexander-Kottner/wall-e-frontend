import { expect } from 'chai';

describe('Login Flow', () => {
    it('should log in with valid credentials', async () => {
        const emailInput = await $('~login-email-input');
        await emailInput.setValue('test@example.com');

        const passwordInput = await $('~login-password-input');
        await passwordInput.setValue('password123');

        const submitButton = await $('~login-submit-button');
        await submitButton.click();

        const sendMoneyButton = await $('~home-send-money-button');
        await sendMoneyButton.waitForExist({ timeout: 10000 });
        expect(await sendMoneyButton.isDisplayed()).to.be.true;
    });
});
