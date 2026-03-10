const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail, canSendEmail } = require('./emailService');

const processDueNotifications = async () => {
  const now = new Date();

  const due = await Notification.find({
    status: 'scheduled',
    scheduledAt: { $lte: now },
  })
    .limit(50)
    .sort({ scheduledAt: 1 });

  for (const notification of due) {
    try {
      if (notification.channel === 'email' && canSendEmail()) {
        const user = await User.findById(notification.user);
        if (user) {
          await sendEmail({
            to: user.email,
            subject: `Reminder: ${notification.type}`,
            text: notification.message,
          });
        }
      }

      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
    } catch (err) {
      notification.status = 'failed';
      await notification.save();
    }
  }
};

module.exports = { processDueNotifications };
