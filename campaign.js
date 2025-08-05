const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('campaign')
    .setDescription('Create a new campaign (admin only)')
    .addStringOption(opt => opt.setName('name').setDescription('Campaign name').setRequired(true))
    .addStringOption(opt => opt.setName('type').setDescription('logo|clipping|music').setRequired(true))
    .addIntegerOption(opt => opt.setName('budget').setDescription('Budget').setRequired(true))
    .addIntegerOption(opt => opt.setName('target').setDescription('Target views').setRequired(true))
    .addStringOption(opt => opt.setName('platform').setDescription('Platform').setRequired(true))
    .addIntegerOption(opt => opt.setName('cpm').setDescription('CPM').setRequired(false))
    .addStringOption(opt => opt.setName('requirements').setDescription('Requirements').setRequired(false))
    .addStringOption(opt => opt.setName('music_id').setDescription('Music ID (if music type)').setRequired(false)),
  verifiedOnly: false,
  adminOnly: true,
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const type = interaction.options.getString('type');
    const budget = interaction.options.getInteger('budget');
    const target = interaction.options.getInteger('target');
    const platform = interaction.options.getString('platform');
    const cpm = interaction.options.getInteger('cpm');
    const requirements = interaction.options.getString('requirements');
    const music_id = interaction.options.getString('music_id');
    const db = await getConnection();

    await db.query('INSERT INTO campaigns (server_id, name, type, budget, target, platform, cpm, requirements, music_id, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)', [
      interaction.guild.id, name, type, budget, target, platform, cpm, requirements, music_id
    ]);

    await interaction.reply({
      content: `Campaign "${name}" created.\nType: ${type}\nBudget: $${budget}\nTarget: ${target} views\nPlatform: ${platform}${cpm ? `\nCPM: $${cpm}` : ''}${requirements ? `\nRequirements: ${requirements}` : ''}${music_id ? `\nMusic ID: ${music_id}` : ''}`,
      ephemeral: false
    });
  }
};