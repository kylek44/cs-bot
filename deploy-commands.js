require('dotenv').config();

const fs = require('fs');

const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const token = process.env.BOT_TOKEN;
const clientId = process.env.BOT_CLIENT_ID;
const guildId = process.env.BOT_GUILD_ID;

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId, guildId),
      {body: commands}
      // Routes.applicationGuildCommands(clientId, guildId),
      //   {body: commands}
    );

    console.log('Successfully registered application (/) commands');
  } catch (error) {
    console.error(error);
  }
})();