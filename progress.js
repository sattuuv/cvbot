const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('progress')
    .setDescription('Update campaign progress bar (admin only)')
    .addStringOption(opt => opt.setName('campaign').setDescription('Campaign name').setRequired(true)),
  verifiedOnly: false,
  adminOnly: true,
  async execute(interaction) {
    const campaign = interaction.options.getString('campaign');
    const db = await getConnection();
    const [campaignRows] = await db.query('SELECT SUM(views) as views, target, cpm FROM campaigns LEFT JOIN video_submissions ON campaigns.name = video_submissions.campaign_name WHERE campaigns.name = ? AND campaigns.server_id = ?', [campaign, interaction.guild.id]);
    if (!campaignRows.length) {
      await interaction.reply({ content: 'No such campaign found.', ephemeral: true });
      return;
    }
    const guild = interaction.guild;
    const vc = guild.channels.cache.find(ch =>
      ch.type === 2 && ch.name.startsWith(campaign)
    );
    if (!vc) {
      await interaction.reply({ content: 'No voice channel for this campaign found.', ephemeral: true });
      return;
    }
    const percent = Math.min(100, Math.round((campaignRows[0].views / campaignRows[0].target) * 100));
    await vc.setName(`${campaign} - (${campaignRows[0].views}/${campaignRows[0].target}) - ${percent}% - $${campaignRows[0].cpm}rpm`);
    await interaction.reply({ content: 'Progress bar updated.', ephemeral: true });
  }
};