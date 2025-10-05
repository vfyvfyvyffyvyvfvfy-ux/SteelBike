# Data Model: Centralized Configuration

This feature introduces a non-persistent data model for fetching public configuration.

## 1. PublicConfiguration Object

Represents the set of public-safe configuration variables needed by the frontend.

- **Source**: Dynamically constructed by the `/api/config` endpoint from server-side environment variables.
- **Persistence**: This object is not stored directly in the database. It is generated on-the-fly for each request.

### Attributes

| Name | Type | Description | Example | Required |
|---|---|---|---|---|
| `telegramBotUsername` | string | The username of the Telegram bot (without the `@`). | `"ClientPrizmaticBot"` | Yes |
| `websiteUrl` | string | The main URL for the application. | `"https://client.prizmatic.ru"` | Yes |
| `supportUrl` | string | The URL for the customer support chat or page. | `"https://t.me/client_support"` | No |
| `termsOfServiceUrl` | string | URL to the terms of service document. | `"/docs/client_terms.html"` | No |

### Validation Rules
- The `/api/config` endpoint MUST NOT include any variables that are considered sensitive (e.g., containing keys, secrets, or database URLs).
- The endpoint should only expose variables that are explicitly designated as safe for public client-side access.
