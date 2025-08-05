const { getUser } = require('./api');
const { getConnection } = require('../db');

async function verifyTikTokUser(interaction, username, code) {
  try {
    const userData = await getUser(username);
    if (!userData || !userData.data || !userData.data.bio) {
      return { success: false, message: 'Could not fetch profile.' };
    }
    const foundCode = userData.data.bio.includes(code);
    if (foundCode) {
      const db = await getConnection();
      await db.query('REPLACE INTO verified_accounts (discord_id, platform, username, code, date_verified) VALUES (?, ?, ?, ?, ?)', [interaction.user.id, 'tiktok', username, code, new Date()]);
      return { success: true };
    }
    return { success: false, message: 'Code not found in TikTok bio.' };
  } catch (e) {
    return { success: false, message: 'TikTok verification failed.' };
  }
}

module.exports = { verifyTikTokUser };