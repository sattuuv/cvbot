const { SlashCommandBuilder } = require('discord.js');
const { verifyTikTokUser } = require('../tiktok/user');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your TikTok account')
    .addStringOption(opt => opt.setName('platform').setDescription('Platform: tiktok/instagram/youtube').setRequired(true))
    .addStringOption(opt => opt.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(opt => opt.setName('code').setDescription('Code to put in your bio').setRequired(true)),
  verifiedOnly: false,
  adminOnly: false,
  async execute(interaction) {
    const platform = interaction.options.getString('platform');
    const username = interaction.options.getString('username');
    const code = interaction.options.getString('code');
    if (platform === 'tiktok') {
      const result = await verifyTikTokUser(interaction, username, code);
      if (result.success) {
        const role = interaction.guild.roles.cache.find(r => r.name === 'verified');
        if (role) await interaction.member.roles.add(role);
        await interaction.reply({ content: 'Account verified! @verified role assigned.', ephemeral: true });
      } else {
        await interaction.reply({ content: result.message, ephemeral: true });
      }
    } else {
      await interaction.reply({ content: 'Instagram and YouTube verification coming soon.', ephemeral: true });
    }
  }
};
