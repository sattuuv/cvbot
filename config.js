require('dotenv').config();

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID, // Add this for Discord deploy script
  guildIds: process.env.GUILD_IDS ? process.env.GUILD_IDS.split(',') : [], // Comma-separated list in .env
  rapidApiKey: process.env.RAPIDAPI_KEY,
  rapidApiHost: 'tiktok-api-fast-reliable-data-scraper.p.rapidapi.com',
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  }
};