const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['Info', 'Warning', 'Critical'], required: true },
  visibility: {
    type: { type: String, enum: ['Organization', 'Team', 'User'], required: true },
    targets: [{ type: mongoose.Schema.Types.ObjectId }] // Stores User IDs or Team IDs
  },
  startTime: { type: Date, default: Date.now },
  expiryTime: { type: Date, required: true },
  remindersEnabled: { type: Boolean, default: true },
  archived: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);