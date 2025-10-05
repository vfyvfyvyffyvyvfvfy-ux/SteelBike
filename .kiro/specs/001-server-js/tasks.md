# Tasks: Centralized Server-Side Configuration

**Input**: Design documents from `C:\Users\Kerpat\Desktop\SteelBike\.kiro\specs\001-server-js\`

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Backend API code is in `api/`
- Frontend code is in `site/`

## Phase 3.1: Setup
- [x] T001 Add testing dependencies to the root `package.json`: `npm install --save-dev mocha chai supertest`
- [x] T002 Create a `test/` directory in the project root.
- [x] T003 Add a `test` script to `package.json`: `"test": "mocha test/**/*.test.js"`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Create a failing API contract test in `test/api.test.js` that uses `supertest` to make a GET request to `/api/config` and asserts a 200 response with the expected JSON structure.
- [x] T005 [P] Create a failing frontend integration test in `test/frontend.test.js` that verifies the end-to-end flow of fetching the configuration and updating a mock UI element.

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T006 Create the new serverless function `api/config.js`. It should read `TELEGRAM_BOT_USERNAME` and `WEBSITE_URL` from `process.env` and return them as a JSON object. This should make the test from T004 pass.
- [x] T007 [P] In `site/ui.js`, create and export a function `showLoadingSpinner()` that adds a full-screen spinner to the DOM and a `hideLoadingSpinner()` function to remove it.
- [x] T008 In `site/api.js`, create and export an async function `fetchConfig()` that fetches data from `/api/config` and returns the JSON response.
- [x] T009 In `site/main.js`, modify the main initialization logic to:
    1. Call `showLoadingSpinner()`.
    2. Call `fetchConfig()` and store the result in a global variable (e.g., `window.APP_CONFIG`).
    3. Wrap the existing initialization code in a function to be called only after the config is successfully fetched.
    4. Call `hideLoadingSpinner()` after initialization is complete.

## Phase 3.4: Frontend Refactoring
- [x] T010 [P] Search the entire `/site` directory for hardcoded values like `'SteelBikeBot'` or `'https://SteelBike.ru'` and replace them with lookups from the `window.APP_CONFIG` object.
- [x] T011 [P] Specifically, refactor `site/branding.js` to use the new configuration object for any brand-related names or links.
- [ ] T012 [P] Refactor `site/index.html`, `site/map.html`, and any other HTML files containing hardcoded, client-specific links or text to be populated dynamically by JavaScript using the global config.

## Phase 3.5: Polish
- [x] T013 [P] Create a `.env.example` file in the project root, documenting all required environment variables for both Vercel and Render as specified in the feature spec (FR-007).
- [x] T014 [P] Update the main `README.md` to explain the new configuration strategy and the purpose of the `.env.example` file.
- [x] T015 Manually test the complete feature by following the steps in `quickstart.md` to ensure everything works end-to-end.

## Dependencies
- **T001-T003** (Setup) must be done before **T004-T005** (Tests).
- **T004-T005** (Tests) must be written and failing before **T006-T012** (Implementation & Refactoring).
- **T006** (API implementation) blocks **T004** from passing.
- **T008 & T009** (Frontend logic) block **T005** from passing.
- All other tasks should be complete before **T015** (Manual testing).

## Parallel Example
```
# Once setup is done, these tests can be developed in parallel:
Task: "T004 [P] Create a failing API contract test..."
Task: "T005 [P] Create a failing frontend integration test..."

# Once the core frontend logic is in place, these refactoring tasks can be done in parallel:
Task: "T010 [P] Search the entire /site directory for hardcoded values..."
Task: "T011 [P] Specifically, refactor site/branding.js..."
Task: "T012 [P] Refactor site/index.html, site/map.html..."
```
