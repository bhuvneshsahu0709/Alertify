const Alert = require('../models/Alert');
const User = require('../models/User');
const UserAlertState = require('../models/UserAlertState');
const Team = require('../models/Team');

// Helper function to create UserAlertState records
const distributeAlert = async (alert) => {
  let targetUsers = [];
  if (alert.visibility.type === 'Organization') {
    targetUsers = await User.find({ role: 'User' }).select('_id');
  } else if (alert.visibility.type === 'Team') {
    targetUsers = await User.find({ teamId: { $in: alert.visibility.targets } }).select('_id');
  } else if (alert.visibility.type === 'User') {
    targetUsers = await User.find({ _id: { $in: alert.visibility.targets } }).select('_id');
  }

  const userAlertStates = targetUsers.map(user => ({
    userId: user._id,
    alertId: alert._id,
  }));

  if (userAlertStates.length > 0) {
    // Using insertMany for bulk creation is efficient
    await UserAlertState.insertMany(userAlertStates, { ordered: false }).catch(err => {
        // Ignore duplicate key errors if alert is redistributed
        if (err.code !== 11000) {
            console.error('Error creating user alert states:', err);
        }
    });
  }
};

exports.createAlert = async (req, res) => {
  const { title, message, severity, visibility, expiryTime, remindersEnabled } = req.body;
  try {
    const newAlert = new Alert({
      ...req.body,
      createdBy: req.user.id,
    });
    const alert = await newAlert.save();

    await distributeAlert(alert);

    res.status(201).json(alert);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ archived: false }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateAlert = async (req, res) => {
    const { id } = req.params;
    try {
        let alert = await Alert.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!alert) return res.status(404).json({ msg: 'Alert not found' });
        
        // If visibility changes, you might need to redistribute
        if (req.body.visibility) {
            await distributeAlert(alert);
        }
        
        res.json(alert);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.archiveAlert = async (req, res) => {
    const { id } = req.params;
    try {
        let alert = await Alert.findByIdAndUpdate(id, { $set: { archived: true } }, { new: true });
        if (!alert) return res.status(404).json({ msg: 'Alert not found' });
        res.json({ msg: 'Alert archived successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Endpoints to get users and teams for the UI forms
exports.getUsersAndTeams = async (req, res) => {
    try {
        const users = await User.find({ role: 'User' }).select('id name');
        const teams = await Team.find().select('id name');
        res.json({ users, teams });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};