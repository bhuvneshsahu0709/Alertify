const UserAlertState = require('../models/UserAlertState');
const Alert = require('../models/Alert');

exports.getActiveAlerts = async (req, res) => {
  try {
    const now = new Date();
    // Find all alert states for the current user
    const userAlerts = await UserAlertState.find({ userId: req.user.id })
      .populate({
        path: 'alertId',
        match: { // Only populate alerts that are currently active
          archived: false,
          startTime: { $lte: now },
          expiryTime: { $gt: now },
        },
      })
      .sort({ createdAt: -1 });

    // Filter out states where the alert was not populated (because it was inactive)
    const activeAlerts = userAlerts.filter(ua => ua.alertId !== null);
    
    res.json(activeAlerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.markAsRead = async (req, res) => {
  const { alertId } = req.params;
  try {
    const updatedState = await UserAlertState.findOneAndUpdate(
      { userId: req.user.id, alertId },
      { $set: { status: 'Read' } },
      { new: true }
    );
    if (!updatedState) return res.status(404).json({ msg: 'Alert state not found' });
    res.json(updatedState);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.snoozeAlert = async (req, res) => {
  const { alertId } = req.params;
  try {
    // Snooze until the end of the current day in UTC
    const snoozedUntil = new Date();
    snoozedUntil.setUTCHours(23, 59, 59, 999);

    const updatedState = await UserAlertState.findOneAndUpdate(
      { userId: req.user.id, alertId },
      { $set: { snoozedUntil } },
      { new: true }
    );
    if (!updatedState) return res.status(404).json({ msg: 'Alert state not found' });
    res.json(updatedState);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};