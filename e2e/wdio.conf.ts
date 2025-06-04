import path from 'path';
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
    runner: 'local',
    specs: [path.join(__dirname, 'specs', '**/*.ts')],
    maxInstances: 1,
    capabilities: [{
        platformName: 'iOS',
        'appium:deviceName': 'iPhone 14',
        'appium:automationName': 'XCUITest',
        'appium:app': process.env.APP_PATH || path.resolve('ios','build','Walle.app'),
        'appium:noReset': true
    }],
    logLevel: 'info',
    services: [],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        timeout: 600000
    },
};

export default config;
