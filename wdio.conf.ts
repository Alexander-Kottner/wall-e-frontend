import path from 'path';

export const config = {
    runner: 'local',
    specs: ['./e2e/**/*.e2e.ts'],
    maxInstances: 1,
    port: 4723,
    path: '/wd/hub',
    capabilities: [{
        platformName: 'iOS',
        'appium:deviceName': 'iPhone 14',
        'appium:platformVersion': '16.4',
        'appium:automationName': 'XCUITest',
        'appium:app': path.resolve('./ios/build/Build/Products/Debug-iphonesimulator/WallE.app'),
    }],
    logLevel: 'info',
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        timeout: 600000,
    },
    autoCompileOpts: {
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json',
        },
    },
};

export default config;
