const nodemailer = require('nodemailer');

const canSendEmail = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const getTransporter = () => {
  const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, text }) => {
  if (!canSendEmail()) return { skipped: true };

  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || 'no-reply@healthwellness.local';

  await transporter.sendMail({ from, to, subject, text });
  return { sent: true };
};

module.exports = { canSendEmail, sendEmail };
