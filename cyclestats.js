const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cyclestats')
    .setDescription('Show cycle stats for a campaign (admin only)')
    .addStringOption(opt => opt.setName('campaign').setDescription('Campaign name').setRequired(true)),
  verifiedOnly: false,
  adminOnly: true,
  async execute(interaction) {
    const campaign = interaction.options.getString('campaign');
    const db = await getConnection();
    const [total] = await db.query(
      'SELECT SUM(views) as totalViews, SUM(earnings) as totalEarnings, COUNT(*) as totalVideos FROM video_submissions WHERE campaign_name = ? AND server_id = ?',
      [campaign, interaction.guild.id]
    );
    const [top5] = await db.query(
      'SELECT discord_id, SUM(views) as views, SUM(earnings) as earnings FROM video_submissions WHERE campaign_name = ? AND server_id = ? GROUP BY discord_id ORDER BY views DESC LIMIT 5',
      [campaign, interaction.guild.id]
    );
    let msg = `Campaign "${campaign}" stats:\nViews: ${total[0].totalViews || 0}\nEarnings: $${(total[0].totalEarnings || 0).toFixed(2)}\nVideos: ${total[0].totalVideos || 0}\n\nTop 5 Users:\n`;
    msg += top5.map((u, i) => `${i+1}. <@${u.discord_id}> — ${u.views} views — $${u.earnings.toFixed(2)}`).join('\n');
    await interaction.reply({ content: msg, ephemeral: false });
  }
};