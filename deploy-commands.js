const { REST, Routes } = require('discord.js');
const { discordToken, clientId, guildIds } = require('./config');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(discordToken);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands for all guilds.`);

    for (const guildId of guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`Successfully reloaded application (/) commands for guild ${guildId}.`);
    }
  } catch (error) {
    console.error(error);
  }
})();