const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show your stats in active campaigns')
    .addStringOption(opt => opt.setName('campaign').setDescription('Campaign name').setRequired(false)),
  verifiedOnly: true,
  adminOnly: false,
  async execute(interaction) {
    const campaign = interaction.options.getString('campaign');
    const db = await getConnection();
    let query = 'SELECT * FROM video_submissions WHERE discord_id = ? AND server_id = ?';
    let params = [interaction.user.id, interaction.guild.id];
    if (campaign) {
      query += ' AND campaign_name = ?';
      params.push(campaign);
    }
    const [rows] = await db.query(query, params);

    if (!rows.length) {
      await interaction.reply({ content: 'No stats found for you.', ephemeral: true });
      return;
    }

    let totalViews = 0;
    let totalEarnings = 0;
    rows.forEach(row => {
      totalViews += row.views || 0;
      totalEarnings += row.earnings || 0;
    });

    await interaction.reply({
      content: `Stats for ${campaign || 'all campaigns'}: \nViews: ${totalViews}\nEarnings: $${totalEarnings.toFixed(2)}`,
      ephemeral: true
    });
  }
};
