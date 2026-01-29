const nodemailer = require("nodemailer");

const sendMail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",  // use service instead of host/port
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD, // App Password
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
