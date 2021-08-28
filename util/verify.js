const crypto = require('crypto');
const {promisify} = require('util');
const randomBytesAsync = promisify(crypto.randomBytes);

const {sequelize, User, Role, UserRole, Channel, ChannelRole, Token} = require('../db/db');

const logger = require('../log');
const emailSend = require('../util/email');

exports.verifyMember = async (interaction, member, email) => {
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      const output = `The email '${email}' does not exist. Please check the spelling.\n\nIf the email is correct please direct message Kyle Kelly.`;
      await interaction.user.send(output);
      const name = member.nickname ? member.nickname : interaction.user.name;
      logger.info(`Member: ${name} attempted to verify email ${email}`);
      return;
    }
    if (user.verified) {
      const output = `The email '${email}' has already been verified`;
      await interaction.user.send(output);
      const name = member.nickname ? member.nickname : interaction.user.username;
      const snowflake = member.id;
      logger.warn(`Verified email has been attempted to be verified again. Email: ${email} Member Attempting: ${name} Snowflake: ${snowflake}`);
      return;
    }
    let tokens = await Token.findAll({
      where: {
        userId: user.id
      }
    });
    let token;
    if (tokens.length === 0) {
      let buffer = await randomBytesAsync(16);
      token = Token.build({token: 'UAFSTOKEN' + buffer.toString('hex'), userId: user.id, snowflake: interaction.user.id});
      await token.save();
    } else {
      const output = `You have already been sent a confirmation email. Check your spam folder.\n\nSending another confirmation email to '${email}' just in case.`
      await interaction.user.send(output);
      token = tokens[0];
      logger.info(`Resending confirmation email to ${email}`);
    }

    await emailSend(email, token.token.toString());
    await interaction.user.send(`A confirmation email has been sent to '${email}'. It may take a few minutes to appear in your inbox. Please also check your spam folder.`);
    logger.info(`Confirmation email sent to ${email}`);
  } catch (error) {
    logger.error(error);
  }
};

exports.finishVerification = async (interaction, member, token) => {
  try {
    const user = await getUserFromToken(token);
    if (!user) {
      await interaction.user.send(`The token '${token}' does not exist.`);
      return;
    }
    if (user.verified) {
      await interaction.user.send(`Your account is already verified.`);
      return;
    }
    const name = user.nickname ? user.nickname : user.firstName + " " + user.lastName;
    await member.roles.remove(process.env.BOT_UNVERIFIED_ID);
    await member.roles.add(process.env.BOT_VERIFIED_ID);
    try {
      await member.setNickname(name);
    } catch (error) {
      logger.error(error);
    }
    await interaction.user.send('Your account has been verified');
    user.verified = true;
    user.snowflake = member.id;
    await user.save();
    const userRole = UserRole.build({userId: user.id, roleId: process.env.BOT_VERIFIED_ROLE_ID});
    await userRole.save();
    const roles = await user.getRoles();
    const roleSnowflakes = roles.map(role => role.snowflake).filter(s => s !== process.env.BOT_VERIFIED_ID);
    console.log(roleSnowflakes);
    for (const snowflake of roleSnowflakes) {
      try {
        await member.roles.add(snowflake);
      } catch (err) {
        logger.error(err);
      }
    }
    // try {
    //   await member.roles.add(roleSnowflakes);
    // } catch (err) {
    //   logger.error(err);
    // }
    await Token.destroy({
      where: {
        userId: user.id
      }
    });
    logger.info(`Updated roles for ${name}`);
  } catch (error) {
    logger.error(error);
  }
};

const getUserFromToken = async (token) => {
  const t = await Token.findOne({
    where: {
      token: token
    }
  });
  if (!t) {
    return null;
  }
  return await User.findOne({
    where: {
      id: t.userId
    }
  });
}