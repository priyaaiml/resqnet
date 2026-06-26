const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    enum: ['flood', 'earthquake', 'fire', 'storm', 'landslide', 'accident', 'medical', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['reported', 'in-progress', 'resolved'],
    default: 'reported'
  },
  location: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  images: [{ type: String }],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedVolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }],
  affectedPeople: {
    type: Number,
    default: 0
  },
  updates: [{
    message: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Disaster', disasterSchema);