require('dotenv').config();

const {Client, Intents, Collection} = require('discord.js');
const {sequelize, User, Role, UserRole, Channel, ChannelRole, Token} = require('./db/db');
const fs = require("fs");
const token = process.env.BOT_TOKEN;

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['USER', 'CHANNEL', 'MESSAGE']});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

sequelize.sync();

client.on('ready', async () => {
  const guild = await client.guilds.fetch(process.env.BOT_GUILD_ID);
  const users = await guild.members.fetch();
  for (const user of users) {
    if (!user.roles.cache.has(process.env.BOT_VERIFIED_ID)) continue;
    const u = await User.findOne({
      where: {
        snowflake: user.id
      }
    });
    if (u && u.verified) {
      const roles = await u.getRoles();
      const roleSnowflakes = roles.map(role => role.snowflake).filter(s => s !== process.env.BOT_VERIFIED_ID);
      for (const snowflake of roleSnowflakes) {
        user.roles.add(snowflake);
      }
    }
  }
})

client.login(token);