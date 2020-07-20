const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: 'Public', enum: ['Public', 'Private'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
