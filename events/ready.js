module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    // const guild = await client.guilds.resolve(process.env.BOT_GUILD_ID);
    // const unverified = await guild.roles.resolve(process.env.BOT_UNVERIFIED_ID);
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // console.log(unverified);
  }
};