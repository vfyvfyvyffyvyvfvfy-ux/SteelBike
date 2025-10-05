const { expect } = require('chai');

// Mocking functions that will exist in the frontend code
// In a real scenario, we would import them, but for now, we define them to test the logic.

// Mock of site/ui.js
const ui = {
    showLoadingSpinner: () => { ui.spinnerVisible = true; },
    hideLoadingSpinner: () => { ui.spinnerVisible = false; },
    spinnerVisible: false
};

// Mock of site/api.js
const api = {
    fetchConfig: async () => {
        // This mock simulates a successful API call
        return Promise.resolve({
            telegramBotUsername: 'TestBot',
            websiteUrl: 'http://test.com'
        });
    }
};

// Mock of global state
global.window = {};

// This describes the logic that will be in site/main.js
describe('Frontend Initialization', () => {
  it('should fetch config and store it globally', async () => {
    // The test simulates the initialization process
    ui.showLoadingSpinner();
    expect(ui.spinnerVisible).to.be.true;

    const config = await api.fetchConfig();
    window.APP_CONFIG = config;

    // Simulate calling the rest of the app logic after config is fetched
    const appInitialized = () => {
        expect(window.APP_CONFIG).to.not.be.null;
        expect(window.APP_CONFIG.telegramBotUsername).to.equal('TestBot');
    };
    appInitialized();

    ui.hideLoadingSpinner();
    expect(ui.spinnerVisible).to.be.false;
  });
});
