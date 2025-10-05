# Feature Specification: Centralized Server-Side Configuration

**Feature Branch**: `001-server-js`
**Created**: 2025-10-06
**Status**: Draft
**Input**: User description: "я хочу чтобы все переменные абсолютно все были на стороне сервера то есть все на верселе и только server.js был на рендере чтобы там название тг бота ссылки и тд чтобы все это использовалось чисто на сервере это мне нужно чтобы копировать эти приложения для разных клиентов и очень легко расширяться"

---
## Clarifications
### Session 2025-10-06
- Q: What is the definitive list of all variables to be centralized? → A: 14 variables for Vercel (GOOGLE_API_KEY, TELEGRAM_BOT_TOKEN, POSTGRES_URL, etc.) and 6 for Render (BOT_USERNAME, POSTGRES_URL, etc.), covering all secrets, URLs, and client-specific identifiers.
- Q: How should the UI behave while waiting for the initial configuration to be fetched from the /api/config endpoint? → A: Show a full-screen loading spinner/animation.

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a developer, I want to manage all instance-specific configurations (like client names, bot details, and URLs) in one central place on the server, so that I can quickly and easily deploy new, customized instances of the application for different clients without changing the codebase.

### Acceptance Scenarios
1.  **Given** a new client requires a new application instance,
    **When** a developer sets the client's specific configuration as environment variables in the hosting environment (Vercel),
    **Then** the new instance runs with the new client's branding and settings (e.g., Telegram bot name, links) without any code modification.

2.  **Given** the frontend application has loaded in a user's browser,
    **When** it initializes,
    **Then** it fetches all necessary public configuration data from a single backend endpoint and renders the UI accordingly.

### Edge Cases
- **What happens when** the configuration endpoint is unavailable? The system MUST display a user-friendly error message and allow for a retry mechanism.
- **How does the system handle** missing optional configuration variables? The system SHOULD use sensible defaults or hide the corresponding feature if a variable is not provided.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: All configuration variables that differ between clients (e.g., Telegram bot name, external URLs, branding elements) MUST be managed as environment variables on the server-side platform (Vercel).
- **FR-002**: The frontend application (`/site`) MUST NOT contain any hardcoded, client-specific configuration values.
- **FR-003**: A dedicated, serverless API endpoint (e.g., `/api/config`) MUST be created to expose all non-sensitive, public configuration variables required by the frontend.
- **FR-004**: The frontend application MUST fetch its configuration from the `/api/config` endpoint on startup.
- **FR-005**: Sensitive information (e.g., API keys, database credentials, secret keys) MUST NOT be exposed through the `/api/config` endpoint.
- **FR-006**: All backend services, including those on Vercel and Render (`ocr-worker`, `prizmatic-server`), MUST source their configuration from environment variables set on their respective platforms.
- **FR-007**: The solution MUST clearly document the list of all required environment variables for both the Vercel and Render environments. This includes 14 variables for Vercel (e.g., `GOOGLE_API_KEY`, `TELEGRAM_BOT_TOKEN`) and 6 for Render (e.g., `BOT_USERNAME`, `POSTGRES_URL`).
- **FR-008**: The system MUST display a full-screen loading spinner while the initial frontend configuration is being fetched.

### Key Entities *(include if feature involves data)*
- **Public Configuration**: A JSON object served by the `/api/config` endpoint, containing key-value pairs for all public, client-facing settings. Example:
  ```json
  {
    "telegramBotName": "ClientPrizmaticBot",
    "supportUrl": "https://t.me/client_support",
    "termsOfServiceUrl": "/docs/client_terms.html"
  }
  ```

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed

---