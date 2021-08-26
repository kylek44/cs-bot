require('dotenv').config();

const fs = require('fs');

const {Client, Intents, Collection} = require('discord.js');
const {sequelize} = require('./db/db');
const token = process.env.BOT_TOKEN;

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['USER', 'CHANNEL', 'MESSAGE']});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

sequelize.sync();

client.login(token);