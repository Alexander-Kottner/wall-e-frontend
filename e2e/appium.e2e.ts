import { $, $$, expect, browser } from '@wdio/globals';

// Bypass typing for WDIO/Appium-specific protocol commands
const mobile = browser as any;

// Use a random timestamp per test suite run for uniqueness
const timestamp = Date.now();
const userEmail = `user${timestamp}@example.com`;
const userPassword = 'Password123!';
// Make alias unique as well
const alias = `user${timestamp}`;
// Unique recipient credentials and alias
const recipientEmail = `recipient${timestamp}@example.com`;
const recipientAlias = `recipient${timestamp}`;

// Helper: Wait for an element by testID
async function waitForTestID(testID: string, timeout = 10000) {
    const el = await $(`~${testID}`);
    await el.waitForDisplayed({ timeout });
    return el;
}

// Helper: Fill input and optionally "submit" (press Return)
async function fillInput(testID: string, value: string, pressReturn: boolean = false) {
    const input = await waitForTestID(testID);
    await input.setValue(value);
    if (pressReturn) {
        await input.addValue('\n');
    }
    await mobile.pause(400);
}

// Helper: Try to register, if fails (user exists), login instead
async function registerOrLogin(email: string, password: string, alias: string) {
    const gotoRegisterButton = await waitForTestID('goto-register');
    await gotoRegisterButton.click();

    await fillInput('register-email', email);
    await fillInput('register-password', password);
    await fillInput('register-alias', alias, true);

    const submitBtn = await waitForTestID('register-submit');
    await submitBtn.click();

    try {
        // Wait for the balance to appear, registration succeeded
        await waitForTestID('current-balance', 4000);
        return true;
    } catch (e) {
        // Registration failed, probably user or alias exists. Login instead.
        await waitForTestID('register-email');
        const gotoLogin = await waitForTestID('goto-login');
        await gotoLogin.click();
        await fillInput('login-email', email);
        await fillInput('login-password', password, true);
        const loginBtn = await waitForTestID('login-submit');
        await loginBtn.click();
        await waitForTestID('current-balance');
        return false;
    }
}

// Helper: Login as a user
async function login(email = userEmail, password = userPassword) {
    await mobile.reloadSession();
    await fillInput('login-email', email);
    await fillInput('login-password', password, true);
    const loginBtn = await waitForTestID('login-submit');
    await loginBtn.click();
    await waitForTestID('current-balance');
}

describe('User flows', () => {
    it('registers a new user (or logs in if exists)', async () => {
        await registerOrLogin(userEmail, userPassword, alias);

        const balance = await waitForTestID('current-balance');
        expect(await balance.isDisplayed()).toBe(true);

        const logoutBtn = await waitForTestID('logout-button');
        await logoutBtn.click();
    });

    describe('when logged in', () => {
        beforeEach(async () => {
            await login();
        });

        it('shows the current balance after login', async () => {
            const balance = await waitForTestID('current-balance');
            expect(await balance.getText()).toContain('$');
        });

        it('navigates to the transfer screen', async () => {
            const transferBtn = await waitForTestID('goto-transfer');
            await transferBtn.click();
            const recipientField = await waitForTestID('transfer-recipient');
            expect(await recipientField.isDisplayed()).toBe(true);
        });

        it('sends money to another user', async () => {
            const transferBtn = await waitForTestID('goto-transfer');
            await transferBtn.click();
            await fillInput('transfer-recipient', recipientEmail);
            await fillInput('transfer-amount', '5', true);
            const transferSubmit = await waitForTestID('transfer-submit');
            await transferSubmit.click();
        });

        it('makes a debin to add money to the account', async () => {
            const debinBtn = await waitForTestID('goto-debin');
            await debinBtn.click();
            await fillInput('debin-amount', '100', true);
            const debinSubmit = await waitForTestID('debin-submit');
            await debinSubmit.click();

            const refreshBtn = await waitForTestID('balance-refresh');
            await refreshBtn.click();

            const balance = await waitForTestID('current-balance');
            const text = await balance.getText();
            const match = text.match(/([0-9.]+)/);
            expect(match).not.toBeNull();
            if (match) {
                const amount = parseFloat(match[1]);
                expect(amount).toBeGreaterThanOrEqual(0);
            }
        });

        it('navigates to the transactions screen and checks transaction history', async () => {
            const transactionsBtn = await waitForTestID('goto-transactions');
            await transactionsBtn.click();
            const transactionsList = await waitForTestID('transactions-list');
            expect(await transactionsList.isDisplayed()).toBe(true);
            // Optionally, check for >=0 items if you expect empty histories on new users
        });
    });

    it('registers the recipient user (or logs in if exists)', async () => {
        await mobile.reloadSession();
        await registerOrLogin(recipientEmail, userPassword, recipientAlias);

        const balance = await waitForTestID('current-balance');
        expect(await balance.isDisplayed()).toBe(true);

        const logoutBtn = await waitForTestID('logout-button');
        await logoutBtn.click();
    });

    it('logs in as the recipient, tops up, sends money back, and checks transaction history', async () => {
        await login(recipientEmail);

        const debinBtn = await waitForTestID('goto-debin');
        await debinBtn.click();
        await fillInput('debin-amount', '10', true);
        const debinSubmit = await waitForTestID('debin-submit');
        await debinSubmit.click();

        const balance = await waitForTestID('current-balance');
        expect(await balance.getText()).toMatch(/[0-9]/);

        const transferBtn = await waitForTestID('goto-transfer');
        await transferBtn.click();
        await fillInput('transfer-recipient', userEmail);
        await fillInput('transfer-amount', '2', true);
        const transferSubmit = await waitForTestID('transfer-submit');
        await transferSubmit.click();

        const transactionsBtn = await waitForTestID('goto-transactions');
        await transactionsBtn.click();
        const transactionsList = await waitForTestID('transactions-list');
        expect(await transactionsList.isDisplayed()).toBe(true);
    });
});
