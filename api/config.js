// /api/config.js

module.exports = (req, res) => {
  try {
    // List of public-safe environment variables
    const publicConfig = {
      telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME,
      websiteUrl: process.env.WEBSITE_URL,
      // Add other public-safe variables here as needed
    };

    // Basic validation to ensure essential config is present
    if (!publicConfig.telegramBotUsername || !publicConfig.websiteUrl) {
      console.error('Missing required environment variables for /api/config');
      return res.status(500).json({ error: 'Server configuration is incomplete.' });
    }

    res.status(200).json(publicConfig);
  } catch (error) {
    console.error('Error in /api/config:', error);
    res.status(500).json({ error: 'Failed to load configuration.' });
  }
};