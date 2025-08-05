const { SlashCommandBuilder } = require('discord.js');
const { getConnection } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payment')
    .setDescription('Save or update your payment wallet')
    .addStringOption(opt => opt.setName('coin').setDescription('usdt|usdc|eth|sol').setRequired(true))
    .addStringOption(opt => opt.setName('network').setDescription('erc20|bep20|sol').setRequired(true))
    .addStringOption(opt => opt.setName('address').setDescription('Wallet address').setRequired(true)),
  verifiedOnly: true,
  adminOnly: false,
  async execute(interaction) {
    const coin = interaction.options.getString('coin');
    const network = interaction.options.getString('network');
    const address = interaction.options.getString('address');
    const db = await getConnection();
    await db.query(
      'REPLACE INTO payment_wallets (discord_id, coin, network, address) VALUES (?, ?, ?, ?)',
      [interaction.user.id, coin, network, address]
    );
    await interaction.reply({
      content: `Your ${coin.toUpperCase()} (${network.toUpperCase()}) wallet has been updated to: ${address}`,
      ephemeral: true
    });
  }
};