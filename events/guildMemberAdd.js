const logger = require('../log');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    await member.roles.set([process.env.BOT_UNVERIFIED_ID]);
    logger.info(`Member: ${member.user.username} Snowflake: ${member.id} given unverified role`);
  }
}