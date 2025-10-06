// API endpoint to serve configuration from environment variables
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/javascript');

  // Build config from environment variables
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://qjrycnazrzetnciyqakm.supabase.co',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcnljbmF6cnpldG5jaXlxYWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODcyMTYsImV4cCI6MjA3NTI2MzIxNn0.5SLKsfOjnSk-rehECpH1FPgCflCl1mi511VBTsDUXdU',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || 'AIzaSyCds0FmujbSW88GPJwXeyhIjD8JOdyx5uU',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyCds0FmujbSW88GPJwXeyhIjD8JOdyx5uU',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '8161502944:AAG7jnhO963k4w0RXAy808qL9IMVn3sASGQ',
    YOOKASSA_SHOP_ID: process.env.YOOKASSA_SHOP_ID || '1165363',
    YOOKASSA_SECRET_KEY: process.env.YOOKASSA_SECRET_KEY || 'live_HOBpl4TqCwl-BBo2JP7hDCUpCIKJbY4pddBAHO4R-eU',
    BOT_NOTIFY_URL: process.env.BOT_NOTIFY_URL || 'https://steelbikedogovor.onrender.com/notify',
    OCR_WORKER_URL: process.env.OCR_WORKER_URL || 'https://832a1274ed7e.ngrok-free.app',
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || 'your_super_secret_admin_key',
    INTERNAL_SECRET: process.env.INTERNAL_SECRET || 'MySuperSecretKeyForBikeAppOCR123!',
    CONTRACTS_API_URL: process.env.CONTRACTS_API_URL || 'https://steelbikedogovor.onrender.com'
  };

  // Return as JavaScript that sets window.CONFIG
  const jsContent = `window.CONFIG = ${JSON.stringify(config, null, 2)};
const CONFIG = window.CONFIG;`;

  res.status(200).send(jsContent);
}