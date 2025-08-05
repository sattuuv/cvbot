const { getVideo } = require('./api');
const { getConnection } = require('../db');

async function verifyTikTokVideo(videoId, discordId, campaignMusicId, campaignName) {
  try {
    const videoData = await getVideo(videoId);
    const videoOwner = videoData.data?.aweme_detail?.author?.unique_id || null;
    const musicId = videoData.data?.aweme_detail?.music?.id || null;

    const db = await getConnection();
    const [accountRows] = await db.query('SELECT * FROM verified_accounts WHERE discord_id = ?', [discordId]);
    if (!accountRows.length || accountRows[0].username !== videoOwner) {
      return { success: false, error: 'Account not verified for this video.' };
    }

    const [campaignRows] = await db.query('SELECT * FROM campaigns WHERE name = ? AND completed = 0', [campaignName]);
    if (!campaignRows.length) {
      return { success: false, error: 'This campaign is completed or does not exist.' };
    }

    if (campaignRows[0].type === 'music' && campaignMusicId && musicId !== campaignMusicId) {
      return { success: false, error: 'Required campaign music not used in video.' };
    }

    // Prevent duplicate submissions
    const [videoRows] = await db.query(
      'SELECT * FROM video_submissions WHERE discord_id = ? AND campaign_name = ? AND video_id = ?', [discordId, campaignName, videoId]);
    if (videoRows.length) {
      return { success: false, error: 'Duplicate video submission.' };
    }

    await db.query(
      'INSERT INTO video_submissions (server_id, discord_id, campaign_name, video_id, platform, music_id, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [interaction.guild.id, discordId, campaignName, videoId, 'tiktok', musicId, new Date()]
    );
    return { success: true, videoOwner, musicId };
  } catch (e) {
    return { success: false, error: 'Video verification failed.' };
  }
}

module.exports = { verifyTikTokVideo };
