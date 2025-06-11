import path from 'path';
import fs from 'fs';

// Let TypeScript know there *will* be a browser global in hooks
declare const browser: any;

// Function to find the app bundle
function findAppBundle(): string {
    const possiblePaths = [
        // DerivedData (where Expo builds the complete app)
        '/Users/alexanderkottner/Library/Developer/Xcode/DerivedData/wallefrontend-gwmwacrsginshcdwzqamyondqabz/Build/Products/Debug-iphonesimulator/wallefrontend.app',

        // Build directory (fallback)
        path.join(__dirname, 'ios/build/apps/wallefrontend.app'),
        path.join(__dirname, 'ios/build/Build/Products/Debug-iphonesimulator/wallefrontend.app'),

        // Generic DerivedData search
        path.join(process.env.HOME || '', 'Library/Developer/Xcode/DerivedData'),
    ];

    // Check the known complete app first
    if (fs.existsSync(possiblePaths[0])) {
        console.log(`✅ Found complete app at: ${possiblePaths[0]}`);
        return possiblePaths[0];
    }

    // Check local build paths
    for (const appPath of possiblePaths.slice(1, 3)) {
        if (fs.existsSync(appPath)) {
            console.log(`✅ Found app at: ${appPath}`);
            return appPath;
        }
    }

    // Search in DerivedData for any wallefrontend project
    const derivedDataPath = possiblePaths[3];
    if (fs.existsSync(derivedDataPath)) {
        try {
            const projects = fs.readdirSync(derivedDataPath);
            for (const project of projects) {
                if (project.includes('wallefrontend')) {
                    const appPath = path.join(
                        derivedDataPath,
                        project,
                        'Build/Products/Debug-iphonesimulator/wallefrontend.app'
                    );
                    if (fs.existsSync(appPath)) {
                        console.log(`✅ Found app in DerivedData: ${appPath}`);
                        return appPath;
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️  Could not search DerivedData directory');
        }
    }

    // Fallback - return expected path and let user know
    const fallbackPath = possiblePaths[1];
    console.warn(`⚠️  App not found. Using fallback path: ${fallbackPath}`);
    console.warn('   Please ensure the app is built or run: npx expo run:ios');
    return fallbackPath;
}

// REMOVE the type annotation here! Don't use `: Options.Testrunner`
export const config = {
    runner: 'local',
    port: 4723,
    path: '/',

    specs: [
        './e2e/**/*.e2e.ts'
    ],

    exclude: [],

    maxInstances: 1,

    capabilities: [{
        'appium:platformName': 'iOS',
        'appium:platformVersion': '18.5', // Updated to match available SDK
        'appium:deviceName': 'iPhone 15',
        'appium:automationName': 'XCUITest',
        'appium:app': findAppBundle(),
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 60,
        'appium:commandTimeouts': {
            'default': 60000
        },
        'appium:shouldTerminateApp': true,
        'appium:shouldUseSingletonTestManager': false,
        'appium:simpleIsVisibleCheck': true,
        'appium:useJSONSource': true,
        'appium:includeDeviceCapsToSessionInfo': true,
        'appium:eventTimings': true,
        'appium:enablePerformanceLogging': false,
        'appium:autoAcceptAlerts': false,
        'appium:autoDismissAlerts': false,
        'appium:waitForIdleTimeout': 10,
        'appium:launchTimeout': 60000
    }],

    logLevel: 'info',

    bail: 0,

    baseUrl: 'http://localhost',

    waitforTimeout: 30000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,

    services: [
        // If you start Appium manually, leave this empty.
        // If you want WDIO to start Appium for you, uncomment and configure.
        // ['appium', { ... }]
    ],

    framework: 'mocha',

    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
        require: ['./node_modules/ts-node/register/transpile-only']
    },

    // Global hooks
    before: async function () {
        console.log('🚀 Starting test session...');
        try {
            const status = await browser.status();
            console.log('✅ Appium server is ready:', status.build?.version);
        } catch (error) {
            console.error('❌ Failed to connect to Appium server:', error);
            throw error;
        }
    },
    
    beforeTest: async function (test: any) {
        console.log(`📱 Starting test: ${test.title}`);
    },
    
    afterTest: async function (test: any, _context: any, { error }: any) {
        if (error) {
            console.log(`❌ Test failed: ${test.title}`);
            try {
                const screenshot = await browser.takeScreenshot();
                const screenshotPath = `./screenshots/failed-${test.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
                require('fs').writeFileSync(screenshotPath, screenshot, 'base64');
                console.log(`📸 Screenshot saved: ${screenshotPath}`);
            } catch (screenshotError) {
                if (screenshotError instanceof Error) {
                    console.warn('⚠️  Could not take screenshot:', screenshotError.message);
                } else {
                    console.warn('⚠️  Could not take screenshot:', screenshotError);
                }
            }
        } else {
            console.log(`✅ Test passed: ${test.title}`);
        }
    },
    
    after: async function () {
        console.log('🏁 Test session completed');
    },
    
};
