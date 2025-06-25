// server/models/JournalEntry.js
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  content: String,
  summary: String,
  mood: String,
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // ✅ add this line
});

module.exports = mongoose.model('JournalEntry', journalSchema);
