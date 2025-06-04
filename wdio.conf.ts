import { join } from 'path';

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: [
        './e2e/**/*.e2e.ts'
    ],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:deviceName': 'iPhone 14',
        'appium:automationName': 'XCUITest',
        'appium:app': process.env.APP_PATH || join(process.cwd(), 'ios', 'app.app'),
        'appium:noReset': true,
        'appium:newCommandTimeout': 240
    }],
    logLevel: 'info',
    framework: 'mocha',
    mochaOpts: {
        timeout: 600000
    },
    services: ['appium']
};
