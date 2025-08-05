const { getConnection } = require('./db');
const { getVideo } = require('./tiktok/api');

const SIX_HOURS = 6 * 60 * 60 * 1000;
const TEN_HOURS = 10 * 60 * 60 * 1000;
const TWO_DAYS = 48 * 60 * 60 * 1000;

async function trackVideos() {
  const db = await getConnection();
  // Fetch all videos that might need tracking
  const [rows] = await db.query('SELECT video_id, submitted_at FROM video_submissions');
  const now = Date.now();

  for (const row of rows) {
    const videoId = row.video_id;
    const submittedAt = new Date(row.submitted_at).getTime();
    const age = now - submittedAt;

    // Tracking interval logic
    let interval = null;
    if (age < TWO_DAYS) {
      interval = SIX_HOURS; // First 48hr: every 6hr
    } else {
      interval = TEN_HOURS; // After: every 10hr
    }

    // Should we update? Check last_tracked_at
    const [videoRows] = await db.query(
      'SELECT last_tracked_at FROM video_submissions WHERE video_id=?', [videoId]
    );
    let lastTracked = videoRows[0]?.last_tracked_at;
    if (lastTracked) {
      lastTracked = new Date(lastTracked).getTime();
      if (now - lastTracked < interval) continue; // Skip: not time yet
    }

    try {
      const videoData = await getVideo(videoId);
      if (!videoData) {
        console.log(`No data found for video ${videoId}`);
        continue;
      }
      await db.query(
        `UPDATE video_submissions
         SET views=?, last_tracked_at=NOW()
         WHERE video_id=?`,
        [
          videoData.stats?.playCount || 0,
          videoId
        ]
      );
      console.log(`Updated stats for video ${videoId}: Views=${videoData.stats?.playCount}`);
    } catch (err) {
      console.error(`Error fetching video data for ${videoId}:`, err);
    }
  }
}

// Schedule the tracking logic
module.exports = (client) => {
  setInterval(trackVideos, SIX_HOURS); // Run every 6hr
  trackVideos(); // Run once at startup
};