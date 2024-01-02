const mongoose = require('mongoose');

const TOPGG = new mongoose.Schema({
  userID: { type: String, required: true },
  remindersEnabled: { type: Boolean, default: true },
  lastVoteTimestamp: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  purchasedRoles: [{ type: String }],
});

module.exports = mongoose.model('TOPGG', TOPGG);
