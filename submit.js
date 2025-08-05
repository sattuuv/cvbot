const { SlashCommandBuilder } = require('discord.js');
const { verifyTikTokVideo } = require('../tiktok/video');
const { normalizeTikTokUrl } = require('../utils/urlValidator');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Submit a campaign video')
    .addStringOption(opt => opt.setName('platform').setDescription('Platform').setRequired(true))
    .addStringOption(opt => opt.setName('video_url').setDescription('Video URL').setRequired(true))
    .addStringOption(opt => opt.setName('campaign').setDescription('Campaign name').setRequired(true))
    .addStringOption(opt => opt.setName('campaign_music_id').setDescription('Campaign Music ID').setRequired(false)),
  verifiedOnly: true,
  adminOnly: false,
  async execute(interaction) {
    const platform = interaction.options.getString('platform');
    const videoUrl = interaction.options.getString('video_url');
    const campaign = interaction.options.getString('campaign');
    const campaignMusicId = interaction.options.getString('campaign_music_id');
    const db = await getConnection();

    // Check if submissions are enabled for this server
    const [settings] = await db.query('SELECT submissions_enabled FROM server_settings WHERE server_id = ?', [interaction.guild.id]);
    if (settings.length && !settings[0].submissions_enabled) {
      await interaction.reply({ content: 'Submissions are currently disabled by admin.', ephemeral: true });
      return;
    }

    // Check if campaign is completed
    const [campaignRows] = await db.query('SELECT completed FROM campaigns WHERE server_id = ? AND name = ?', [interaction.guild.id, campaign]);
    if (!campaignRows.length || campaignRows[0].completed) {
      await interaction.reply({ content: 'This campaign is completed or does not exist.', ephemeral: true });
      return;
    }

    if (platform === 'tiktok') {
      const normUrl = normalizeTikTokUrl(videoUrl);
      if (!normUrl) {
        await interaction.reply({ content: 'Invalid TikTok video URL!', ephemeral: true });
        return;
      }
      const videoId = normUrl.match(/video\/(\d+)/)[1];
      const result = await verifyTikTokVideo(videoId, interaction.user.id, campaignMusicId, campaign);
      if (result.success) {
        await interaction.reply({ content: `Video submitted! Owner: ${result.videoOwner}, Music: ${result.musicId}`, ephemeral: true });
      } else {
        await interaction.reply({ content: result.error, ephemeral: true });
      }
    } else {
      await interaction.reply({ content: 'Instagram and YouTube submission coming soon.', ephemeral: true });
    }
  }
};