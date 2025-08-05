const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { discordToken } = require('./config');
const fs = require('fs');
const path = require('path');
const { hasVerifiedRole, hasAdminRole } = require('./roles');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.data || !command.data.name) {
    console.error(`Command file ${file} is missing 'data' or 'data.name'.`);
    continue;
  }
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Start background video tracking logic
  require('./videoTrackingService')(client);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    if (command.verifiedOnly && !hasVerifiedRole(interaction.member)) {
      await interaction.reply({ content: 'You need to be verified to use this command.', ephemeral: true });
      return;
    }
    if (command.adminOnly && !hasAdminRole(interaction.member)) {
      await interaction.reply({ content: 'This command is admin-only.', ephemeral: true });
      return;
    }
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
  }
});

client.login(discordToken);