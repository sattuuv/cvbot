# ClipVault Discord Bot

A professional multi-server campaign management Discord bot for TikTok, Instagram, and YouTube, with full role-based permissions, automated tracking, control panel, and MySQL backend.

## Features

- Modular commands, role enforcement (@verified/@admin)
- Control panel with buttons to toggle features per-server
- Automated video stat tracking (6/10 hour cycle)
- Global and server-specific data separation
- Campaign creation, progress, completion logic
- TikTok API integration via RapidAPI
- High-quality error handling and user feedback

## Setup

1. Clone the repo
2. Install dependencies:  
   `npm install discord.js mysql2 axios dotenv node-cron`
3. Configure `.env` with:
   ```
   DISCORD_TOKEN=your_bot_token
   RAPIDAPI_KEY=your_rapidapi_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_db_password
   DB_NAME=clipvault
   ```
4. Create MySQL database and run `db/schema.sql`
5. Start the bot:  
   `node index.js`

## Commands

See [COMMANDS.md](COMMANDS.md) for detail.

## Notes

- Expand IG/YouTube logic as needed
- All DB fields match TikTok API response
- All commands modular and maintainable
