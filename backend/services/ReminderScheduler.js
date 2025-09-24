const cron = require('node-cron');
const UserAlertState = require('../models/UserAlertState');
const Alert = require('../models/Alert');
const mongoose = require('mongoose');

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

const triggerReminders = async () => {
  console.log('Running reminder check job...');
  const now = new Date();

  try {
    // Find all unread, non-snoozed alert states for active alerts
    const statesToRemind = await UserAlertState.find({
      status: 'Unread',
      $or: [
        { snoozedUntil: { $exists: false } },
        { snoozedUntil: { $lt: now } }
      ],
      lastNotifiedAt: { $lt: new Date(now.getTime() - TWO_HOURS_IN_MS) }
    }).populate('alertId');

    if (statesToRemind.length === 0) {
      console.log('No users to remind at this time.');
      return;
    }

    const remindedStates = [];
    for (const state of statesToRemind) {
      const alert = state.alertId;
      // Double check if the alert is active and reminders are enabled
      if (alert && !alert.archived && alert.remindersEnabled && now >= alert.startTime && now < alert.expiryTime) {
        remindedStates.push(state._id);
      }
    }

    if (remindedStates.length > 0) {
      // Bulk update the `lastNotifiedAt` timestamp for all users who need a reminder
      await UserAlertState.updateMany(
        { _id: { $in: remindedStates } },
        { $set: { lastNotifiedAt: now } }
      );
      console.log(`Successfully sent reminders to ${remindedStates.length} user(s).`);
      // In a real app, you would emit a WebSocket event here for each user.
    } else {
        console.log('No valid, active alerts required reminders.');
    }

  } catch (error) {
    console.error('Error in reminder scheduler:', error);
  }
};

// Schedule to run every 5 minutes to check for reminders
const start = () => {
  cron.schedule('*/5 * * * *', triggerReminders);
  console.log('Reminder scheduler started. Will run every 5 minutes. ⏰');
};

module.exports = { start };