const {SlashCommandBuilder} = require("@discordjs/builders");
const {sequelize, User, Role, UserRole, Channel, ChannelRole, Token} = require('../db/db');
const logger = require('../log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload your roles from the database.'),
  async execute(interaction) {
    await interaction.deferReply();
    const guild = await interaction.client.guilds.fetch(process.env.BOT_GUILD_ID);
    const member = await guild.members.fetch(interaction.user.id);

    if (!member || !member.roles.cache.has(process.env.BOT_VERIFIED_ID)) {
      await interaction.editReply(`You are either not a member of the UAFS Computer Science discord server or you have not verified your account.`);
      return;
    }

    const user = await User.findOne({
      where: {
        snowflake: member.id
      }
    });

    const roles = await user.getRoles();
    const roleSnowflakes = roles.map(role => role.snowflake).filter(s => s !== process.env.BOT_VERIFIED_ID);

    for (const snowflake of roleSnowflakes) {
      try {
        await member.roles.add(snowflake);
      } catch (err) {
        logger.error(err);
      }
    }

    await interaction.editReply('Roles updated');
  }
};