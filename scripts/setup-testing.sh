#!/bin/bash

# Wall-E Frontend Testing Setup Script
set -e

echo "🤖 Setting up Wall-E Frontend for Appium Testing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Appium is installed
if ! command -v appium &> /dev/null; then
    print_error "Appium is not installed. Installing..."
    npm install -g appium
    print_status "Appium installed successfully"
else
    print_status "Appium is already installed ($(appium --version))"
fi

# Install XCUITest driver if not present
if ! appium driver list | grep -q "xcuitest"; then
    print_warning "XCUITest driver not found. Installing..."
    appium driver install xcuitest
    print_status "XCUITest driver installed"
else
    print_status "XCUITest driver is already installed"
fi

# Create apps directory if it doesn't exist
mkdir -p ios/build/apps

# Build the iOS app for simulator (simplified approach)
print_status "Building iOS app for simulator..."

# Check if we need to install pods
if [ ! -d "ios/Pods" ]; then
    print_warning "Pods not found. Installing..."
    cd ios && pod install && cd ..
    print_status "Pods installed successfully"
fi

# Try building with React Native CLI first
if command -v npx &> /dev/null; then
    print_status "Building with React Native CLI..."
    npx react-native run-ios --simulator="iPhone 15" --configuration Debug || {
        print_warning "React Native CLI build failed, trying Expo..."
        
        # Fallback to Expo if available
        if command -v expo &> /dev/null; then
            expo run:ios --device || {
                print_error "Both React Native and Expo builds failed"
                print_warning "You may need to build the app manually using Xcode"
            }
        else
            print_warning "Expo CLI not found. Install with: npm install -g @expo/cli"
        fi
    }
fi

# Create a simple app path finder
APP_PATH=$(find ios/build -name "*.app" 2>/dev/null | head -1)

if [ -z "$APP_PATH" ]; then
    # Look for the app in derived data
    DERIVED_DATA_PATH="$HOME/Library/Developer/Xcode/DerivedData"
    APP_PATH=$(find "$DERIVED_DATA_PATH" -name "wallefrontend.app" 2>/dev/null | grep -E "Debug-iphonesimulator|Release-iphonesimulator" | head -1)
fi

if [ -n "$APP_PATH" ]; then
    print_status "Found app at: $APP_PATH"
    # Copy to our apps directory for easy access
    cp -r "$APP_PATH" ios/build/apps/
    print_status "App copied to ios/build/apps/"
else
    print_warning "App bundle not found. You may need to build manually."
fi

# Start Appium server
print_status "Starting Appium server..."
appium &
APPIUM_PID=$!

# Wait a moment for server to start
sleep 3

# Test if Appium is running
if curl -s http://localhost:4723/status > /dev/null; then
    print_status "Appium server is running on http://localhost:4723"
else
    print_error "Failed to start Appium server"
    exit 1
fi

print_status "Setup complete! 🎉"
echo ""
echo "📋 Next steps:"
echo "1. Run your tests: npm run test:e2e"
echo "2. Or run WebDriverIO directly: npx wdio run wdio.conf.ts"
echo "3. To stop Appium: kill $APPIUM_PID"
echo ""
echo "📱 App locations to check:"
if [ -n "$APP_PATH" ]; then
    echo "   - $APP_PATH"
fi
echo "   - ios/build/apps/"
echo "   - ~/Library/Developer/Xcode/DerivedData/*/Build/Products/Debug-iphonesimulator/"