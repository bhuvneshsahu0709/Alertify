const mongoose = require('mongoose');

const UserAlertStateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert', required: true },
  status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
  snoozedUntil: { type: Date },
  lastNotifiedAt: { type: Date, default: Date.now },
  isDelivered: { type: Boolean, default: true }, // For tracking initial delivery
}, { timestamps: true });

// Compound index to ensure uniqueness and fast lookups
UserAlertStateSchema.index({ userId: 1, alertId: 1 }, { unique: true });

module.exports = mongoose.model('UserAlertState', UserAlertStateSchema);