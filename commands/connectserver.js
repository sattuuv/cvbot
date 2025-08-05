const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('connectserver')
    .setDescription('Register and get verified role via server'),
  verifiedOnly: false,
  adminOnly: false,
  async execute(interaction) {
    if (interaction.channel.name !== 'register') {
      await interaction.reply({ content: 'This command can only be used in #register channel.', ephemeral: true });
      return;
    }
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM verified_accounts WHERE discord_id = ?', [interaction.user.id]);
    if (rows.length > 0) {
      const role = interaction.guild.roles.cache.find(r => r.name === 'verified');
      if (role) await interaction.member.roles.add(role);
      await interaction.reply({ content: 'You are now verified on this server!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'No connected accounts found. Use /verify first.', ephemeral: true });
    }
  }
};
