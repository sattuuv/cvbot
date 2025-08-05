-- Permanent/global
CREATE TABLE IF NOT EXISTS verified_accounts (
  discord_id VARCHAR(32) PRIMARY KEY,
  platform VARCHAR(16),
  username VARCHAR(64),
  code VARCHAR(8),
  date_verified DATETIME
);

CREATE TABLE IF NOT EXISTS payment_wallets (
  discord_id VARCHAR(32) PRIMARY KEY,
  coin VARCHAR(8),
  network VARCHAR(8),
  address VARCHAR(128)
);

-- Server-specific
CREATE TABLE IF NOT EXISTS campaigns (
  server_id VARCHAR(32),
  name VARCHAR(64),
  type VARCHAR(16),
  budget INT,
  target INT,
  platform VARCHAR(16),
  cpm INT,
  requirements TEXT,
  music_id VARCHAR(32),
  completed BOOLEAN DEFAULT 0,
  PRIMARY KEY(server_id, name)
);

CREATE TABLE IF NOT EXISTS server_settings (
  server_id VARCHAR(32) PRIMARY KEY,
  submissions_enabled BOOLEAN DEFAULT TRUE,
  leaderboard_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS video_submissions (
  server_id VARCHAR(32),
  discord_id VARCHAR(32),
  campaign_name VARCHAR(64),
  video_id VARCHAR(32),
  platform VARCHAR(16),
  music_id VARCHAR(32),
  views INT DEFAULT 0,
  earnings FLOAT DEFAULT 0,
  submitted_at DATETIME,
  last_tracked_at DATETIME,           -- New: track when stats were last updated
  status VARCHAR(16) DEFAULT 'tracking', -- New: status for tracking, error, etc.
  PRIMARY KEY(server_id, discord_id, campaign_name, video_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_submissions_video_id ON video_submissions(video_id);
CREATE INDEX IF NOT EXISTS idx_video_submissions_submitted_at ON video_submissions(submitted_at);

-- (Optional) Foreign keys for referential integrity
-- Uncomment if you want strict relationships and your DB engine supports it
-- ALTER TABLE video_submissions
--   ADD FOREIGN KEY (discord_id) REFERENCES verified_accounts(discord_id),
--   ADD FOREIGN KEY (server_id, campaign_name) REFERENCES campaigns(server_id, name);