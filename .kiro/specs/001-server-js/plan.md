# Implementation Plan: Centralized Server-Side Configuration

**Branch**: `001-server-js` | **Date**: 2025-10-06 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `C:\Users\Kerpat\Desktop\SteelBike\.kiro\specs\001-server-js\spec.md`

## Summary
This feature refactors the application to centralize all configuration on the server side. It introduces a new `/api/config` endpoint to provide public configuration to the frontend, which will be modified to fetch this data on startup. This change will simplify multi-client deployments and improve security by removing hardcoded values from the client-side code.

## Technical Context
**Language/Version**: Node.js (for `/api`), Vanilla JavaScript (for `/site`)
**Primary Dependencies**: @supabase/supabase-js
**Storage**: Supabase (PostgreSQL)
**Testing**: Mocha/Chai selected as the testing framework (see `research.md`).
**Target Platform**: Web (Telegram Mini App)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: p95 latency for the `/api/config` endpoint should be < 300ms.
**Constraints**: Sensitive environment variables MUST NOT be exposed to the frontend.
**Scale/Scope**: This change affects all frontend pages that use configuration and introduces one new API endpoint.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*Based on Constitution v1.0.0. All checks must pass.*

**Code (8.1)**
- [x] **Simplicity**: Is the solution using Vanilla JS with minimal dependencies? (Yes, no new runtime dependencies are added).
- [x] **Readability**: Are variable and function names clear and understandable? (Yes, the new endpoint and frontend logic will be clearly named).
- [x] **Modularity**: Is the code logically separated into modules? (Yes, a new, separate `/api/config.js` will be created).
- [x] **DRY**: Does the solution avoid repeating code unnecessarily? (Yes, it centralizes config access).

**API (8.2)**
- [x] **RESTful**: Are HTTP methods used according to REST principles? (Yes, uses a `GET` request).
- [x] **JSON**: Is all data exchanged in JSON format? (Yes).
- [x] **Error Handling**: Does the API return clear, understandable error messages? (Yes, the contract defines error responses).
- [x] **Validation**: Is all input data validated on the backend? (N/A, this is a parameter-less GET request).

**Database (8.3)**
- [x] **Normalization**: Does the data model avoid data duplication? (Yes, config is read from env, not stored in DB).
- [x] **Indexes**: Are indexes planned for frequently queried fields? (N/A).
- [x] **Transactions**: Are critical database operations wrapped in transactions? (N/A).
- [x] **RLS**: Are Row Level Security policies considered for data access? (N/A).

**UI/UX (8.4)**
- [x] **Telegram Design**: Does the UI follow Telegram's design guidelines? (Yes, the loading spinner will match the app theme).
- [x] **Responsiveness**: Is the interface adaptive to different screen sizes? (Yes, the loading spinner will be centered and full-screen).
- [x] **Performance**: Is the solution optimized for fast loading times? (Yes, the endpoint is lightweight).
- [x] **Clarity**: Is the user interface intuitive and easy to navigate? (Yes, the loading spinner provides clear feedback).

## Project Structure

### Documentation (this feature)
```
.kiro/specs/001-server-js/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/
    └── config-api.yaml  # Phase 1 output
```

### Source Code (repository root)
```
backend/ (represents /api directory)
└── src/
    └── api/
        └── config.js # New API endpoint

frontend/ (represents /site directory)
└── src/
    ├── main.js       # Modified to fetch config
    ├── api.js        # Modified to include config fetch
    └── ui.js         # Modified to show loading spinner
```

**Structure Decision**: The feature will add one new file to the `/api` directory and modify existing files in the `/site` directory, following the established project structure.

## Phase 0: Outline & Research
- **Status**: [x] Complete
- **Output**: [research.md](./research.md)

## Phase 1: Design & Contracts
- **Status**: [x] Complete
- **Outputs**:
  - [data-model.md](./data-model.md)
  - [contracts/config-api.yaml](./contracts/config-api.yaml)
  - [quickstart.md](./quickstart.md)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do.*

**Task Generation Strategy**:
- Create a new serverless function `api/config.js` to read public environment variables and return them as JSON.
- Modify `site/api.js` to add a function that fetches data from `/api/config`.
- Modify `site/main.js` to call the new fetch function on startup and store the configuration globally.
- Modify `site/ui.js` to implement the full-screen loading spinner.
- Refactor all frontend files (`*.js`, `*.html`) to remove hardcoded configuration values and use the globally stored configuration instead.
- Create a new `.env.example` file or update the existing one to document all required environment variables.

**Ordering Strategy**:
1.  Backend: Implement `api/config.js`.
2.  Frontend: Implement the loading spinner and config fetching logic.
3.  Frontend Refactor: Replace all hardcoded values.
4.  Documentation: Update `.env.example`.

## Progress Tracking
**Phase Status**:
- [x] Phase 0: Research complete
- [x] Phase 1: Design complete
- [x] Phase 2: Task planning approach described

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented: None
