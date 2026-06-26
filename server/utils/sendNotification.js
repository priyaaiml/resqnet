cat > utils/sendNotification.js << 'EOF'
const Notification = require('../models/Notification');

const Notification = require('../models/Notification');

const sendNotification = async (io, { recipient, title, message, type, disaster }) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type: type || 'system',
      disaster
    });
    io.to(recipient.toString()).emit('notification', notification);
    return notification;
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

module.exports = sendNotification;