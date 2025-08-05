const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('controlpanel')
    .setDescription('Open server control panel (admin only)'),
  verifiedOnly: false,
  adminOnly: true,
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle('Server Control Panel')
      .setDescription('Toggle bot features below.')
      .setColor(0x3498db);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('toggle_submissions').setLabel('Toggle Submissions').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('toggle_leaderboard').setLabel('Toggle Leaderboard').setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });

    const msg = await interaction.fetchReply();
    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      const db = await getConnection();
      if (i.customId === 'toggle_submissions') {
        const [rows] = await db.query('SELECT submissions_enabled FROM server_settings WHERE server_id = ?', [interaction.guild.id]);
        const enabled = rows.length ? !rows[0].submissions_enabled : false;
        await db.query('REPLACE INTO server_settings (server_id, submissions_enabled) VALUES (?, ?)', [interaction.guild.id, enabled]);
        await i.reply({ content: `Submissions are now ${enabled ? 'enabled' : 'disabled'}!`, ephemeral: true });
      }
      if (i.customId === 'toggle_leaderboard') {
        const [rows] = await db.query('SELECT leaderboard_enabled FROM server_settings WHERE server_id = ?', [interaction.guild.id]);
        const enabled = rows.length ? !rows[0].leaderboard_enabled : false;
        await db.query('REPLACE INTO server_settings (server_id, leaderboard_enabled) VALUES (?, ?)', [interaction.guild.id, enabled]);
        await i.reply({ content: `Leaderboard is now ${enabled ? 'enabled' : 'disabled'}!`, ephemeral: true });
      }
    });
  }
};
