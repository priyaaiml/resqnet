const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    type: String,
    enum: ['medical', 'rescue', 'logistics', 'communication', 'shelter', 'food', 'other']
  }],
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  assignedDisasters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disaster'
  }],
  completedMissions: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);