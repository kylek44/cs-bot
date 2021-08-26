const {SlashCommandBuilder} = require("@discordjs/builders");
const {verifyMember, finishVerification} = require('../util/verify');
const logger = require('../log');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your account.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('begin')
        .setDescription('Request a verification email from the bot.')
        .addStringOption(option =>
          option
            .setName('email')
            .setDescription('Your UAFS email (i.e. email@g.uafs.edu)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('finish')
        .setDescription('Finish verification process.')
        .addStringOption(option =>
          option
            .setName('token')
            .setDescription(`The token received in the verification email (i.e. UAFSTOKEN1234...)`)
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (interaction.inGuild()) {
      await interaction.reply({content: `Please perform verification commands from a direct message`, ephemeral: true});
      try {
        await interaction.user.send(`Please perform verification commands from a direct message`);
      } catch (error) {
        logger.error(error);
      }
      return;
    }

    if (!interaction.options) return;

    await interaction.reply({content: 'Processing', ephemeral: true});
    const subcommand = interaction.options.data[0];
    const guild = await interaction.client.guilds.fetch(process.env.BOT_GUILD_ID);
    const member = await guild.members.fetch(interaction.user.id);

    if (subcommand.name === 'begin') {
      const email = subcommand.options[0].value.trim();
      if (member) {
        await verifyMember(interaction, member, email);
      }
    } else if (subcommand.name === 'finish') {
       const token = subcommand.options[0].value.trim();
       if (member) {
         await finishVerification(interaction, member, token);
       }
    }
  }
};