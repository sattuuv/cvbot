const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show leaderboard for a campaign')
    .addStringOption(opt => opt.setName('campaign').setDescription('Campaign name').setRequired(true)),
  verifiedOnly: true,
  adminOnly: false,
  async execute(interaction) {
    if (interaction.channel.name !== 'leaderboard') {
      await interaction.reply({ content: 'Leaderboard command can only be used in #leaderboard channel.', ephemeral: true });
      return;
    }
    const campaign = interaction.options.getString('campaign');
    const db = await getConnection();
    const [rows] = await db.query(
      'SELECT discord_id, SUM(views) as totalViews, SUM(earnings) as totalEarnings, COUNT(*) as videoCount FROM video_submissions WHERE campaign_name = ? AND server_id = ? GROUP BY discord_id ORDER BY totalViews DESC LIMIT 10',
      [campaign, interaction.guild.id]
    );
    if (!rows.length) {
      await interaction.reply({ content: 'No leaderboard data for this campaign.', ephemeral: true });
      return;
    }

    const leaderboard = rows.map((row, i) =>
      `${i + 1}. <@${row.discord_id}> — ${row.totalViews} views — $${row.totalEarnings.toFixed(2)} — ${row.videoCount} videos`
    ).join('\n');

    await interaction.reply({
      content: `Leaderboard for "${campaign}":\n${leaderboard}`,
      ephemeral: false
    });
  }
};