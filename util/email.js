const nodemailer = require('nodemailer');

module.exports = async (toEmail, token) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'uafsbot@gmail.com',
      pass: process.env.BOT_EMAIL_PASS
    }
  });

  let info = await transporter.sendMail({
    from: '"UAFS Registration Bot" <uafsbot@gmail.com>',
    to: toEmail,
    subject: 'Account Verification',
    html: `<h3>Paste the following into a direct message to the UAFS Registration Bot after the '/verify finish' command</h3><p>${token}</p>`
  });
}