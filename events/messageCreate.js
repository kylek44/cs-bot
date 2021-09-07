const {sequelize, User, Role, UserRole, Channel, ChannelRole, Token} = require('../db/db');

const {finishVerification} = require('../util/verify');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    let fullMessage = null;

    if (message.partial) {
      fullMessage = await message.fetch();
    } else {
      fullMessage = message;
    }

    if (fullMessage.author.bot || fullMessage.guild) return;

    console.log(fullMessage);
    const guild = await fullMessage.client.guilds.resolve(process.env.BOT_GUILD_ID);
    const userId = await fullMessage.author.id;
    const member = await guild.members.fetch(userId);

    if (member) {
      message.reply(`If you are trying to verify your account run the '/verify begin' or '/verify finish' command. Just type /v and the command should show up. If you have any problems please contact Kyle Kelly.`);
    } else {
      message.reply(`You are not a member of the UAFS Computer Science Discord.`);
    }
  }
}