# Quickstart: Manual Verification for Centralized Configuration

This guide provides the steps to manually verify that the configuration has been successfully centralized.

### Prerequisites
- A local development environment set up according to the project's main `README.md`.
- `vercel dev` running from the project root.
- A `.env` file in the root directory containing the required environment variables.

### Verification Steps

1.  **Set Environment Variables**
    - In your root `.env` file, define the following public variables:
      ```
      TELEGRAM_BOT_USERNAME=TestSteelBikeBot
      WEBSITE_URL=http://localhost:3000
      ```

2.  **Start the Development Server**
    - Run the command `vercel dev` from the project root.

3.  **Access the Frontend**
    - Open your web browser and navigate to the local URL provided by `vercel dev` (usually `http://localhost:3000`).

4.  **Verify API Call**
    - Open the browser's Developer Tools and go to the "Network" tab.
    - Refresh the page.
    - Look for a `GET` request to `/api/config`.
    - **Expected Result**: The request should have a `200 OK` status.

5.  **Inspect API Response**
    - Click on the `/api/config` request to view the response.
    - **Expected Result**: The response body should be a JSON object containing the values you set in your `.env` file:
      ```json
      {
        "telegramBotUsername": "TestSteelBikeBot",
        "websiteUrl": "http://localhost:3000"
      }
      ```

6.  **Verify UI Behavior**
    - While the page is loading, you should see a full-screen loading spinner.
    - Once loaded, inspect the UI elements that should use the configuration (e.g., links, bot names).
    - **Expected Result**: The UI should correctly display the values fetched from the API, not any old hardcoded values.

### Cleanup
- Stop the `vercel dev` server.
